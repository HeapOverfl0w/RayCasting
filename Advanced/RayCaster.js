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

    let zBuffer = [];

    for(let x = 0; x < cvsWidth; x++)
    {
      let rayAngle = (camera.angle - camera.fov / 2) + (x/cvsWidth) * camera.fov;
      let rayData = this.cast(camera.x, camera.y, rayAngle, level);
      let ceiling = cvsHeight / 2 - cvsHeight / rayData.distance;
      let floor = cvsHeight - ceiling;
      let wallLength = floor - ceiling;

      if (rayData.distance != this.maxViewDistance)
      {
        ctx.save();
        ctx.drawImage(rayData.texture, Math.floor(rayData.texture.width * rayData.sample), 0, 1, rayData.texture.height, x, ceiling, 1, wallLength);
        let shade = this.shade(wallLength, cvsHeight);
        ctx.globalAlpha = shade.alpha;
        ctx.fillStyle = shade.color;
        ctx.fillRect(x, ceiling, 1, wallLength);
        ctx.restore();
      }
      zBuffer.push(rayData);
    }

    this.drawBillboards(ctx, camera, level, zBuffer);
  }

  cast(x, y, angle, level)
  {
    let rayX = x + Math.sin(angle);
    let rayY = y + Math.cos(angle);
    let floorRayX = Math.floor(rayX);
    let floorRayY = Math.floor(rayY);
    let sampleX = 0;
    let distance = 0;
    let isHit = false;

    while(!isHit && distance < this.maxViewDistance)
    {
      distance += 0.01;
      rayX = x + Math.sin(angle) * distance;
      rayY = y + Math.cos(angle) * distance;
      floorRayX = Math.floor(rayX);
      floorRayY = Math.floor(rayY);

      //boundary check
      if (floorRayX < 0 || floorRayX >= level.width || floorRayY < 0 || floorRayY > level.height || distance >= this.maxViewDistance)
      {
        isHit = true;
        distance = this.maxViewDistance;
      }
      else
      {
        if (level.isWall(floorRayX, floorRayY))
        {
          isHit = true;

          let blockMidX = floorRayX + 0.5;
          let blockMidY = floorRayY + 0.5;
          let testAngle = Math.atan2(rayY - blockMidY, rayX - blockMidX);

          if (testAngle >= -Math.PI * 0.25 && testAngle < Math.PI * 0.25)
            sampleX = rayY - floorRayY;
          else if (testAngle >= Math.PI * 0.25 && testAngle < Math.PI * 0.75)
            sampleX = rayX - floorRayX;
          else if (testAngle < -Math.PI * 0.25 && testAngle >= -Math.PI * 0.75)
            sampleX = rayX - floorRayX;
          else if (testAngle >= Math.PI * 0.75 || testAngle < -Math.PI * 0.75)
            sampleX = rayY - floorRayY;
        }
      }
    }
    return {distance: distance, texture: level.wallTextureAt(floorRayX, floorRayY), sample: sampleX};
  }

  drawBillboards(ctx, camera, level, zbuffer)
  {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;

    for (let i = 0; i < level.billboards.length; i++)
    {
      let x = level.billboards[i].x - camera.x;
      let y = level.billboards[i].y - camera.y;
      let distanceFromCamera = Math.sqrt(x*x + y*y);

      let cameraX = Math.sin(camera.angle);
      let cameraY = Math.cos(camera.angle);

      //Calculate the angle between the object and the player and see if it's in FOV
      let angle = Math.atan2(cameraY, cameraX) - Math.atan2(y, x);
      if (angle < -Math.PI)
        angle += 2 * Math.PI;
      if (angle > Math.PI)
        angle -= 2 * Math.PI;

      let inFov = Math.abs(angle) < camera.fov / 2;

      if (inFov && distanceFromCamera >= 0.5 && distanceFromCamera < this.maxViewDistance)
      {
        let ceiling = cvsHeight / 2 - cvsHeight / distanceFromCamera;
        let floor = cvsHeight - ceiling;
        let height = floor - ceiling;
        let billboardTexture = level.billboardTexture(level.billboards[i].type);
        let aspectRatio = billboardTexture.height / billboardTexture.width;
        let width = height / aspectRatio;
        let center = (0.5 * (angle / (camera.fov / 2)) + 0.5) * cvsWidth;

        for (let ix = 0; ix < width; ix++)
        {
          let sampleX = ix / width;
          //let sampleY = iy / height;
          let column = Math.floor(center + ix - width / 2);
          if (column >= 0 && column < cvsWidth)
          {
            if (zbuffer[column].distance >= distanceFromCamera)
            {
              ctx.drawImage(billboardTexture, Math.floor(billboardTexture.width * sampleX), 0, 1, billboardTexture.height, column, ceiling, 1, height);
            }
          }
        }
      }
    }
  }

  shade(rayHeight, cvsHeight)
  {
    let shade = rayHeight / cvsHeight;
    shade = shade > 1 ? 1 : shade;
    shade = Math.floor(80 * shade)
    return {color: "rgb(" + shade + "," + shade + "," + shade + ")", alpha: 1.0 - shade / 80 };
  }
}