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
    this.isStrafing = false;
  }

  handleKeyDown(keyCode, level, updateInterval, isStrafing)
  {
    if (keyCode == 87)
    { //W
      let modifier = this.isStrafing ? 0.4 : 1;
      let adjustedX = this.x + Math.sin(this.angle) * this.speed * modifier * updateInterval;
      let adjustedY = this.y + Math.cos(this.angle) * this.speed * modifier * updateInterval;
      if (level.isPassable(Math.floor(adjustedX), Math.floor(adjustedY)))
      {
        this.x = adjustedX;
        this.y = adjustedY;
      }
    }
    if (keyCode == 83)
    { //S
      let modifier = this.isStrafing ? 0.2 : 0.5;
      let adjustedX = this.x - Math.sin(this.angle) * this.speed * modifier * updateInterval;
      let adjustedY = this.y - Math.cos(this.angle) * this.speed * modifier * updateInterval;
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
      let adjustedX = this.x - Math.sin(this.angle + Math.PI/2) * this.speed * (0.4) * updateInterval;
      let adjustedY = this.y - Math.cos(this.angle + Math.PI/2) * this.speed * (0.4) * updateInterval;
      let floorAdjustedX = Math.floor(adjustedX);
      let floorAdjustedY = Math.floor(adjustedY);
      if (level.isPassable(floorAdjustedX, floorAdjustedY)) {
        this.x = adjustedX;
        this.y = adjustedY;
      }
      this.isStrafing = true;
    }
    if (keyCode == 68)
    { //D
      let adjustedX = this.x - Math.sin(this.angle - Math.PI/2) * this.speed * (0.4) * updateInterval;
      let adjustedY = this.y - Math.cos(this.angle - Math.PI/2) * this.speed * (0.4) * updateInterval;
      let floorAdjustedX = Math.floor(adjustedX);
      let floorAdjustedY = Math.floor(adjustedY);
      if (level.isPassable(floorAdjustedX, floorAdjustedY)) {
        this.x = adjustedX;
        this.y = adjustedY;
      }
      this.isStrafing = true;
    }
  }
}