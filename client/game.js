<<<<<<< Updated upstream
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Make canvas fill the full window width and height
=======
import { Player } from './classes/Player.js';

// Connect to your local Node.js server
const socket = io('http://localhost:3000');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

>>>>>>> Stashed changes
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize listener
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

<<<<<<< Updated upstream
// ==========================================
// PLAYER CLASS (Java-style Object-Oriented)
// ==========================================
class Player {
  constructor(x, y, width, height, speed, imageSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    // Load the player's image inside the class
    this.image = new Image();
    this.image.src = imageSrc;
    this.imageLoaded = false;
    
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  // Equivalent to a Java update method
  update(keys, canvasWidth, canvasHeight) {
    if (keys.w && this.y > 0) this.y -= this.speed;
    if (keys.s && this.y + this.height < canvasHeight) this.y += this.speed;
    if (keys.a && this.x > 0) this.x -= this.speed;
    if (keys.d && this.x + this.width < canvasWidth) this.x += this.speed;
  }

  // Equivalent to a Java draw/render method
  draw(ctx) {
    if (this.imageLoaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Fallback teal square if image hasn't loaded or is missing
      ctx.fillStyle = '#00ffcc';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

// ==========================================
// GAME SETUP & STATE
// ==========================================

// Create an instance of our Player class
const player = new Player(
  canvas.width / 2 - 60,
  canvas.height / 2 - 60,
  120,
  120,
  6,
  'assets/images/test.jpg'
);

// Key tracking object
const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

// Timer variables
let startTime = Date.now();

// Keyboard Listeners
=======
let localPlayer = null;
const otherPlayers = {};

// Listen for connection and current players list
socket.on('currentPlayers', (serverPlayers) => {
  for (const id in serverPlayers) {
    const pData = serverPlayers[id];
    if (id === socket.id) {
      // This is you
      localPlayer = new Player(pData.x, pData.y, pData.width, pData.height, 6);
      localPlayer.color = pData.color;
    } else {
      // This is another player
      otherPlayers[id] = new Player(pData.x, pData.y, pData.width, pData.height, 6);
      otherPlayers[id].color = pData.color;
    }
  }
});

// When a new player joins later
socket.on('newPlayer', (data) => {
  otherPlayers[data.id] = new Player(data.player.x, data.player.y, data.player.width, data.player.height, 6);
  otherPlayers[data.id].color = data.player.color;
});

// When another player moves
socket.on('playerMoved', (data) => {
  if (otherPlayers[data.id]) {
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
  }
});

// When a player leaves
socket.on('disconnectPlayer', (id) => {
  delete otherPlayers[id];
});

// Key tracking
const keys = { w: false, a: false, s: false, d: false };

>>>>>>> Stashed changes
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});

<<<<<<< Updated upstream
// ==========================================
// MAIN GAME LOOP
// ==========================================
function gameLoop() {
  // 1. Update game state
  player.update(keys, canvas.width, canvas.height);

  // 2. Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 3. Draw everything
  player.draw(ctx);

  // Draw Timer HUD
=======
const startTime = Date.now();

// Main Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw local player, then send position to server
  if (localPlayer) {
    localPlayer.update(keys, canvas.width, canvas.height);
    localPlayer.draw(ctx);

    // Emit movement to server
    socket.emit('playerMovement', { x: localPlayer.x, y: localPlayer.y });
  }

  // Draw all other players
  for (const id in otherPlayers) {
    otherPlayers[id].draw(ctx);
  }

  // Draw Timer
>>>>>>> Stashed changes
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`Time: ${elapsedTime}s`, 30, 50);

  // 4. Repeat loop (60 times per second)
  requestAnimationFrame(gameLoop);
}

<<<<<<< Updated upstream
// Start the game loop
=======
>>>>>>> Stashed changes
gameLoop();