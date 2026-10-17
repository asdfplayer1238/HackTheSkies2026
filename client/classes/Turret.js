export class Turret {
  constructor(x, y, size = 60, fireRate = 1200, range = 500) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fireRate = fireRate;
    this.range = range;
    this.cooldown = 0;
    this.angle = 0;

    this.baseRadius = size * 0.28;
    this.barrelLength = size * 0.7;
    this.color = '#fbbf24';

    this.image = new Image();
    this.image.src = './assets/images/TurretOn.png';
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  update(player, pellets, deltaMs, isControlled = false, keys = {}, aimPosition = null) {
    this.isControlled = isControlled;
    if (!player || !isControlled) return;

    const turretCenterX = this.x + this.size / 2;
    const turretCenterY = this.y + this.size / 2;
    if (keys.w) this.angle = -Math.PI / 2;
    else if (keys.s) this.angle = Math.PI / 2;
    else if (keys.a) this.angle = Math.PI;
    else if (keys.d) this.angle = 0;
    else if (aimPosition) {
      this.angle = Math.atan2(aimPosition.y - turretCenterY, aimPosition.x - turretCenterX);
    }

    this.cooldown -= deltaMs;
    if (this.cooldown <= 0) {
      this.cooldown = this.fireRate;

      pellets.push({
        x: turretCenterX + Math.cos(this.angle) * (this.barrelLength * 0.55),
        y: turretCenterY + Math.sin(this.angle) * (this.barrelLength * 0.55),
        vx: Math.cos(this.angle) * 6,
        vy: Math.sin(this.angle) * 6,
        radius: 8,
        color: '#ffd166',
        life: 2000,
        owner: player
      });
    }
  }

  draw(ctx) {
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.angle);

    if (this.imageLoaded) {
      ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-this.size * 0.2, -this.size * 0.2, this.size * 0.4, this.size * 0.9);
    }

    ctx.restore();

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.strokeStyle = this.isControlled ? '#22c55e' : '#facc15';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
