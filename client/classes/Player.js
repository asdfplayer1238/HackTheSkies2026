export class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    // Rendered size on your canvas
    this.width = 64;
    this.height = 64;

    this.currentState = 'idle';
    this.isInteracting = false;

    // Grid dimensions
    this.maxRows = 5;
    this.frameX = 0; // Column index
    this.frameY = 0; // Row index

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

  // Helper method to get the correct column count for the active sheet
  getMaxColumns() {
    return this.currentState === 'interact' ? 7 : 4;
  }

  // Triggered when interacting
  onInteract() {
    if (this.isInteracting) return; // Don't interrupt an existing interaction

    this.isInteracting = true;
    this.currentState = 'interact';
    this.frameX = 0;
    this.gameFrame = 0;
  }

  update(keys, canvasWidth, canvasHeight) {
    // 1. Handle Interaction Animation Locks
    if (this.isInteracting) {
      this.gameFrame++;
      if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX++;

        // Interact sheet has 7 columns (index 0 to 6)
        if (this.frameX >= 7) {
          this.frameX = 0; // Reset frame BEFORE switching state
          this.isInteracting = false;
          this.currentState = 'idle';
        }
      }
      return; // Lock movement while interacting
    }

    // 2. Regular Movement Logic
    let moving = false;

    if (keys.w && this.y > 0) {
      this.y -= this.speed;
      this.frameY = 3; // Row for Up
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

    // 3. Frame Cycling
    const maxCols = this.getMaxColumns();
    if (moving) {
      this.gameFrame++;
      if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX = (this.frameX + 1) % maxCols;
      }
    } else {
      // Always keep frameX safely within bounds when switching/idle
      this.frameX = this.frameX % maxCols;
    }
  }

  draw(ctx) {
    const img = this.images[this.currentState];
    const maxCols = this.getMaxColumns();

    if (this.imagesLoaded[this.currentState]) {
      // Calculate cell size dynamically based on columns (7 for interact, 4 for others) and 5 rows
      const cellWidth = img.width / maxCols;
      const cellHeight = img.height / this.maxRows;

      // Draw exact grid cell slice
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