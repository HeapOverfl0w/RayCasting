class Camera
{
  constructor(startX, startY, startAngle, fov)
  {
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.fov = fov * Math.PI / 180;
  }

  handleKeyDown(keyCode, level)
  {
    if (keyCode == 87)
    { //W
      this.x += Math.sin(this.angle) * 0.1;
      this.y += Math.cos(this.angle) * 0.1;
      if (level.isWall(Math.floor(this.x), Math.floor(this.y)))
      {
        this.x -= Math.sin(this.angle) * 0.1;
        this.y -= Math.cos(this.angle) * 0.1;
      }
    }
    if (keyCode == 83)
    { //S
      this.x -= Math.sin(this.angle) * 0.1;
      this.y -= Math.cos(this.angle) * 0.1;
      if (level.isWall(Math.floor(this.x), Math.floor(this.y)))
      {
        this.x += Math.sin(this.angle) * 0.1;
        this.y += Math.cos(this.angle) * 0.1;
      }
    }
    if (keyCode == 65)
    { //A
      this.angle -= 0.1;
    }
    if (keyCode == 68)
    { //D
      this.angle += 0.1;
    }
  }
}