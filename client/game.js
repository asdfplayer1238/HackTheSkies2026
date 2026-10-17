import { Player } from './classes/Player.js';
import { TileService } from './classes/TileService.js';

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

<<<<<<< Updated upstream
// Key tracking object
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  arrowup: false,
  arrowleft: false,
  arrowdown: false,
  arrowright: false
};
=======
// Initialize the Tile Service (with a 60px tile size)
const tileService = new TileService(60);

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

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key.startsWith('arrow')) e.preventDefault();
  if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key.startsWith('arrow')) e.preventDefault();
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

<<<<<<< Updated upstream
  // 3. Draw Player
  player.draw(ctx);

=======
  // 1. Draw all map tiles first (so players walk on top of them)
  tileService.draw(ctx);

  // 2. Update and draw local player, then check interactions and send movement
  if (localPlayer) {
    localPlayer.update(keys, canvas.width, canvas.height);
    localPlayer.draw(ctx);

    // Check if you walked over a turret or health pack
    tileService.checkInteractions(localPlayer);

    // Emit movement to server
    socket.emit('playerMovement', { x: localPlayer.x, y: localPlayer.y });
  }

  // 3. Draw all other players
  for (const id in otherPlayers) {
    otherPlayers[id].draw(ctx);
  }

>>>>>>> Stashed changes
  // 4. Draw Timer HUD
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`Time: ${elapsedTime}s`, 30, 50);

  requestAnimationFrame(gameLoop);
}

// Start the loop
gameLoop();