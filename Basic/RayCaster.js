class RayCaster {
  constructor(maxViewDistance)
  {
    this.maxViewDistance = maxViewDistance;
  }

  draw(ctx, camera, level)
  {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, cvsWidth, cvsHeight);

    let wallBuffer = [];

    for(let x = 0; x < cvsWidth; x++)
    {
      let rayAngle = (camera.angle - camera.fov / 2) + (x/cvsWidth) * camera.fov;
      let rayData = this.cast(camera.x, camera.y, rayAngle, level);
      let ceiling = cvsHeight / 2 - cvsHeight / rayData.distance;
      let floor = cvsHeight - ceiling;
      let wallLength = floor - ceiling;

      let shade = rayData.distance != this.maxViewDistance ? this.shade(wallLength, cvsHeight) : rayData.color;
      if (shade != "#000000")
      {
        ctx.fillStyle = shade;
        ctx.fillRect(x, ceiling, 1, wallLength);
      }
      wallBuffer.push(rayData);
    }
  }

  cast(x, y, angle, level)
  {
    let rayX = x + Math.sin(angle);
    let rayY = y + Math.cos(angle);
    let distance = 0;
    let isHit = false;

    while(!isHit && distance < this.maxViewDistance)
    {
      distance += 0.01;
      rayX = Math.floor(x + Math.sin(angle) * distance);
      rayY = Math.floor(y + Math.cos(angle) * distance);

      //boundary check
      if (rayX < 0 || rayX >= level.width || rayY < 0 || rayY > level.height || distance >= this.maxViewDistance)
      {
        isHit = true;
        distance = this.maxViewDistance;
      }
      else
      {
        if (level.isWall(rayX, rayY))
        {
          isHit = true;
        }
      }
    }
    return {distance: distance, color: level.wallColorAt(rayX, rayY)};
  }

  shade(rayHeight, cvsHeight)
  {
    let shade = rayHeight / cvsHeight;
    shade = shade > 1 ? 1 : shade;
    return this.rgbToHex(Math.floor(230 * shade), Math.floor(230 * shade), Math.floor(230 * shade));
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}