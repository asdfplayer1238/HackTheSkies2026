import { Player } from './classes/Player.js';

// Connect to your local Node.js server
const socket = io('http://localhost:3000');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

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

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});

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
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`Time: ${elapsedTime}s`, 30, 50);

  requestAnimationFrame(gameLoop);
}

gameLoop();