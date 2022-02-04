/*
 * CanvasPaint 352 -- starter code for a paint program using the
 * HTML5 canvas element--for CS352, Calvin College Computer Science
 *
 * Begun by: Harry Plantinga -- January 2011
 * Completed by: Aayam Shrestha
 * Date: 02/05/2022
 */

$(document).ready(function () {
  cpaint.init();
});

var cpaint = {
  drawing: false,
  tool: "marker",
  lineThickness: 12,
  color: "#333399",
};

cpaint.init = function () {
  cpaint.canvas = $("#canvas1")[0];
  cpaint.cx = cpaint.canvas.getContext("2d");
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  // create offscreen copy of canvas in an image

  // bind functions to events, button clicks
  $(cpaint.canvas).bind("mousedown", cpaint.drawStart);
  $(cpaint.canvas).bind("mousemove", cpaint.draw);
  $("*").bind("mouseup", cpaint.drawEnd);
  $("#color1").bind("change", cpaint.colorChange);
  $("#color1").colorPicker(); // initialize color picker
  $("#mainmenu").clickMenu(); // initialize menu
  $("#widthSlider").bind("change", cpaint.thicknessChange);
  $("#clearButton").bind("click", cpaint.clear);
  $("#eraserButton").bind("click", cpaint.erase);
  $("#markerButton").bind("click", cpaint.colorChange);

  // bind menu options
  $("#menuClear").bind("click", cpaint.clear);
  $("#menuNew").bind("click", cpaint.clear);
  $("#menuFade").bind("click", cpaint.fade);
  $("#menuUnfade").bind("click", cpaint.unfade);
  $("#menuOpen").bind("click", cpaint.open);
  $("#menuSave").bind("click", cpaint.save);
  $("#toolBar").show(); // when toolbar is initialized, make it visible
};

/*
 * handle mousedown events
 */
cpaint.drawStart = function (ev) {
  var x, y; // convert event coords to (0,0) at top left of canvas
  x = ev.pageX - $(cpaint.canvas).offset().left;
  y = ev.pageY - $(cpaint.canvas).offset().top;
  ev.preventDefault();

  cpaint.drawing = true; // go into drawing mode
  cpaint.cx.lineWidth = cpaint.lineThickness;
  cpaint.cx.strokeStyle = cpaint.color;
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  // save drawing window contents
  cpaint.cx.moveTo(x, y);
  cpaint.cx.lineTo(x, y);
  cpaint.cx.stroke();
};

/*
 * handle mouseup events
 */
cpaint.drawEnd = function (ev) {
  cpaint.drawing = false;
  cpaint.cx.beginPath();
};

/*
 * handle mousemove events
 */
cpaint.draw = function (ev) {
  var x, y;
  x = ev.pageX - $(cpaint.canvas).offset().left;
  y = ev.pageY - $(cpaint.canvas).offset().top;

  if (cpaint.drawing) {
    cpaint.cx.lineCap = "round";
    cpaint.cx.lineTo(x, y);
    cpaint.cx.stroke();
    cpaint.cx.beginPath(); // draw initial stroke
    cpaint.cx.moveTo(x, y);
  }
};

/*
 * clear the canvas, offscreen buffer, and message box
 */
cpaint.clear = function (ev) {
  cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  $("#messages").prepend("Canvas cleared<br>");
};

/*
 * color picker widget handler
 */
cpaint.colorChange = function (ev) {
  $("#messages").prepend("Color: " + $("#color1").val() + "<br>");
  cpaint.color = $("#color1").val();
};

/*
 * line thickness slider handler
 */
cpaint.thicknessChange = function (ev) {
  $("#messages").prepend("Thickness: " + $("#widthSlider").val() + "<br>");
  cpaint.lineThickness = $("#widthSlider").val();
};

/*
 * toolbar erase button handler
 */
cpaint.erase = function (ev) {
  $("#messages").prepend("Erasing<br>");
  cpaint.color = $("#canvas1").css("backgroundColor");
};

/*
 * handle open menu item by making open dialog visible
 */
cpaint.open = function (ev) {
  $("#fileInput").show();
  $("#file1").bind("change submit", cpaint.loadFile);
  $("#closeBox1").bind("click", cpaint.closeDialog);
  $("#messages").prepend("In open<br>");
};

/*
 * load the image whose URL has been typed in
 * (this should have some error handling)
 */
cpaint.loadFile = function () {
  $("#fileInput").hide();
  $("#messages").prepend("In loadFile<br>");
  var img = document.createElement("img");
  var file1 = $("#file1").val();
  $("#messages").prepend("Loading image " + file1 + "<br>");

  img.src = file1;
  img.onload = function () {
    cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height);
    cpaint.cx.drawImage(img, 0, 0, cpaint.canvas.width, cpaint.canvas.height);
  };
};

cpaint.closeDialog = function () {
  $("#fileInput").hide();
};

/*
 * to save a drawing, copy it into an image element
 * which can be right-clicked and save-ased
 */
cpaint.save = function (ev) {
  $("#messages").prepend("Saving...<br>");
  var dataURL = cpaint.canvas.toDataURL();
  if (dataURL) {
    $("#saveWindow").show();
    $("#saveImg").attr("src", dataURL);
    $("#closeBox2").bind("click", cpaint.closeSaveWindow);
  } else {
    alert(
      "Your browser doesn't implement the toDataURL() method needed to save images."
    );
  }
};

cpaint.closeSaveWindow = function () {
  $("#saveWindow").hide();
};

/*
 * Fade/unfade an image by altering Alpha of each pixel
 */
cpaint.fade = function (ev) {
  $("#messages").prepend("Fade<br>");
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  var pix = cpaint.imgData.data;
  for (var i = 0; i < pix.length; i += 4) {
    pix[i + 3] /= 2; // reduce alpha of each pixel
  }
  cpaint.cx.putImageData(cpaint.imgData, 0, 0);
};

cpaint.unfade = function (ev) {
  $("#messages").prepend("Unfade<br>");
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  var pix = cpaint.imgData.data;
  for (var i = 0; i < pix.length; i += 4) {
    pix[i + 3] *= 2; // increase alpha of each pixel
  }
  cpaint.cx.putImageData(cpaint.imgData, 0, 0);
};
