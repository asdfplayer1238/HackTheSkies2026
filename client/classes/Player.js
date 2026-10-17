export class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    // Load image asset
    this.image = new Image();
    this.image.src = 'assets/images/test.jpg';
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  // Equivalent to a Java update method
  update(keys, canvasWidth, canvasHeight) {
    if (keys.w && this.y > 0) this.y -= this.speed;
    if (keys.s && this.y + this.height < canvasHeight) this.y += this.speed;
    if (keys.a && this.x > 0) this.x -= this.speed;
    if (keys.d && this.x + this.width < canvasWidth) this.x += this.speed;
  }

  // Equivalent to a Java render/draw method
  draw(ctx) {
    if (this.imageLoaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = '#00ffcc';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}