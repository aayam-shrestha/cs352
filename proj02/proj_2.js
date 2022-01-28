/*
 *
 * For CS352, Calvin University Computer Science
 *
 * Aayam Shrestha -- 01/27/2022
 */

var batman = {
  radius: 0.005, // dot radius
};

$(document).ready(function () {
  batman.init();
});

batman.init = function () {
  batman.canvas = $("#canvas1")[0];
  batman.cx = batman.canvas.getContext("2d"); // get the drawing canvas
  batman.cx.fillStyle = "rgba(250,0,0,0.7)";
  batman.drawPerson();
  //   batman.drawCostume();
  batman.drawCostume((100 - $("#slider1").val()) * 1.4);

  // bind functions to events, button clicks
  $("#erasebutton").bind("click", batman.reset);
  $("#drawbutton").bind("click", batman.drawSecret);
  $("#slider1").bind("input", batman.slider);
};

// update the message below the slider with its setting
batman.slider = function (ev) {
  $("#pointcount").text($("#slider1").val());
  batman.erase();
  batman.drawCostume((100 - $("#slider1").val()) * 1.4);
};

batman.drawPerson = function () {
  // draw body
  batman.cx.fillStyle = "rgba(60, 60, 60)";
  batman.cx.fillRect(160, 220, 140, 140);

  // draw shoulders
  batman.cx.beginPath();
  batman.cx.fillStyle = "rgba(60, 60, 60)";
  batman.cx.arc(230, 220, 70, 0, Math.PI, true);
  batman.cx.fill();

  // draw head
  batman.cx.fillStyle = "rgba(247, 222, 129)";
  batman.cx.beginPath();
  batman.cx.arc(230, 140, 60, 0, 2 * Math.PI, true);
  batman.cx.fill();

  // draw hands
  batman.cx.fillStyle = "rgba(60, 60, 60)";
  batman.cx.fillRect(125, 210, 35, 100);
  batman.cx.fillRect(300, 210, 35, 100);
  batman.cx.strokeRect(125, 210, 35, 100);
  batman.cx.strokeRect(300, 210, 35, 100);
};

batman.drawCostume = function (position) {
  // Mask
  batman.cx.fillStyle = "black";
  batman.cx.strokeStyle = "black";
  batman.cx.fillRect(156, 100 - position, 142, 40);
  batman.cx.beginPath();
  batman.cx.moveTo(156, 100 - position);
  batman.cx.quadraticCurveTo(230, 10 - position, 298, 100 - position);
  //   batman.cx.arc(227, 100, 71, 0, Math.PI, true);
  batman.cx.fill();

  //Eyes
  batman.cx.fillStyle = "white";
  batman.cx.fillRect(190, 115 - position, 22, 13);
  batman.cx.fillStyle = "white";
  batman.cx.fillRect(240, 115 - position, 22, 13);

  // Ears
  batman.cx.fillStyle = "black";
  batman.cx.beginPath();
  batman.cx.moveTo(156, 100 - position);
  batman.cx.lineTo(156, 30 - position);
  batman.cx.lineTo(196, 100 - position);
  batman.cx.lineTo(156, 100 - position);
  batman.cx.fill();

  batman.cx.beginPath();
  batman.cx.moveTo(298, 100 - position);
  batman.cx.lineTo(298, 30 - position);
  batman.cx.lineTo(256, 100 - position);
  batman.cx.lineTo(298, 100 - position);
  batman.cx.fill();

  // draw logo
  batman.logo = new Image();
  batman.logo.src = "logo.png";
  batman.logo.onload = function () {
    batman.cx.drawImage(batman.logo, 190, 225 + position, 80, 60);
  };

  // draw logo background
  batman.cx.beginPath();
  batman.cx.fillStyle = "yellow";
  batman.cx.ellipse(230, 255 + position, 28, 40, Math.PI / 2, 0, 2 * Math.PI);
  batman.cx.fill();

  var tie_gradient = batman.cx.createLinearGradient(250, 300, 250, 200);
  tie_gradient.addColorStop(1, "black");
  tie_gradient.addColorStop(0, "red");

  // draw tie
  batman.cx.fillStyle = tie_gradient;
  batman.cx.beginPath();
  batman.cx.moveTo(230 + (140 - position) * 1.8, 200);
  batman.cx.lineTo(210 + (140 - position) * 1.8, 300);
  batman.cx.lineTo(230 + (140 - position) * 1.8, 320);
  batman.cx.lineTo(250 + (140 - position) * 1.8, 300);
  batman.cx.lineTo(230 + (140 - position) * 1.8, 200);
  batman.cx.lineTo(210 + (140 - position) * 1.8, 200);
  batman.cx.lineTo(230 + (140 - position) * 1.8, 220);
  batman.cx.lineTo(250 + (140 - position) * 1.8, 200);
  batman.cx.lineTo(230 + (140 - position) * 1.8, 200);
  batman.cx.fill();

  if (position == 0) {
    batman.drawGadgets();
  }
};

batman.drawSecret = function (ev) {
  // draw face
  batman.face = new Image();
  batman.face.src = "sad_linus.png";
  batman.face.onload = function () {
    batman.cx.drawImage(batman.face, 145, 45, 170, 170);
  };
};

batman.drawGadgets = function (ev) {
  // draw car
  batman.car = new Image();
  batman.car.src = "batmobile.png";
  batman.car.onload = function () {
    batman.cx.drawImage(batman.car, 300, 45, 160, 120);
  };

  // draw shar repellent spray
  batman.spray = new Image();
  batman.spray.src = "repellent.png";
  batman.spray.onload = function () {
    batman.cx.drawImage(batman.spray, 0, 55, 200, 190);
  };
};

batman.erase = function () {
  batman.cx.clearRect(0, 0, batman.canvas.width, batman.canvas.height);
  batman.drawPerson();
};

batman.reset = function () {
  batman.erase();
  document.getElementById("slider1").value = "0";
  $("#pointcount").text($("#slider1").val());
  batman.drawPerson();
  batman.drawCostume((100 - $("#slider1").val()) * 1.4);
};
