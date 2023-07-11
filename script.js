var square = document.getElementById("square");
var stepSize = 5; // Adjust this value to control the movement speed
var acceleration = 0.1; // Adjust this value to control the acceleration rate
var friction = 0.98; // Adjust this value to control the friction rate
var intervalId = null;
var momentumIntervalId = null;
var squareTop = window.innerHeight / 2 - 25; // Start square in the center of the screen
var squareLeft = window.innerWidth / 2 - 25;
var velocityX = 0;
var velocityY = 0;
var objects = [];
var objectCount = 0;

function createObject() {
  var object = document.createElement("div");
  object.className = "object";
  object.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
  object.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
  document.body.appendChild(object);
  objects.push(object);
}

function moveSquare() {
  function updateSquarePosition() {
    square.style.top = squareTop + "px";
    square.style.left = squareLeft + "px";
  }

  function checkCollision() {
    var squareRect = square.getBoundingClientRect();
    var squareCenterX = squareRect.left + squareRect.width / 2;
    var squareCenterY = squareRect.top + squareRect.height / 2;

    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var objectRect = object.getBoundingClientRect();
      var objectCenterX = objectRect.left + objectRect.width / 2;
      var objectCenterY = objectRect.top + objectRect.height / 2;
      var distanceX = squareCenterX - objectCenterX;
      var distanceY = squareCenterY - objectCenterY;
      var combinedHalfWidths = squareRect.width / 2 + objectRect.width / 2;
      var combinedHalfHeights = squareRect.height / 2 + objectRect.height / 2;

      if (
        Math.abs(distanceX) < combinedHalfWidths &&
        Math.abs(distanceY) < combinedHalfHeights
      ) {
        var angle = Math.atan2(distanceY, distanceX);
        var force = stepSize * 0.5; // Adjust the force to control the object's movement
        var forceX = Math.cos(angle) * force;
        var forceY = Math.sin(angle) * force;
        object.style.transform = `translate(${forceX}px, ${forceY}px) rotate(${Math.random() * 360}deg)`;
      } else if (
        Math.abs(distanceX) < combinedHalfWidths * 3 &&
        Math.abs(distanceY) < combinedHalfHeights * 3
      ) {
        object.style.filter = "brightness(90%)";
      } else {
        object.style.filter = "";
      }
    }
  }

  document.addEventListener("keydown", function(event) {
    if (intervalId !== null) return; // Prevent multiple intervals
    intervalId = setInterval(function() {
      switch (event.key) {
        case "w":
          velocityY -= acceleration;
          break;
        case "s":
          velocityY += acceleration;
          break;
        case "a":
          velocityX -= acceleration;
          break;
        case "d":
          velocityX += acceleration;
          break;
      }
      updateSquarePosition();
      checkCollision();
    }, 10); // Adjust the interval time (in milliseconds) for smoother movement
  });

  document.addEventListener("keyup", function(event) {
    clearInterval(intervalId);
    intervalId = null;
    if (momentumIntervalId !== null) return; // Prevent multiple momentum intervals
    momentumIntervalId = setInterval(function() {
      if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
        clearInterval(momentumIntervalId);
        momentumIntervalId = null;
        velocityX = 0;
        velocityY = 0;
      } else {
        squareTop += velocityY;
        squareLeft += velocityX;
        velocityX *= friction;
        velocityY *= friction;
        updateSquarePosition();
        checkCollision();
      }
    }, 10);
  });
}

function spawnObject() {
  if (objectCount < 1640) {
    createObject();
    objectCount++;
    setTimeout(spawnObject, 6.9); // determines spawning speed, lower is faster, 1000 is 1 second)
  }
}

spawnObject();
moveSquare();