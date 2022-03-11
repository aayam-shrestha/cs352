/*
 * trackball -- load a JSON object, display in virtual trackball
 * Created for CS352, Calvin College Computer Science
 *
 * object format is a simple JSON file with an array of vertex positions
 * and indices. All faces are assumed to be triangles.
 *
 * updated 2019 -- it does more for you
 *
 * Harry Plantinga -- February 2011
 * 
 * Modified by: Aayam Shrestha
 * Date: 3/10/2022
 */

var vertices, faces, v;
var initialDir;         // initial direction to mouse position before movement
var modelMat;	          // modeling matrix
var previousModelMat;   // stores state of modelview matrix on mousedown
var projectionMat;      // projection matrix
var trackball = {
  screenWidth: 450,
  screenHeight: 342,
  radius: 150,
  light: $V([0, 0, 1]).toUnitVector(),
  tracking: false,
  ambient: 0.4,
};

$(document).ready(function () { trackball.init(); });

trackball.init = function () {
  $('#messages').html("Initializing<br>");
  trackball.canvas = $('#canvas1')[0];
  trackball.cx = trackball.canvas.getContext('2d');
  trackball.cx.strokeStyle = 'rgb(150,60,30)';
  trackball.cx.fillStyle = 'rgb(220,220,220)';
  trackball.cx.lineWidth = 0.003;

  $('*').bind("change", trackball.display);
  $('#zoomSlider').bind("change", trackball.zoom);
  $('#object1').bind("change", trackball.load);
  $('#resetButton').bind("click", trackball.init);
  $('#perspectiveCheckbox').bind("change", trackball.setProjection);
  $('#perspectiveSlider').bind("change", trackball.perspective);
  $(trackball.canvas).bind('mousedown', trackball.mouseDown);
  $(trackball.canvas).bind('mousemove', trackball.mouseMove);
  $(trackball.canvas).bind('mouseup', trackball.mouseUp);

  // set world coords to (-1,-1) to (1,1) or so
  trackball.cx.setTransform(trackball.radius, 0, 0, -trackball.radius,
    trackball.screenWidth / 2, trackball.screenHeight / 2);

  modelMat = Matrix.I(4);
  trackball.setProjection();
  trackball.load();
}

/*
 * set up projection matrix
 */
trackball.setProjection = function () {
  var scale = $('#zoomSlider').val() / 100;
  var d = $('#perspectiveSlider').val() / 10;

  if ($('#perspectiveCheckbox').attr('checked')) {
    projectionMat = Matrix.create([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, -1 / d, 1]
    ]);
  }
  else {
    projectionMat = Matrix.create([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
  }
}

/*
 * Get selected JSON object file
 */
trackball.load = function () {
  var objectURL = $('#object1').val();
  log("Loading " + $('#object1').val());

  $.getJSON(objectURL, function (data) {
    log("JSON file received");
    trackball.loadObject(data);
    trackball.display();
  });
}

/*
 * load object. Scale it to fit in sphere centered on origin, with radius 1.
 * result:
 *   vertices[i] -- array of sylvester vectors
 *   faces[i] -- array of polygons to display
 *            -- faces[i].indices[j] -- array of vertex indices of faces
 *            -- faces[i].Kd[j] -- array of three reflectivity values, r, g, and b
 */
trackball.loadObject = function (obj) {
  vertices = new Array();
  log("In loadObject<br>");

  // find min and max coordinate values;
  var mins = new Array(), maxes = new Array();
  for (var k = 0; k < 3; k++) {
    maxes[k] = -1e300, mins[k] = 1e300;
    for (var i = 0 + k; i < obj.vertexPositions.length; i += 3) {
      if (maxes[k] < obj.vertexPositions[i]) maxes[k] = obj.vertexPositions[i];
      if (mins[k] > obj.vertexPositions[i]) mins[k] = obj.vertexPositions[i];
    }
    log("mins[" + k + "]: " + mins[k] + " maxes[" + k + "]: " + maxes[k]);
  }

  // normalize coordinates (center on origin, radius 1)]
  var dx = (mins[0] + maxes[0]) / 2;
  var dy = (mins[1] + maxes[1]) / 2;
  var dz = (mins[2] + maxes[2]) / 2;

  // make it a little smaller than 2x2 so it's more likely to fit in the circle
  var scaleFactor = Math.max(maxes[0] - mins[0], maxes[1] - mins[1], maxes[2] - mins[2]) * .85;
  for (var i = 0; i < obj.vertexPositions.length; i += 3) {
    obj.vertexPositions[i] = (obj.vertexPositions[i] - dx) / scaleFactor;
    obj.vertexPositions[i + 1] = (obj.vertexPositions[i + 1] - dy) / scaleFactor;
    obj.vertexPositions[i + 2] = (obj.vertexPositions[i + 2] - dz) / scaleFactor;
  }
  log(i / 3 + " vertices");

  // make vertex positions into vertex array of sylvester vectors 
  for (var i = 0; i < obj.vertexPositions.length / 3; i++) {
    vertices[i] = $V([obj.vertexPositions[3 * i], obj.vertexPositions[3 * i + 1],
    obj.vertexPositions[3 * i + 2], 1]);
  }

  // make the faces array, with indices and Kd arrays as properties
  var f = 0;
  groups = new Array();
  faces = new Array();
  for (var g = 0; g < obj.groups.length; g++) {
    for (i = 0; i < obj.groups[g].faces.length; i++) {
      faces[f] = {};
      faces[f].indices = obj.groups[g].faces[i];
      faces[f].Kd = obj.groups[g].Kd;
      //    log("&nbsp;face " + i + ": " + faces[f].indices + " Kd: " + faces[f].Kd);
      //    log("Group " + g + " (" + "Kd: " + obj.groups[g].Kd + "):");
      f++;
    }
  }
}

/*
 * sylvester doesn't have homogeneous transforms, sigh
 */
trackball.rotation = function (theta, n) {
  var m1 = Matrix.Rotation(theta, n);
  var m2 = Matrix.create([
    [m1.e(1, 1), m1.e(1, 2), m1.e(1, 3), 0],
    [m1.e(2, 1), m1.e(2, 2), m1.e(2, 3), 0],
    [m1.e(3, 1), m1.e(3, 2), m1.e(3, 3), 0],
    [0, 0, 0, 1]]);
  return m2;
}

trackball.mouseDown = function (ev) {
  ev.preventDefault();
  trackball.tracking = true;    // begin tracking

  // storing the vector pointing to initial position of mouse
  trackball.initialMouseDir = trackball.mouseDirection(ev);

  // storing the initial modelview matrix on mousedown before mousemove
  previousModelMat = modelMat;
}

trackball.mouseMove = function (ev) {
  ev.preventDefault();
  var axis, newMouseDir, theta;
  if (trackball.tracking) {
    newMouseDir = trackball.mouseDirection(ev); // computing the new vector pointing in the new direction of mouse
    axis = trackball.initialMouseDir.cross(newMouseDir); // gives the axis of rotation
    theta = trackball.initialMouseDir.angleFrom(newMouseDir); // gives the angle to rotate

    modelMat = previousModelMat;
    modelMat = (trackball.rotation(theta, axis)).multiply(modelMat);
    trackball.display();
  }
}

trackball.mouseUp = function (ev) {
  trackball.tracking = false;
}

trackball.mouseDirection = function (ev) {
  let mouseX, mouseY, x, y, z, zSquare;

  // converting mouse position from page coordinates to canvas coordinates by removing the offset
  mouseX = ev.pageX - $(trackball.canvas).offset().left;
  mouseY = ev.pageY - $(trackball.canvas).offset().top;

  // finding the vector in the direction of where the mouse touches the trackball
  x = (mouseX - trackball.screenWidth / 2) / trackball.radius;
  y = (trackball.screenHeight / 2 - mouseY) / trackball.radius;

  // Compute z based on x and y (since we have a unit circle)
  zSquare = 1 - x * x - y * y;

  // if mouse is outside unit circle
  if (zSquare < 0)
    zSquare = 0;
  z = Math.sqrt(zSquare);

  return Vector.create([x, y, z]);;
}

/*
 * display the object:
 *   - transform vertices according to modelview matrix
 *   - sort the faces (todo)
 *   - light the faces (todo)
 *   - divide by w (todo)
 *   - draw the faces (with culling)
 */
trackball.display = function () {
  trackball.cx.clearRect(-2, -2, 4, 4);    // erase and draw circle
  trackball.cx.beginPath();
  trackball.cx.arc(0, 0, 1, 6.283, 0, true);
  trackball.cx.stroke();

  v = new Array();                      // apply modeling matrix; result v
  var p;
  var m = projectionMat.multiply(modelMat);
  for (var i = 0; i < vertices.length; i++) {
    p = m.multiply(vertices[i]);

    // dividing by w to convert homogeneous coordinates to 3 space
    v[i] = $V([p.e(1) / p.e(4), p.e(2) / p.e(4), p.e(3) / p.e(4)]);
  }

  // create f[] array to store the order in which faces should be drawn.
  // To sort faces, you can just change the entries in f[]
  var f = new Array();
  for (i = 0; i < faces.length; i++) {
    f[i] = i;
  }
  // Sorting the faces by average z value if HSR box is checked
  if ($('#sortCheckbox').attr('checked'))
    f.sort(trackball.hiddenSurfaceRemoval);

  // display the faces
  var v1, v2, v3, faceNorm, faceVisible;

  for (i = 0; i < faces.length; i++) {
    //v1, v2, and v3 are the vertices of face[i]
    v1 = v[faces[f[i]].indices[0]];
    v2 = v[faces[f[i]].indices[1]];
    v3 = v[faces[f[i]].indices[2]];

    // v2 - v1 and v3 - v2 give us the vectors along the face
    // the cross product of these resulting vectors gives us the 
    // surface normal of the face
    faceNorm = ((v2.subtract(v1)).cross(v3.subtract(v2))).toUnitVector();

    // set face color to what was in the object file -- max 200
    var r = Math.floor(faces[f[i]].Kd[0] * 200);
    var g = Math.floor(faces[f[i]].Kd[1] * 200);
    var b = Math.floor(faces[f[i]].Kd[2] * 200);

    if ($('#lightCheckbox').attr('checked')) {
      var diffuse = -1 * faceNorm.dot(trackball.light);
      if (diffuse < 0) diffuse = -diffuse;
      diffuse += trackball.ambient;

      r = Math.floor(r * diffuse);
      g = Math.floor(g * diffuse);
      b = Math.floor(b * diffuse);
    }

    trackball.cx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    trackball.cx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";

    // faceNorm.e(3) gives us the third element or the z-element of the normal vector
    // If faceNorm.e(3) is negative, then the normal vector is pointing towards the viewer
    // and the face is visible
    if (faceNorm.e(3) < 0)
      faceVisible = true;

    // if surface normal is away from viewer and backface culling is on, don't draw the face
    if ((!faceVisible && $('#cullCheckbox').attr("checked"))
      // if surface normal is toward viewer and frontface culling is on, don't draw the face
      || (faceVisible && $('#cullFrontCheckbox').attr("checked"))) {
      // don't draw anything
    } else {
      // draw face
      trackball.cx.beginPath();
      trackball.cx.moveTo(v[faces[f[i]].indices[0]].e(1), v[faces[f[i]].indices[0]].e(2));
      for (j = 1; j < faces[f[i]].indices.length; j++)
        trackball.cx.lineTo(v[faces[f[i]].indices[j]].e(1), v[faces[f[i]].indices[j]].e(2));
      trackball.cx.closePath();

      if ($('#strokeCheckbox').attr('checked'))
        trackball.cx.stroke();
      if ($('#fillCheckbox').attr('checked'))
        trackball.cx.fill();
    }
  }
}

/*
 * this function doesn't really need to do anything -- it all happens in the 
 * animate function. Of course, that means the zoom slider doesn't respond
 * to a changed value for up to 1/100 of a second...
 */
trackball.zoom = function (ev) {
  $('#zoom').text(($('#zoomSlider').val() / 100).toFixed(2));
  var scale = $('#zoomSlider').val() / 100;
  modelMat = Matrix.Diagonal([scale, scale, scale, 1]);
}

trackball.perspective = function (ev) {
  $('#perspective').text(($('#perspectiveSlider').val() / 10).toFixed(2));
  trackball.setProjection();
}

trackball.showVector = function (v) {
  return "[" + v.e(1).toFixed(2) + ", " + v.e(2).toFixed(2) + ", " + v.e(3).toFixed(2) + "]";
}

log = function (s) {
  if ($('#debugCheckbox').attr('checked'))
    $('#messages').append(s + "<br>");
}

// function to sort faces by average z values
trackball.hiddenSurfaceRemoval = function (a, b) {
  avg_a = 0; avg_b = 0;

  // summing the z values of each vertex
  for (var i = 0; i < faces[a].indices.length; i++) {
    avg_a += v[faces[a].indices[i]].e(3);
  }
  avg_a /= faces[a].indices.length;

  for (var i = 0; i < faces[b].indices.length; i++) {
    avg_b += v[faces[b].indices[i]].e(3);
  }
  avg_b /= faces[b].indices.length;

  return avg_a - avg_b;
}