export class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    // Rendered size on your canvas
    this.width = 64;
    this.height = 64;

    this.currentState = 'idle';
    
    // Grid layout: 4 columns, 5 rows per sprite sheet
    this.maxColumns = 4;
    this.maxRows = 5;
    this.frameX = 0; // Column index (0 to 3)
    this.frameY = 0; // Row index (0 to 4)

    this.gameFrame = 0;
    this.staggerFrames = 8; // Animation speed control

    // Load all state sprite sheets from ./assets/images/
    const imageNames = ['idle', 'walk', 'run', 'jump', 'interact'];
    this.images = {};
    this.imagesLoaded = {};

    imageNames.forEach(name => {
      this.images[name] = new Image();
      const fileName = name === 'idle' ? 'plrIdle' : `plr${name.charAt(0).toUpperCase() + name.slice(1)}`;
      this.images[name].src = `./assets/images/${fileName}.png`;
      
      this.imagesLoaded[name] = false;
      this.images[name].onload = () => {
        this.imagesLoaded[name] = true;
      };
    });
  }

  update(keys, canvasWidth, canvasHeight) {
    let moving = false;

    // Map movement directions to rows (0 to 4)
    if (keys.w && this.y > 0) {
      this.y -= this.speed;
      this.frameY = 3; // Row for Up (adjust if your layout differs)
      moving = true;
    }
    if (keys.s && this.y + this.height < canvasHeight) {
      this.y += this.speed;
      this.frameY = 0; // Row for Down
      moving = true;
    }
    if (keys.a && this.x > 0) {
      this.x -= this.speed;
      this.frameY = 1; // Row for Left
      moving = true;
    }
    if (keys.d && this.x + this.width < canvasWidth) {
      this.x += this.speed;
      this.frameY = 2; // Row for Right
      moving = true;
    }

    this.currentState = moving ? 'walk' : 'idle';

    // Cycle through columns (0 to 3) when moving
    if (moving) {
      this.gameFrame++;
      if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX = (this.frameX + 1) % this.maxColumns;
      }
    } else {
      this.frameX = 0; // Reset to default frame when idle
    }
  }

  draw(ctx) {
    const img = this.images[this.currentState];

    if (this.imagesLoaded[this.currentState]) {
      // Dynamically calculate cell size based on the 4x5 sheet layout
      const cellWidth = img.width / this.maxColumns;
      const cellHeight = img.height / this.maxRows;

      // Draw the exact grid cell slice from the 4x5 sheet
      ctx.drawImage(
        img,
        this.frameX * cellWidth,   // Source X (Column)
        this.frameY * cellHeight,  // Source Y (Row)
        cellWidth,                 // Source Cell Width
        cellHeight,                // Source Cell Height
        this.x,                    // Destination X on canvas
        this.y,                    // Destination Y on canvas
        this.width,                // Destination Render Width
        this.height                // Destination Render Height
      );
    } else {
      // Fallback box while loading
      ctx.fillStyle = '#00ffcc';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}