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
    this.weapon = 1;
  }

  handleKeyDown(keyCode, level, updateInterval)
  {
    if (keyCode == 87)
    { //W
      let adjustedX = this.x + Math.sin(this.angle) * this.speed * updateInterval;
      let adjustedY = this.y + Math.cos(this.angle) * this.speed * updateInterval;
      let floorAdjustedX = Math.floor(adjustedX);
      let floorAdjustedY = Math.floor(adjustedY);
      if (level.isTeleport(floorAdjustedX, floorAdjustedY)) {
        for (let x = 0; x < level.width; x++) {
          for (let y = 0; y < level.height; y++) {
            if (level.levelArray[x][y] == level.levelArray[floorAdjustedX][floorAdjustedY] &&
              floorAdjustedX != x && floorAdjustedY != y) {
              this.x = x + 1;
              this.y = y;
              this.angle = (this.angle + Math.PI) % (2 * Math.PI);
            }
          }
        }
      }
      else if (level.isPassable(Math.floor(adjustedX), Math.floor(adjustedY)))
      {
        this.x = adjustedX;
        this.y = adjustedY;
      }
    }
    if (keyCode == 83)
    { //S
      let adjustedX = this.x - Math.sin(this.angle) * this.speed * (0.5) * updateInterval;
      let adjustedY = this.y - Math.cos(this.angle) * this.speed * (0.5) * updateInterval;
      let floorAdjustedX = Math.floor(adjustedX);
      let floorAdjustedY = Math.floor(adjustedY);
      if (level.isPassable(floorAdjustedX, floorAdjustedY))
      {
        this.x = adjustedX;
        this.y = adjustedY;
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