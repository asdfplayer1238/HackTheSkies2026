export class Tile {
  constructor(x, y, size, type, interactable = false, testvariable = 0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;                 // e.g., 'turret' or 'healthPack'
    this.interactable = interactable; // boolean flag
    this.testvariable = testvariable; // custom property per tile

    // Load image asset dynamically based on tile type
    this.image = new Image();
    this.image.src = `./assets/images/${type}.jpg`; 
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  // Equivalent to a Java method for handling interaction
  onInteract(player) {
    console.log(`Interacted with ${this.type}! Test Variable: ${this.testvariable}`);
    // You can add game logic here later (e.g., player.health += this.testvariable)
  }

  // Draw the tile on the canvas
  draw(ctx) {
    if (this.imageLoaded) {
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    } else {
      // Fallback colors if image files aren't added yet
      ctx.fillStyle = this.type === 'healthPack' ? '#ff0055' : '#3366ff';
      ctx.fillRect(this.x, this.y, this.size, this.size);
      
      // Draw text label on fallback shape
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(this.type, this.x + 5, this.y + 25);
    }
  }
}