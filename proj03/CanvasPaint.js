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
  drawMode: "free",
  drawing: false,
  tool: "marker",
  lineThickness: 12,
  color: "#333399",
  initialX: 0,
  initialY: 0,
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
  $("#markerButton").bind("click", cpaint.selectMarker);
  $("#lineButton").bind("click", cpaint.selectLine);
  $("#rectButton").bind("click", cpaint.selectRect);

  // bind menu options
  $("#menuClear").bind("click", cpaint.clear);
  $("#menuNew").bind("click", cpaint.clear);
  $("#menuFade").bind("click", cpaint.fade);
  $("#menuUnfade").bind("click", cpaint.unfade);
  $("#menuBlur").bind("click", cpaint.blur);
  $("#menuSharpen").bind("click", cpaint.sharpen);
  $("#menuDetectEdges").bind("click", cpaint.detectEdges);
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
  if (cpaint.drawMode == "free") {
    cpaint.cx.moveTo(x, y);
    cpaint.cx.lineTo(x, y);
    cpaint.cx.stroke();
  } else if (cpaint.drawMode == "line" || cpaint.drawMode == "rect") {
    cpaint.initialX = x;
    cpaint.initialY = y;
  }
};

/*
 * handle mouseup events
 */
cpaint.drawEnd = function (ev) {
  var x, y; // convert event coords to (0,0) at top left of canvas
  x = ev.pageX - $(cpaint.canvas).offset().left;
  y = ev.pageY - $(cpaint.canvas).offset().top;
  ev.preventDefault();

  cpaint.cx.lineWidth = cpaint.lineThickness;
  cpaint.cx.strokeStyle = cpaint.color;
  // if (cpaint.drawMode == "line") {
  //   cpaint.cx.moveTo(cpaint.initialX, cpaint.initialY);
  //   cpaint.cx.lineTo(x, y);
  //   cpaint.cx.stroke();
  // }
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

  if (cpaint.drawMode == "free") cpaint.drawMarker(x, y);
  else if (cpaint.drawMode == "line") cpaint.drawLine(x, y);
  else if (cpaint.drawMode == "rect") cpaint.drawRect(x, y);
};

cpaint.drawMarker = function (x, y) {
  if (cpaint.drawing) {
    cpaint.cx.lineCap = "round";
    cpaint.cx.lineTo(x, y);
    cpaint.cx.stroke();
    cpaint.cx.beginPath(); // draw initial stroke
    cpaint.cx.moveTo(x, y);
  }
};

cpaint.drawLine = function (x, y) {
  if (cpaint.drawing) {
    cpaint.cx.lineCap = "round";
    cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height); // clear screen
    cpaint.cx.putImageData(cpaint.imgData, 0, 0); // restore previous picture
    cpaint.cx.beginPath();
    cpaint.cx.moveTo(cpaint.initialX, cpaint.initialY);
    cpaint.cx.lineTo(x, y);
    cpaint.cx.stroke();
    cpaint.cx.closePath();
  }
};

cpaint.drawRect = function (x, y) {
  if (cpaint.drawing) {
    // cpaint.cx.lineCap = "round";
    // cpaint.cx.lineWidth = cpaint.lineThickness;
    cpaint.cx.fillStyle = cpaint.color;
    cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height); // clear screen
    cpaint.cx.putImageData(cpaint.imgData, 0, 0); // restore previous picture
    cpaint.cx.fillRect(
      cpaint.initialX,
      cpaint.initialY,
      x - cpaint.initialX,
      y - cpaint.initialY
    );
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
 * line tool handler
 */
cpaint.selectLine = function (ev) {
  $("#messages").prepend("Line tool selected<br>");
  cpaint.drawMode = "line";
  cpaint.colorChange();
};

/*
 * rectangle tool handler
 */
cpaint.selectRect = function (ev) {
  $("#messages").prepend("Rectangle tool selected<br>");
  cpaint.drawMode = "rect";
  cpaint.colorChange();
};

/*
 * color picker widget handler
 */
cpaint.colorChange = function (ev) {
  $("#messages").prepend("Color: " + $("#color1").val() + "<br>");
  cpaint.color = $("#color1").val();
};

cpaint.selectMarker = function () {
  $("#messages").prepend("Marker selected<br>");
  cpaint.drawMode = "free";
  cpaint.colorChange();
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
  cpaint.drawMode = "free";
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
  console.log(pix.length);
  console.log(cpaint.imgData.height * cpaint.imgData.width * 4);
  for (var i = 0; i < pix.length; i += 4) {
    pix[i + 3] *= 2; // increase alpha of each pixel
  }
  cpaint.cx.putImageData(cpaint.imgData, 0, 0);
};

cpaint.blur = function (ev) {
  $("#messages").prepend("Blur<br>");
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  cpaint.blur = new ImageData(cpaint.canvas.width, cpaint.canvas.height);

  var pix = cpaint.imgData.data;
  var blurMatrix = [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ];
  var red = 0,
    green = 0,
    blue = 0,
    alpha = 0;

  for (var row = 0; row < cpaint.canvas.height; row += 1) {
    for (var col = 0; col < cpaint.canvas.width; col += 1) {
      var destNum = 4 * row * cpaint.canvas.width + col * 4;
      for (var y = 0; y < 3; y += 1) {
        for (var x = 0; x < 3; x += 1) {
          var sourceNum =
            4 * (row - 1 + y) * cpaint.canvas.width + (col - 1 + x) * 4;
          red += pix[sourceNum] * blurMatrix[x][y];
          green += pix[sourceNum + 1] * blurMatrix[x][y];
          blue += pix[sourceNum + 2] * blurMatrix[x][y];
          alpha += pix[sourceNum + 3] * blurMatrix[x][y];
        }
      }
      cpaint.blur.data[destNum] = red;
      cpaint.blur.data[destNum + 1] = green;
      cpaint.blur.data[destNum + 2] = blue;
      cpaint.blur.data[destNum + 3] = alpha;

      red = 0;
      blue = 0;
      green = 0;
      alpha = 0;
    }
  }
  cpaint.cx.putImageData(cpaint.blur, 0, 0);
};

cpaint.sharpen = function (ev) {
  $("#messages").prepend("Sharpen<br>");
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  cpaint.sharpen = new ImageData(cpaint.canvas.width, cpaint.canvas.height);

  var pix = cpaint.imgData.data;
  var sharpenMatrix = [
    [-1 / 8, -1 / 8, -1 / 8],
    [-1 / 8, 2, -1 / 8],
    [-1 / 8, -1 / 8, -1 / 8],
  ];
  var red = 0,
    green = 0,
    blue = 0,
    alpha = 0;

  for (var row = 0; row < cpaint.canvas.height; row += 1) {
    for (var col = 0; col < cpaint.canvas.width; col += 1) {
      var destNum = 4 * row * cpaint.canvas.width + col * 4;
      for (var y = 0; y < 3; y += 1) {
        for (var x = 0; x < 3; x += 1) {
          var sourceNum =
            4 * (row - 1 + y) * cpaint.canvas.width + (col - 1 + x) * 4;
          red += pix[sourceNum] * sharpenMatrix[x][y];
          green += pix[sourceNum + 1] * sharpenMatrix[x][y];
          blue += pix[sourceNum + 2] * sharpenMatrix[x][y];
          alpha += pix[sourceNum + 3] * sharpenMatrix[x][y];
        }
      }
      cpaint.sharpen.data[destNum] = red;
      cpaint.sharpen.data[destNum + 1] = green;
      cpaint.sharpen.data[destNum + 2] = blue;
      cpaint.sharpen.data[destNum + 3] = alpha;

      red = 0;
      blue = 0;
      green = 0;
      alpha = 0;
    }
  }
  cpaint.cx.putImageData(cpaint.sharpen, 0, 0);
};

cpaint.detectEdges = function (ev) {
  $("#messages").prepend("Detect Edges<br>");
  cpaint.imgData = cpaint.cx.getImageData(
    0,
    0,
    cpaint.canvas.width,
    cpaint.canvas.height
  );
  cpaint.edges = new ImageData(cpaint.canvas.width, cpaint.canvas.height);
  var pix = cpaint.imgData.data;

  var sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];

  var sobelY = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
  ];

  var redX = 0,
    greenX = 0,
    blueX = 0,
    alphaX = 0;
  var redY = 0,
    greenY = 0,
    blueY = 0,
    alphaY = 0;
  var finalRed = 0,
    finalGreen = 0,
    finalBlue = 0,
    finalAlpha = 0;
  for (var row = 0; row < cpaint.canvas.height; row += 1) {
    for (var col = 0; col < cpaint.canvas.width; col += 1) {
      var destNum = 4 * row * cpaint.canvas.width + col * 4;
      for (var y = 0; y < 3; y += 1) {
        for (var x = 0; x < 3; x += 1) {
          var sourceNum =
            4 * (row - 1 + y) * cpaint.canvas.width + (col - 1 + x) * 4;
          redX += pix[sourceNum] * sobelX[x][y];
          greenX += pix[sourceNum + 1] * sobelX[x][y];
          blueX += pix[sourceNum + 2] * sobelX[x][y];
          alphaX += pix[sourceNum + 3] * sobelX[x][y];

          redY += pix[sourceNum] * sobelY[x][y];
          greenY += pix[sourceNum + 1] * sobelY[x][y];
          blueY += pix[sourceNum + 2] * sobelY[x][y];
          alphaY += pix[sourceNum + 3] * sobelY[x][y];
        }
      }
      finalRed = Math.sqrt(redX ** 2 + redY ** 2);
      finalGreen = Math.sqrt(greenX ** 2 + greenY ** 2);
      finalBlue = Math.sqrt(blueX ** 2 + blueY ** 2);
      finalAlpha = Math.sqrt(alphaX ** 2 + alphaY ** 2);

      if ((finalRed + finalGreen + finalBlue) / 3 > 80) {
        cpaint.edges.data[destNum] = 255;
        cpaint.edges.data[destNum + 1] = 255;
        cpaint.edges.data[destNum + 2] = 255;
        cpaint.edges.data[destNum + 3] = 255;
      } else {
        cpaint.edges.data[destNum] = 0;
        cpaint.edges.data[destNum + 1] = 0;
        cpaint.edges.data[destNum + 2] = 0;
        cpaint.edges.data[destNum + 3] = 255;
      }

      redX = 0;
      redY = 0;
      blueX = 0;
      blueY = 0;
      greenX = 0;
      greenY = 0;
      alphaX = 0;
      alphaY = 0;
    }
  }

  cpaint.cx.putImageData(cpaint.edges, 0, 0);
};
