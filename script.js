window.onload = function() { //Hello Mr. Computer! If you are curious enough to look at the code
  const canvas = document.getElementById("canvas"); //You deserve to know that S and W change the gravity strength
  const ctx = canvas.getContext("2d");
  let circles = [];
  let isMouseDown = false;
  let reverseGravity = false;
  let gravity = 0.5;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let isRandomizing = false; // Flag to indicate randomize mode

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener("mousedown", event => {
    isMouseDown = true;
  });

  canvas.addEventListener("mouseup", event => {
    isMouseDown = false;
  });

  canvas.addEventListener("mousemove", event => {
    if (isMouseDown) {
      const circle = {
        x: event.clientX,
        y: event.clientY,
        radius: isRandomizing ? Math.floor(Math.random() * 16) + 5 : parseFloat(circleSizeSlider.value),
        dy: 0,
        gravity: reverseGravity ? -gravity : gravity,
        elasticity: 0.9,
        color: getRandomColor(),
        hasCollided: false // Flag to track collision sound
      };

      circles.push(circle);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.code === "Space") {
      reverseGravity = !reverseGravity;

      // Reverse gravity for existing circles
      for (let i = 0; i < circles.length; i++) {
        circles[i].gravity = reverseGravity ? -gravity : gravity;
      }
    }

    if (event.key === "w") {
      gravity += 0.1;

      // Update gravity for existing circles
      for (let i = 0; i < circles.length; i++) {
        circles[i].gravity = reverseGravity ? -gravity : gravity;
      }
    }

    if (event.key === "s") {
      gravity -= 0.1;
      gravity = Math.max(0, gravity);

      // Update gravity for existing circles
      for (let i = 0; i < circles.length; i++) {
        circles[i].gravity = reverseGravity ? -gravity : gravity;
      }
    }
  });

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];

      // Apply gravity
      circle.dy += circle.gravity;

      // Update circle position
      circle.y += circle.dy;

      // Check if the circle hits the bottom or top of the screen
      if (circle.y + circle.radius > canvas.height) {
        // Reverse the direction and reduce velocity due to bounce
        circle.dy *= -circle.elasticity;

        // Move the circle just above the bottom of the screen
        circle.y = canvas.height - circle.radius;

        // Play "plink" sound effect if not already collided
        if (!circle.hasCollided) {
          playSoundEffect(circle.radius, Math.abs(circle.dy));
          circle.hasCollided = true;
        }
      } else if (circle.y - circle.radius < 0) {
        // Reverse the direction and reduce velocity due to bounce
        circle.dy *= -circle.elasticity;

        // Move the circle just below the top of the screen
        circle.y = circle.radius;

        // Play "plink" sound effect if not already collided
        if (!circle.hasCollided) {
          playSoundEffect(circle.radius, Math.abs(circle.dy));
          circle.hasCollided = true;
        }
      } else {
        // Reset collision flag if not resting on the ground or ceiling
        circle.hasCollided = false;
      }

      // Draw circle with random shade of red, yellow, or orange and 25% opacity
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = circle.color;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.closePath();

      // Remove circles that are off-screen
      if (circle.y - circle.radius > canvas.height) {
        circles.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(update);
  }

  update();

  // Generate random color in the red, yellow, or orange spectrum
  function getRandomColor() {
    const colors = ["#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF00"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Play "plink" sound effect with variable pitch and volume based on circle size and impact force
  function playSoundEffect(circleSize, impactForce) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Calculate frequency based on circle size
    const frequency = 1100 - circleSize * 40;

    // Calculate volume based on impact force
    const volume = Math.min(0.1, impactForce * 0.002);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.value = volume;

    oscillator.start();

    // Stop the sound after 0.1 seconds
    setTimeout(() => {
      oscillator.stop();
    }, 100);
  }

  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    circles = [];
  });

  const circleSizeSlider = document.getElementById("circleSizeSlider");
  circleSizeSlider.addEventListener("input", () => {
    // Update circle size for new circles
  });

  const randomizeToggle = document.getElementById("randomizeToggle");
  randomizeToggle.addEventListener("change", () => {
    isRandomizing = randomizeToggle.checked;
    toggleSwitchLabel.style.backgroundColor = isRandomizing ? "#6dd36d" : "#ccc";
  });

  const toggleSwitchLabel = document.querySelector(".toggle-switch-label");
  toggleSwitchLabel.style.fontStyle = "italic";
  toggleSwitchLabel.style.color = "#fcba03";

  const gravityText = document.createElement("div");
  gravityText.textContent = "Press Space!";
  gravityText.style.position = "fixed";
  gravityText.style.top = "50%";
  gravityText.style.left = "50%";
  gravityText.style.transform = "translate(-50%, -50%)";
  gravityText.style.fontFamily = "Courier New, Courier, monospace";
  gravityText.style.fontSize = "69px";
  gravityText.style.fontWeight = "bold";
  gravityText.style.color = "#fcba03";
  gravityText.style.opacity = "0";
  document.body.appendChild(gravityText);

  setTimeout(() => {
    fadeIn(gravityText, 9000);
  }, 11000);

  function fadeIn(element, duration) {
    let opacity = 0;
    const interval = 10;
    const delta = interval / duration;

    const timer = setInterval(() => {
      opacity += delta;
      element.style.opacity = opacity;

      if (opacity >= 1) {
        clearInterval(timer);
        setTimeout(() => {
          fadeOut(element, 1000);
        }, 1000);
      }
    }, interval);
  }

  function fadeOut(element, duration) {
    let opacity = 1;
    const interval = 10;
    const delta = interval / duration;

    const timer = setInterval(() => {
      opacity -= delta;
      element.style.opacity = opacity;

      if (opacity <= 0) {
        clearInterval(timer);
      }
    }, interval);
  }
};
