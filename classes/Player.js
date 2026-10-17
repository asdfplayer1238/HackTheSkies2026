export class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.direction = 'down';
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/images/playerSprites.png';
    this.frameWidth = 128;
    this.frameHeight = 192;
    this.frameIndex = 0;
    this.animationElapsed = 0;
    this.frameDuration = 120;
    this.directionRows = { down: 0, right: 1, left: 1, up: 3 };
  }

  // Equivalent to a Java update method
  update(keys, canvasWidth, canvasHeight, deltaTime) {
    const previousX = this.x;
    const previousY = this.y;

    if ((keys.w || keys.arrowup) && this.y > 0) this.y -= this.speed;
    if ((keys.s || keys.arrowdown) && this.y + this.height < canvasHeight) this.y += this.speed;
    if ((keys.a || keys.arrowleft) && this.x > 0) this.x -= this.speed;
    if ((keys.d || keys.arrowright) && this.x + this.width < canvasWidth) this.x += this.speed;

    const movedX = this.x - previousX;
    const movedY = this.y - previousY;
    if (movedX === 0 && movedY === 0) {
      this.frameIndex = 0;
      this.animationElapsed = 0;
      return;
    }

    const direction = movedX !== 0
      ? (movedX < 0 ? 'left' : 'right')
      : (movedY < 0 ? 'up' : 'down');
    if (direction !== this.direction) {
      this.direction = direction;
      this.frameIndex = 0;
      this.animationElapsed = 0;
    }

    this.animationElapsed += deltaTime;
    const framesElapsed = Math.floor(this.animationElapsed / this.frameDuration);
    this.frameIndex = (this.frameIndex + framesElapsed) % 6;
    this.animationElapsed %= this.frameDuration;
  }

  // Equivalent to a Java render/draw method
  draw(ctx) {
    const image = this.spriteSheet;
    if (!image.complete || image.naturalWidth === 0) {
      ctx.fillStyle = '#00ffcc';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      return;
    }

    const row = this.directionRows[this.direction];
    const scale = Math.min(this.width / this.frameWidth, this.height / this.frameHeight);
    const drawWidth = this.frameWidth * scale;
    const drawHeight = this.frameHeight * scale;
    const sourceX = this.frameIndex * this.frameWidth;
    const sourceY = row * this.frameHeight;

    const drawX = this.x + (this.width - drawWidth) / 2;
    const drawY = this.y + (this.height - drawHeight) / 2;
    if (this.direction === 'left') {
      ctx.save();
      ctx.translate(drawX * 2 + drawWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        image,
        sourceX, sourceY, this.frameWidth, this.frameHeight,
        drawX, drawY, drawWidth, drawHeight
      );
      ctx.restore();
      return;
    }

    ctx.drawImage(
      image,
      sourceX, sourceY, this.frameWidth, this.frameHeight,
      drawX, drawY, drawWidth, drawHeight
    );
  }
}