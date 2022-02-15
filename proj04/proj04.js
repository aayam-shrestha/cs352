var train = {};
var thomas, station;
var thomasX = 20;
var thomasDir = 1;
var intervalID, time = 0, step = 5;

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
  $('#timecount').text(time);

  // change direction if x-value hits either edge
  if (thomasX > 540) {
    thomasDir = -1;
  } else if (thomasX <= 1) {
    thomasDir = 1;
  }

  // if direction is positive, increment x-value to move right
  if (thomasDir == 1) {
    thomasX += 3;
  }
  // else decrement x-value to move left
  else {
    thomasX -= 3;
  }

  train.cx.drawImage(station, 0, 0);
  train.cx.save();

  train.cx.translate(thomasX, 0);

  // translating train
  // if thomas is going right(direction is positive), use first image
  if (thomasDir == 1) {
    train.cx.drawImage(thomas, -50, 250, 450, 250);
    // otherwise, use second image
  } else {
    train.cx.drawImage(thomas_back, -50, 250, 450, 250);
  }
  train.cx.setTransform(1, 0, 0, 1, 0, 0);

  //translating person
  if (thomasDir == 1) {
    train.cx.translate(thomasX, 0);
  } else {
    train.cx.translate(thomasX + 150, 0);
  }
  train.cx.fillStyle = '#49de67';
  train.cx.fillRect(70, 240, 50, 50);
  train.cx.arc(95, 245, 25, Math.PI, 0);
  train.cx.fill();
  train.cx.beginPath();
  train.cx.fillStyle = "#dbc06e";
  train.cx.arc(95, 215, 22, 0, 2 * Math.PI);
  train.cx.fill();

  train.cx.beginPath();
  train.cx.restore();
}

train.loadImages = function () {
  thomas = new Image(); thomas.src = 'images/thomas.png';
  thomas_back = new Image(); thomas_back.src = 'images/thomas2.png';
  station = new Image(); station.src = 'images/station.jpg';
}