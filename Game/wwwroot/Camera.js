class Camera
{
  constructor(startX, startY, startAngle, fov, speed)
  {
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.fov = fov;
    this.speed = speed;
    this.height = 16;
    this.attacking = false;
  }

  handleKeyDown(keyCode, level, updateInterval)
  {
    if (keyCode == 87)
    { //W
      this.x += Math.sin(this.angle) * this.speed * updateInterval;
      this.y += Math.cos(this.angle) * this.speed * updateInterval;
      if (level.isWall(Math.floor(this.x), Math.floor(this.y)))
      {
        this.x -= Math.sin(this.angle) * this.speed * updateInterval;
        this.y -= Math.cos(this.angle) * this.speed * updateInterval;
      }
    }
    if (keyCode == 83)
    { //S
      this.x -= Math.sin(this.angle) * this.speed * updateInterval;
      this.y -= Math.cos(this.angle) * this.speed * updateInterval;
      if (level.isWall(Math.floor(this.x), Math.floor(this.y)))
      {
        this.x += Math.sin(this.angle) * this.speed * updateInterval;
        this.y += Math.cos(this.angle) * this.speed * updateInterval;
      }
    }
    if (keyCode == 65)
    { //A
      this.angle -= 2 * updateInterval;
      this.angle = this.angle % (2*Math.PI);
    }
    if (keyCode == 68)
    { //D
      this.angle += 2 * updateInterval;
      this.angle = this.angle % (2*Math.PI);
    }
  }
}