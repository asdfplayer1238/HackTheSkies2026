export class Plane {
  constructor(x, y, width, height, tileService) {
    this.x = x; // + 40;     // Moved right by 40 pixels
    this.y = y;          
    this.width = width;  
    this.height = height;
    this.tileService = tileService;
    
    // Convert 15 degrees to radians
    // this.rotation = -20 * (Math.PI / 180); 
  }

  // Update logic stays relative to the plane's local dimensions
  update(keys, localPlayer) {
    if (localPlayer) {
      localPlayer.update(keys, this.width, this.height);
    }
  }

  draw(ctx, localPlayer, otherPlayers) {
    ctx.save(); // Save main canvas state

    // 1. Move origin to the center of the plane, rotate, then shift back
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.translate(-centerX, -centerY);

    // 2. Create clipping mask for the rotated box frame
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.clip();

    // 3. Draw background inside the plane
    ctx.fillStyle = '#111827'; 
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 4. Temporarily shift local origin to the top-left of the plane box
    // so children (tiles & players) draw using local (0,0) coordinates
    ctx.save();
    ctx.translate(this.x, this.y);

    this.tileService.draw(ctx);

    if (localPlayer) {
      localPlayer.draw(ctx);
    }

    for (const id in otherPlayers) {
      otherPlayers[id].draw(ctx);
    }

    ctx.restore(); // Restore local origin shift

    // 5. Draw the plane's outer border frame (it will also be rotated by 15°)
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.restore(); // Restore main canvas state
  }
}