import { Player } from './classes/Player.js';
import { TileService } from './classes/TileService.js';
import { Plane } from './classes/Plane.js';

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

// Initialize Tile Service
const tileService = new TileService(60);

// Initialize the Plane frame centered on the screen (Width: 900, Height: 600)
const planeWidth = 900;
const planeHeight = 600;
const planeX = (canvas.width - planeWidth) / 2;
const planeY = (canvas.height - planeHeight) / 2;
const plane = new Plane(planeX, planeY, planeWidth, planeHeight, tileService);

socket.on('currentPlayers', (serverPlayers) => {
  for (const id in serverPlayers) {
    const pData = serverPlayers[id];
    // Spawn players inside the plane bounds
    const spawnX = planeX + 100;
    const spawnY = planeY + 100;

    if (id === socket.id) {
      localPlayer = new Player(spawnX, spawnY, 5);
    } else {
      otherPlayers[id] = new Player(spawnX, spawnY, 5);
    }
  }
});

socket.on('newPlayer', (data) => {
  otherPlayers[data.id] = new Player(planeX + 100, planeY + 100, 5);
});

socket.on('playerMoved', (data) => {
  if (otherPlayers[data.id]) {
    // Note: server coordinates should map to local plane coordinates
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
  }
});

socket.on('disconnectPlayer', (id) => {
  delete otherPlayers[id];
});

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

  // 1. Update local player within the plane boundaries
  if (localPlayer) {
    plane.update(keys, localPlayer);
    tileService.checkInteractions(localPlayer);

    // Send local position relative to the plane to server
    socket.emit('playerMovement', { x: localPlayer.x, y: localPlayer.y });
  }

  // 2. Draw the plane (which automatically clips and renders all its child tiles and players inside it)
  plane.draw(ctx, localPlayer, otherPlayers);

  // 3. Draw UI/Timer outside the plane on the main canvas HUD
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`Time: ${elapsedTime}s`, 30, 50);

  requestAnimationFrame(gameLoop);
}

gameLoop();