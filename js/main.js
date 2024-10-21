// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Base Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class that extends Shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY); // Call the parent constructor
    this.color = color;
    this.size = size;
    this.exists = true; // Track whether the ball exists or not
  }

  draw() {
    if (this.exists) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  update() {
    if (this.exists) {
      if (this.x + this.size >= width) {
        this.velX = -Math.abs(this.velX);
      }

      if (this.x - this.size <= 0) {
        this.velX = Math.abs(this.velX);
      }

      if (this.y + this.size >= height) {
        this.velY = -Math.abs(this.velY);
      }

      if (this.y - this.size <= 0) {
        this.velY = Math.abs(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
    }
  }

  collisionDetect() {
    if (this.exists) {
      for (const ball of balls) {
        if (this !== ball && ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB();
          }
        }
      }
    }
  }
}

// EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // Hardcode the velocity to 20
    this.color = "white";
    this.size = 10;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3; // Thicker stroke
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) this.x = width - this.size;
    if (this.x - this.size <= 0) this.x = this.size;
    if (this.y + this.size >= height) this.y = height - this.size;
    if (this.y - this.size <= 0) this.y = this.size;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // "Eat" the ball
          ballCount--; // Update the score
          updateScore(); // Update the display
        }
      }
    }
  }
}

// Create balls array
const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

// Create evil circle instance
const evilCircle = new EvilCircle(random(0, width), random(0, height));

// Initialize ball count
let ballCount = balls.length;
const scoreDisplay = document.querySelector("#score");

// Function to update score
function updateScore() {
  scoreDisplay.textContent = `Ball count: ${ballCount}`;
}

// Game loop
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
