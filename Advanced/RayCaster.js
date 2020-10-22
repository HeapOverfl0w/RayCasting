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
      //let rayAngle = (camera.angle - camera.fov / 2) + (x/cvsWidth) * camera.fov;
      let rayAngle = camera.angle + camera.fov * (x / cvsWidth - 0.5);
      let rayData = this.cast(camera.x, camera.y, rayAngle, level);
      //let ceiling = cvsHeight / 2 - cvsHeight / rayData.distance;
      //let floor = cvsHeight - ceiling;
      //let wallLength = floor - ceiling;
      let z = rayData.distance * Math.cos(camera.angle - rayAngle);
      let wallLength = cvsHeight / z;
      let floor = cvsHeight / 2 * (1 + 1/z);
      let ceiling = floor - wallLength;

      rayData.height = wallLength;

      if (rayData.distance != this.maxViewDistance)
      {        
        ctx.drawImage(rayData.texture, Math.floor(rayData.texture.width * rayData.sample), 0, 1, rayData.texture.height, x, ceiling, 1, wallLength);
      }
      zBuffer.push(rayData);
    }

    this.drawBillboards(ctx, camera, level, zBuffer);
    this.drawLighting(ctx, cvsHeight, zBuffer);
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

  drawBillboards(ctx, camera, level, zBuffer)
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
        //let ceiling = cvsHeight / 2 - cvsHeight / distanceFromCamera;
        //let floor = cvsHeight - ceiling;
        //let height = floor - ceiling;
        let z = distanceFromCamera * Math.cos(angle);
        let height = cvsHeight / z;
        let floor = cvsHeight / 2 * (1 + 1/z);
        let ceiling = floor - height;
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
            if (zBuffer[column].distance >= distanceFromCamera)
            {
              ctx.drawImage(billboardTexture, Math.floor(billboardTexture.width * sampleX), 0, 1, billboardTexture.height, column, ceiling, 1, height);
              zBuffer[column].distance = distanceFromCamera;
              zBuffer[column].height = height;
            }
          }
        }
      }
    }
  }

  drawLighting(ctx, cvsHeight, zBuffer)
  {
    for(let x = 0; x < zBuffer.length; x++)
    {
      ctx.save();
      ctx.globalAlpha = this.shade(zBuffer[x].height, cvsHeight);
      ctx.fillStyle = "#000000";
      ctx.fillRect(x, 0, 1, cvsHeight);
      ctx.restore();
    }
  }

  shade(rayHeight, cvsHeight)
  {
    let modifier = 2;
    return 1 - (rayHeight > cvsHeight / modifier ? 1 : rayHeight * modifier / cvsHeight);
  }
}