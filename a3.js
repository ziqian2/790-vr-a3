const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let carX = 0;
let wheelAngle = 0;
const carSpeed = 2;
const wheelSpeed = 0.1;
let angle = 0;
const swaySpeed = 0.02;
let carMoveSpeed = 5;
let score = 0; // Track score

const carWidth = 100; // Car dimensions for collision detection
const carHeight = 40;

const balloons = [
  { x: 150, y: 600, color: 'red', speed: 0.7 },  // Slowed down the balloons
  { x: 350, y: 600, color: 'blue', speed: 0.9 },
  { x: 550, y: 600, color: 'green', speed: 0.6 },
  { x: 750, y: 600, color: 'yellow', speed: 0.8 }
];

// Add keyboard event listeners
let carVelocity = 0; // Variable to track car movement speed

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    carVelocity = carMoveSpeed; // Move car to the right
  } else if (event.key === 'ArrowLeft') {
    carVelocity = -carMoveSpeed; // Move car to the left
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    carVelocity = 0; // Stop the car when arrow key is released
  }
});

// Detect collision between car and balloon
function detectCollision(balloon) {
  const carTop = 300 - carHeight / 2; // The car's top position
  const carBottom = 300 + carHeight / 2;
  const carLeft = carX - carWidth / 2;
  const carRight = carX + carWidth / 2;

  const balloonRadius = 30;
  const balloonTop = balloon.y - balloonRadius;
  const balloonBottom = balloon.y + balloonRadius;
  const balloonLeft = balloon.x - balloonRadius;
  const balloonRight = balloon.x + balloonRadius;

  // Check for overlap in both X and Y axes
  if (carRight > balloonLeft && carLeft < balloonRight && carBottom > balloonTop && carTop < balloonBottom) {
    return true;
  }
  return false;
}

// Draw tree 
function drawTree(x, y, angle) {
  ctx.save();
  ctx.translate(x, y); 
  ctx.rotate(Math.sin(angle) * 0.05);
  ctx.fillStyle = 'brown';
  ctx.fillRect(-10, -150, 20, 150);

  drawBranch(-50, -100, 30, -100); 
  drawBranch(-10, -150, 30, -100); 
  drawBranch(30, -100, 30, -100);   
  ctx.restore();
}

function drawBranch(x, y, width, height) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(angle) * 0.1);
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Car
function drawCar(interpolation) {
  ctx.save();
  ctx.translate(carX + carVelocity * interpolation, 300); // Interpolate only during movement
  ctx.fillStyle = 'blue';
  ctx.fillRect(-50, -20, 100, 40);  
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(-30, -15, 40, 20);

  ctx.save();
  ctx.translate(30, 20);  
  ctx.rotate(wheelAngle);  
  drawWheel();
  ctx.restore();  

  ctx.save();
  ctx.translate(-30, 20);  
  ctx.rotate(wheelAngle); 
  drawWheel();
  ctx.restore(); 

  ctx.restore();
}

function drawWheel() {
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();

  ctx.strokeStyle = 'white'; 
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-5, 0);  
  ctx.lineTo(5, 0);  
  ctx.moveTo(0, -5);  
  ctx.lineTo(0, 5);   
  ctx.stroke();
}

function drawBalloon(balloon) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(balloon.x, balloon.y);
  ctx.lineTo(balloon.x, balloon.y + 50);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(balloon.x, balloon.y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = balloon.color;
  ctx.fill();

  ctx.restore();
}

// Draw score
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText("Score: " + score, 20, 30);
}

// Fixed-time step game loop variables
const fps = 60; 
const timestep = 1000 / fps; 
let lastFrameTimeMs = 0; 
let delta = 0;

function mainLoop(timestamp) {
  if (timestamp < lastFrameTimeMs + (1000 / 60)) {
    requestAnimationFrame(mainLoop);
    return;
  }

  delta += timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;

  let updateCount = 0;
  while (delta >= timestep) {
    update();
    delta -= timestep;
    updateCount++;
  }

  draw(delta / timestep); // Interpolation step
  requestAnimationFrame(mainLoop);
}

function update() {
  // Update the car position based on velocity
  carX += carVelocity;

  wheelAngle += wheelSpeed;

  // Update balloon positions and check for collision
  balloons.forEach(balloon => {
    balloon.y -= balloon.speed;
    if (balloon.y + 30 < 0) {
      balloon.y = canvas.height + 30;
    }

    if (detectCollision(balloon)) {
      balloon.y = canvas.height + 30; // Reset balloon after collision
      score++; // Increase score
    }
  });
}

function draw(interpolation) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawTree(100, 250, angle);
  drawTree(300, 250, angle);
  drawTree(500, 250, angle);
  drawTree(700, 250, angle);
  
  drawCar(interpolation); // Interpolated car movement
  balloons.forEach(drawBalloon);
  
  drawScore(); // Show score
}

// Start the game loop
requestAnimationFrame(mainLoop);
