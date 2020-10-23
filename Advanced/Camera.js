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
    }
    if (keyCode == 68)
    { //D
      this.angle += 2 * updateInterval;
    }
  }
}