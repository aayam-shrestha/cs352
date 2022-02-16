// Submitted by: Aayam Shrestha
// Date: 1/15/2022
// CS352 - Project 4

var train = {};
var thomas, station;
var thomasX = 20;
var thomasDir = 1;
var intervalID, time = 0, step = 5, start = 0;

$(document).ready(function () {
  train.init();
});

train.init = function () {
  train.canvas = $("#canvas1")[0];
  train.cx = train.canvas.getContext("2d");
  // train.cx.setTransform(1, 0, 0, 1, 360, 270);

  $("#gobutton").bind("click", train.go);
  $("#stopbutton").bind("click", train.stop);
  //   $("#slider1").bind("change", train.slider);

  train.loadImages();
  $('#messageWindow').prepend("Starting the train...");
  thomas.onload = function () {
    train.animate();
  }
};

train.go = function () {
  intervalID = setInterval(train.animate, 15);
};

train.stop = function () {
  clearInterval(intervalID);
};

train.animate = function () {
  step = parseInt($('#slider1').val());
  time += step;
  timefrac = time / 10;
  $('#pointcount').text(step);
  $('#timecount').text(time);

  // drawing the background
  train.cx.drawImage(station, 0, 0);

  train.cx.save();
  train.cx.translate(thomasX, 0);

  if (thomasX <= 900) {
    thomasX += step / 2;
  } else {
    thomasX = -390;
  }

  train.cx.drawImage(thomas, -50, 250, 450, 250); // drawing thomas
  train.cx.fillStyle = '#8321d9';
  train.cx.fillRect(70, 240, 50, 50); // body
  train.cx.arc(95, 245, 25, Math.PI, 0);  // shoulders
  train.cx.fill();
  train.cx.beginPath();
  train.cx.fillStyle = "#dbc06e";
  train.cx.arc(95, 215, 22, 0, 2 * Math.PI); // head
  train.cx.fill();
  train.cx.restore();

  train.cx.beginPath();
  train.cx.save();
  train.cx.fillStyle = "#8321d9";
  train.cx.translate(thomasX, 0);
  train.cx.translate(66, 240);
  train.cx.rotate(Math.sin(timefrac / 10) - 30);
  train.cx.fillRect(0, 0, 15, 40); // left arm
  train.cx.restore();

  train.cx.beginPath();
  train.cx.save();
  train.cx.fillStyle = "#8321d9";
  train.cx.translate(thomasX, 0);
  train.cx.translate(114, 248);
  train.cx.rotate(Math.sin(timefrac / 10) + 30);
  train.cx.fillRect(0, 0, 15, 40); // left arm
  train.cx.restore();

  train.cx.save();
  train.cx.translate(thomasX - 20, 0);
  train.cx.beginPath();
  train.cx.fillStyle = "black";
  train.cx.arc(108, 210, 3, 2 * Math.PI, 0);  // left eye
  train.cx.arc(122, 210, 3, 2 * Math.PI, 0);  // right eye  
  train.cx.fill();
  train.cx.beginPath();
  train.cx.arc(115, 225, (Math.sin(timefrac / 10) * 2) + 6, 2 * Math.PI, 0);  // mouth
  train.cx.fill();
  train.cx.restore();
  train.cx.beginPath();
}

train.loadImages = function () {
  thomas = new Image(); thomas.src = 'images/thomas.png';
  thomas_back = new Image(); thomas_back.src = 'images/thomas2.png';
  station = new Image(); station.src = 'images/station.jpg';
}