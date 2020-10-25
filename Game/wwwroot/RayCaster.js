class RayCaster {
  constructor(maxViewDistance, useShade, shadeColor)
  {
    this.maxViewDistance = maxViewDistance;
    this.useShade = useShade;
    this.shadeColor = shadeColor;
  }

  draw(ctx, camera, level)
  {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    let aspectRatio = cvsWidth / cvsHeight;
    ctx.fillStyle = this.shadeColor;
    ctx.fillRect(0,0, cvsWidth, cvsHeight);
    this.drawSkybox(ctx, camera, level);

    let zBuffer = [];

    for(let x = 0; x < cvsWidth; x++)
    {
      //let rayAngle = (camera.angle - camera.fov / 2) + (x/cvsWidth) * camera.fov;
      let rayAngle = camera.angle + camera.fov * (x / cvsWidth - 0.5);
      let rayData = this.cast(camera, rayAngle, level);
      //let ceiling = cvsHeight / 2 - cvsHeight / rayData.distance;
      //let floor = cvsHeight - ceiling;
      //let wallLength = floor - ceiling;
      let z = rayData.distance * Math.cos(camera.angle - rayAngle);
      let wallLength = cvsHeight / z * aspectRatio;
      let floor = (cvsHeight + 32) / 2 * (1 + 1/z) - 15;
      let ceiling = floor - wallLength;

      rayData.height = wallLength;
      rayData.ceiling = ceiling;
      rayData.rayAngle = rayAngle;
      rayData.column = x;

      if (rayData.distance != this.maxViewDistance)
      {        
        ctx.drawImage(rayData.texture, Math.floor(rayData.texture.width * rayData.sample), 0, 1, rayData.texture.height, x, ceiling, 1, wallLength);
        if (this.useShade)
          this.drawLighting(ctx, rayData);
      }
      this.drawFloor(ctx, camera, floor, x, rayData, level);

      zBuffer.push(rayData);
    }

    this.drawBillboards(ctx, camera, zBuffer, level.billboardTextures, level.billboards, level);
    this.drawBillboards(ctx, camera, zBuffer, level.player, level.players);

    if (!camera.attacking)
      ctx.drawImage(level.weapon, 0, 0, level.weapon.width, level.weapon.height, 0, 0, cvsWidth, cvsHeight);
  }

  cast(camera, angle, level)
  {
    let rayAngleX = Math.sin(angle);
    let rayAngleY = Math.cos(angle);
    let rayX = camera.x + rayAngleX;
    let rayY = camera.y + rayAngleY;
    let floorRayX = Math.floor(rayX);
    let floorRayY = Math.floor(rayY);
    let sampleX = 0;
    let distance = 0;
    let isHit = false;

    while(!isHit && distance < this.maxViewDistance)
    {
      distance += 0.05;
      rayX = camera.x + Math.sin(angle) * distance;
      rayY = camera.y + Math.cos(angle) * distance;
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
    return {distance: distance, texture: level.wallTextureAt(floorRayX, floorRayY), sample: sampleX, rayAngleX: rayAngleX, rayAngleY: rayAngleY};
  }

  drawSkybox(ctx, camera, level)
  {
    let cvsHeight = ctx.canvas.height;
    let cvsWidth = ctx.canvas.width;
    let texture = level.skybox;
    var width = texture.width * (cvsHeight / texture.height) * 2;
    let angle = camera.angle;
    if (angle < 0)
      angle = 2*Math.PI + angle;
    var left = (angle / (2*Math.PI)) * -width;

    ctx.drawImage(texture, left, 0, width, cvsHeight);
    if (left < width - cvsWidth) {
      ctx.drawImage(texture, left + width, 0, width, cvsHeight);
    }
  }

  drawBillboards(ctx, camera, zBuffer, suggestedTexture, listOfBillboards, level)
  {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;

    let texture = suggestedTexture;

    for (let i = 0; i < listOfBillboards.length; i++)
    {
      if (PLAYERNUM == listOfBillboards[i].num)
        continue;
      let x = listOfBillboards[i].x - camera.x;
      let y = listOfBillboards[i].y - camera.y;
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
        if (level != undefined)
          texture = level.billboardTexture(listOfBillboards[i].type);

        let z = distanceFromCamera * Math.cos(angle);
        let height = (cvsHeight + texture.height - 16) / z;
        let floor = (cvsHeight + 32) / 2 * (1 + 1/z) - 15;
        let ceiling = floor - height;
        
        let aspectRatio = texture.height / texture.width;
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
              ctx.drawImage(texture, Math.floor(texture.width * sampleX), 0, 1, texture.height, column, ceiling, 1, height);
            }
          }
        }
      }
    }
  }

  drawLighting(ctx, rayData)
  {
    let shade = this.shade(rayData.distance);
    if (shade > 0.3)
    {
      ctx.save();
      ctx.globalAlpha = shade;
      ctx.fillStyle = this.shadeColor;
      ctx.fillRect(rayData.column, rayData.ceiling - 1, 1, rayData.height + 2);
      ctx.restore();
    }
  }

  drawFloor(ctx, camera, floorStart, column, rayData, level)
  {
    let texture = level.floors;
    let cvsHeight = ctx.canvas.height;
    let halfCvsHeight = (cvsHeight + 32) >> 1;
    let floorFloorStart = Math.round(floorStart);
    for (let iy = floorFloorStart; iy < cvsHeight; iy++)
    {
      let distance = (75 / (iy - halfCvsHeight + 15));
      let x = distance * rayData.rayAngleX + camera.x;
      let y = distance * rayData.rayAngleY + camera.y;

      ctx.drawImage(texture, Math.floor((x % 1) * texture.width), Math.floor((y % 1) * texture.height), 1, 1, column, iy, 1,1);
      if (this.useShade)
      {
        let shade = this.shade(distance)
        if (shade > 0.3)
        {
          ctx.save();
          ctx.globalAlpha = shade;
          ctx.fillStyle = this.shadeColor;
          ctx.fillRect(column, iy, 1, 1);
          ctx.restore();
        }
      }
    }
  }

  shade(distance)
  {
    return distance * 0.9 / this.maxViewDistance;
  }
}