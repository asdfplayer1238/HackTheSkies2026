import { Tile } from './Tile.js';

export class TileService {
  // Static variable belonging to the class itself
  static tileSize = 60;

  constructor() {
    this.tiles = [];

    this.turretTiles = [
      { x: 11, y: 4, testvariable: 15, interactable: true },
      { x: 4, y: 5, testvariable: 30, interactable: true }
    ];

    this.healthPackTiles = [
      { x: 12, y: 3, testvariable: 50, interactable: true }
    ];

    this.initTiles();
  }

  initTiles() {
    console.log(" TileService: Initializing tiles...");

    this.turretTiles.forEach(data => {
      // Use TileService.tileSize instead of this.tileSize
      this.tiles.push(new Tile(data.x, data.y, TileService.tileSize, 'turret', data.interactable, data.testvariable));
    });

    this.healthPackTiles.forEach(data => {
      this.tiles.push(new Tile(data.x, data.y, TileService.tileSize, 'healthPack', data.interactable, data.testvariable));
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