import { Tile } from './Tile.js';

export class TileService {
  constructor(tileSize = 60) {
    this.tileSize = tileSize;
    this.tiles = [];

    this.turretTiles = [
      { x: 200, y: 200, testvariable: 15, interactable: true },
      { x: 500, y: 400, testvariable: 30, interactable: true }
    ];

    this.healthPackTiles = [
      { x: 700, y: 150, testvariable: 50, interactable: true }
    ];

    this.initTiles();
  }

  initTiles() {
    console.log(" TileService: Initializing tiles...");

    this.turretTiles.forEach(data => {
      this.tiles.push(new Tile(data.x, data.y, this.tileSize, 'turret', data.interactable, data.testvariable));
    });

    this.healthPackTiles.forEach(data => {
      this.tiles.push(new Tile(data.x, data.y, this.tileSize, 'healthPack', data.interactable, data.testvariable));
    });

    console.log(` Successfully created ${this.tiles.length} total tiles.`);
  }

  draw(ctx) {
    this.tiles.forEach(tile => tile.draw(ctx));
  }

  checkInteractions(player) {
    this.tiles.forEach(tile => {
      if (tile.interactable) {
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