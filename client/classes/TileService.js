import { Tile } from './Tile.js';

export class TileService {
  constructor(tileSize = 50) {
    this.tileSize = tileSize;
    this.tiles = [];

    // Array definitions as requested
    this.turretTiles = [
      { x: 300, y: 200, testvariable: 15, interactable: true },
      { x: 500, y: 400, testvariable: 30, interactable: true }
    ];

    this.healthPackTiles = [
      { x: 700, y: 150, testvariable: 50, interactable: true }
    ];

    this.initTiles();
  }

  // Instantiates the raw data arrays into actual Tile objects
  initTiles() {
    this.turretTiles.forEach(data => {
      this.tiles.push(new Tile(data.x, data.y, this.tileSize, 'turret', data.interactable, data.testvariable));
    });

    this.healthPackTiles.forEach(data => {
      this.tiles.push(new Tile(data.x, data.y, this.tileSize, 'healthPack', data.interactable, data.testvariable));
    });
  }

  // Render all tiles
  draw(ctx) {
    this.tiles.forEach(tile => tile.draw(ctx));
  }

  // Check if player collides with any interactable tile
  checkInteractions(player) {
    this.tiles.forEach(tile => {
      if (tile.interactable) {
        // Simple 2D bounding box collision detection
        const isColliding = (
          player.x < tile.x + tile.size &&
          player.x + player.width > tile.x &&
          player.y < tile.y + tile.size &&
          player.y + player.height > tile.y
        );

        if (isColliding) {
          tile.onInteract(player);
        }
      }
    });
  }
}