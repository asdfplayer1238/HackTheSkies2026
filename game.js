import { Player } from './classes/Player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fullscreen canvas setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Instantiate the Player object (Just like Java: Player player = new Player(...))
const player = new Player(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100, 6);

// Key tracking object
const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});

// Timer variable
const startTime = Date.now();

// Main Game Loop
function gameLoop() {
  // 1. Update Player position based on inputs and screen bounds
  player.update(keys, canvas.width, canvas.height);

  // 2. Clear canvas frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 3. Draw Player
  player.draw(ctx);

  // 4. Draw Timer HUD
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`Time: ${elapsedTime}s`, 30, 50);

  requestAnimationFrame(gameLoop);
}

// Start the loop
gameLoop();