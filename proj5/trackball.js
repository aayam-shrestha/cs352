/*
 * trackball -- starter code for CS352 object viewer project
 * that reads in JSON objects in our custom format.
 *
 * Created for CS352, Calvin College Computer Science
 *
 * Harry Plantinga 
 */

var vertices;			// array of object vertices
var faces;			// array of object faces (with colors)
var modelMat, oldModelMat;	// current, old modelview matrix
var projectionMat;
var trackball = {
  screenWidth:  450,
  screenHeight: 342,
  radius:       150,
};

$(document).ready(function () { trackball.init(); });

/*
 * initialize: get context, bind events, set screen transform, load object
 */
trackball.init = function () {  
  $('#messages').html("Initializing<br>");
  trackball.canvas  = $('#canvas1')[0];
  trackball.cx = trackball.canvas.getContext('2d');
  trackball.cx.strokeStyle = 'rgb(250,0,0)';
  trackball.cx.lineWidth = 0.003;
  
  $('*').bind("change",trackball.display);
  $('#zoomSlider').bind("change",trackball.zoom);
  $('#perspectiveSlider').bind("change",trackball.perspective);
  $('#object1').bind("change",trackball.load);
  $('#resetButton').bind("click",trackball.init);
  
  // set world coords to (-1,-1) to (1,1) or so
  trackball.cx.setTransform(trackball.radius, 0, 0, -trackball.radius, 
        trackball.screenWidth/2, trackball.screenHeight/2 ); 
  trackball.load();
}

/*
 * Get selected JSON object file
 */
trackball.load = function() {
  var objectURL = $('#object1').val();
  log("Loading " + $('#object1').val());

  $.getJSON(objectURL, function(data) { 
    log("JSON file received");
    trackball.loadObject(data); 
    trackball.display();
  }); 
}

/*
 * load object. Scale it to (roughly) fit in sphere centered on origin, with radius 1.
 * result stored in global arrays for simplicity:
 *   vertices[i] -- array of sylvester vectors
 *   faces[i] -- array of polygons to display
 *   faces[i].indices[j] -- array of vertex indices of faces
 *   faces[i].Kd[j] -- array of three diffuse color values for face, r, g, and b
 */
trackball.loadObject = function(obj) {
  $('#messages').html("In loadObject<br>");
  vertices = new Array(); 

  // find min and max coordinate values;
  var mins = new Array(), maxes = new Array();
  for (var k=0; k<3; k++) {
    maxes[k]=-1e300, mins[k]=1e300;
    for (var i=0+k; i<obj.vertexPositions.length; i+=3) {
      if (maxes[k] < obj.vertexPositions[i]) maxes[k] = obj.vertexPositions[i];
      if (mins[k] > obj.vertexPositions[i]) mins[k] = obj.vertexPositions[i];
    }
  }

  // normalize coordinates (center on origin, radius 1)]
  var dx = (mins[0] + maxes[0])/2;
  var dy = (mins[1] + maxes[1])/2;
  var dz = (mins[2] + maxes[2])/2;
  var scaleFactor = Math.max(maxes[0]-mins[0], maxes[1]-mins[1], maxes[2]-mins[2]) * .85;
  for (var i=0; i<obj.vertexPositions.length; i+=3) {
    obj.vertexPositions[i] =   (obj.vertexPositions[i] - dx) / scaleFactor;
    obj.vertexPositions[i+1] = (obj.vertexPositions[i+1] - dy) / scaleFactor;
    obj.vertexPositions[i+2] = (obj.vertexPositions[i+2] - dz) / scaleFactor;
  }
  log("Read " + i/3 + " vertices");

  // make vertex positions into vertex array of sylvester vectors 
  // $V([]) is a sylvester function for creating a vector -- see sylvester docs
  for (var i=0; i<obj.vertexPositions.length/3; i++) {
    vertices[i] = $V([obj.vertexPositions[3*i], obj.vertexPositions[3*i+1],
        obj.vertexPositions[3*i+2], 1]);
    if (i<3) log("&nbsp;vertex " + i + ": " + trackball.showVector(vertices[i])); 
    if (i==3) log("&nbsp;...");
  }

  // make the faces array, with indices and Kd arrays as properties
  var f=0;
  faces = new Array();
  for (var g=0; g<obj.groups.length; g++) {
    for (i=0; i<obj.groups[g].faces.length; i++) {
      faces[f] = {};
      faces[f].indices = obj.groups[g].faces[i];
      faces[f].Kd = obj.groups[g].Kd;
    if (f<3) log("&nbsp;face " + f + ": " + faces[f].indices); 
    if (f==3) log("&nbsp;...");
    f++;
    }
  }
}  


/*
 * Homogeneous 3D rotation
 */ 
trackball.Rotate4 = function(theta,n) {
    var m1 = Matrix.Rotation(theta,n);
    return Matrix.create([ 
        [m1.e(1,1), m1.e(1,2), m1.e(1,3), 0],
        [m1.e(2,1), m1.e(2,2), m1.e(2,3), 0],
        [m1.e(3,1), m1.e(3,2), m1.e(3,3), 0],
        [0, 0, 0, 1]]);
}
    
trackball.display = function() {
  trackball.cx.clearRect(-2,-2,4,4);
  trackball.cx.beginPath();
  trackball.cx.arc(0,0,1,6.283,0,true);
  trackball.cx.stroke();
}

trackball.zoom = function(ev) {
  $('#zoom').text(($('#zoomSlider').val()/100).toFixed(2));
  var scale = $('#zoomSlider').val() / 100;
}

trackball.perspective = function(ev) {
  $('#perspective').text(($('#perspectiveSlider').val()/10).toFixed(2));
  var persp = $('#perspectiveSlider').val() / 10;
}

trackball.showVector = function(v) {
  return "[" + v.e(1).toFixed(2) + ", " + v.e(2).toFixed(2) + ", " + v.e(3).toFixed(2) + "]";
}

log = function(s) {
   if ($('#debugCheckbox').attr('checked'))
     $('#messages').append(s + "<br>");
}

