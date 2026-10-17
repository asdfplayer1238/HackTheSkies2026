import { Player } from './classes/Player.js';
import { TileService } from './classes/TileService.js';
import { Plane } from './classes/Plane.js';
import { Turret } from './classes/Turret.js';

const socket = io('http://localhost:3000');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameShell = document.querySelector('.game-shell');

function resizeCanvas() {
  const maxWidth = Math.min(800, Math.max(320, gameShell.clientWidth - 36));
  const maxHeight = Math.min(600, Math.max(240, gameShell.clientHeight - 36));
  const aspectRatio = 800 / 600;

  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  canvas.width = width;
  canvas.height = height;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let localPlayer = null;
const otherPlayers = {};
const pellets = [];
let controlledTurret = null;
let releasedTurret = null;
let aimPosition = null;

canvas.addEventListener('pointermove', (event) => {
  const bounds = canvas.getBoundingClientRect();
  aimPosition = {
    x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
    y: (event.clientY - bounds.top) * (canvas.height / bounds.height)
  };
});

// Initialize Tile Service
const tileService = new TileService(60);
const turrets = tileService.turretTiles.map((tile) => new Turret(
  tile.x * TileService.tileSize,
  tile.y * TileService.tileSize,
  TileService.tileSize
));

// Initialize the Plane frame centered on the screen (Width: 900, Height: 600)
const planeWidth = canvas.width;
const planeHeight = canvas.height;
const planeX = 0;
const planeY = 0;
const plane = new Plane(planeX, planeY, planeWidth, planeHeight, tileService);

socket.on('currentPlayers', (serverPlayers) => {
  for (const id in serverPlayers) {
    const pData = serverPlayers[id];
    const spawnX = 140;
    const spawnY = 140;

    if (id === socket.id) {
      localPlayer = new Player(spawnX, spawnY, 5);
      localPlayer.health = 100;
      localPlayer.maxHealth = 100;
      localPlayer.invulnerableUntil = 0;
    } else {
      otherPlayers[id] = new Player(spawnX, spawnY, 5);
    }
  }
});

socket.on('newPlayer', (data) => {
  otherPlayers[data.id] = new Player(140, 140, 5);
});

socket.on('playerMoved', (data) => {
  if (otherPlayers[data.id]) {
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
  }
});

socket.on('disconnectPlayer', (id) => {
  delete otherPlayers[id];
});

const keys = { w: false, a: false, s: false, d: false, e: false };

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(keys, key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(keys, key)) keys[key] = false;
});

const startTime = Date.now();
let lastFrameTime = performance.now();

function updatePellets(deltaMs) {
  for (let i = pellets.length - 1; i >= 0; i--) {
    const pellet = pellets[i];
    pellet.x += pellet.vx * (deltaMs / 16.67);
    pellet.y += pellet.vy * (deltaMs / 16.67);
    pellet.life -= deltaMs;

    if (!localPlayer) {
      pellets.splice(i, 1);
      continue;
    }

    const hitPlayer = pellet.owner !== localPlayer && (
      pellet.x + pellet.radius > localPlayer.x &&
      pellet.x - pellet.radius < localPlayer.x + localPlayer.width &&
      pellet.y + pellet.radius > localPlayer.y &&
      pellet.y - pellet.radius < localPlayer.y + localPlayer.height
    );

    if (hitPlayer) {
      const now = performance.now();
      if (now >= localPlayer.invulnerableUntil) {
        localPlayer.health = Math.max(0, (localPlayer.health || 100) - 10);
        localPlayer.invulnerableUntil = now + 400;
      }
      pellets.splice(i, 1);
      continue;
    }

    if (pellet.life <= 0) {
      pellets.splice(i, 1);
    }
  }
}

function drawHud() {
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.fillText(`Time: ${elapsedTime}s`, 30, 50);

  if (localPlayer) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, 70, 180, 20);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(30, 70, (localPlayer.health / localPlayer.maxHealth) * 180, 20);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(30, 70, 180, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(`HP: ${localPlayer.health}`, 30, 110);
    ctx.fillText(
      controlledTurret ? 'Turret: Mouse aim | WASD fallback | E exit' : 'Touch a turret to control it',
      30,
      135
    );
  }
}

// Main Game Loop
function gameLoop() {
  const now = performance.now();
  const deltaMs = now - lastFrameTime;
  lastFrameTime = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (localPlayer) {
    const touchingTurret = turrets.find((turret) =>
      tileService.isPlayerTouchingTile(localPlayer, turret)
    );

    if (!touchingTurret) {
      releasedTurret = null;
    }
    if (controlledTurret && (controlledTurret !== touchingTurret || keys.e)) {
      if (keys.e && controlledTurret === touchingTurret) {
        releasedTurret = controlledTurret;
      }
      controlledTurret = null;
    }
    if (!controlledTurret && touchingTurret && touchingTurret !== releasedTurret && !keys.e) {
      controlledTurret = touchingTurret;
    }

    turrets.forEach((turret) =>
      turret.update(localPlayer, pellets, deltaMs, turret === controlledTurret, keys, aimPosition)
    );
    updatePellets(deltaMs);
    if (!controlledTurret) {
      plane.update(keys, localPlayer);
    }
    tileService.checkInteractions(localPlayer);
    socket.emit('playerMovement', { x: localPlayer.x, y: localPlayer.y });
  }

  plane.draw(ctx, localPlayer, otherPlayers, turrets, pellets);
  drawHud();

  requestAnimationFrame(gameLoop);
}

gameLoop();