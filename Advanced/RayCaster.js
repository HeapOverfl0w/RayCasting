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
    this.renderBuffer = new Array(4 * cvsWidth * cvsHeight);
    let aspectRatio = cvsWidth / cvsHeight;
    ctx.fillStyle = this.shadeColor;
    ctx.fillRect(0,0, cvsWidth, cvsHeight);
    this.drawSkybox(ctx, camera, level);

    this.screenBuffer = ctx.getImageData(0,0,cvsWidth,cvsHeight);

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
      rayData.ceiling = Math.ceil(ceiling);
      rayData.rayAngle = rayAngle;
      rayData.column = x;

      if (rayData.distance != this.maxViewDistance)
      {
        let bufferHeight = Math.floor(rayData.height);
        let bufferCeiling = Math.ceil(rayData.ceiling);
        if (rayData.height > cvsHeight)
          bufferHeight = cvsHeight;
        if (rayData.ceiling < 0)
          bufferCeiling = 0;
        for (let y = 0; y < bufferHeight; y++)
        {
          let ySample = Math.floor(y/rayData.height * rayData.texture.height);
          if (rayData.ceiling < 0)
            ySample = Math.floor((y - rayData.ceiling)/rayData.height * rayData.texture.height);
          let xSample = Math.floor(rayData.texture.width * rayData.sample);
          let textureSample = 4 * (ySample * rayData.texture.width + xSample);
          let screenBufferSample = 4 * ((bufferCeiling + y) * cvsWidth + x);
          this.screenBuffer.data[screenBufferSample] = rayData.texture.data[textureSample];
          this.screenBuffer.data[screenBufferSample + 1] = rayData.texture.data[textureSample + 1];
          this.screenBuffer.data[screenBufferSample + 2] = rayData.texture.data[textureSample + 2];
          this.screenBuffer.data[screenBufferSample + 3] = 255;
        }
        
        //ctx.drawImage(rayData.texture, Math.floor(rayData.texture.width * rayData.sample), 0, 1, rayData.texture.height, x, ceiling, 1, wallLength);
        if (this.useShade)
          this.drawLighting(ctx, rayData);
      }
      this.drawFloor(ctx, camera, floor, x, rayData, level);

      zBuffer.push(rayData);
    }

    this.drawBillboards(ctx, camera, level, zBuffer);

    ctx.putImageData(this.screenBuffer, 0,0);

    ctx.save();
    ctx.strokeStyle = "White";
    ctx.lineWidth = "1";
    ctx.beginPath();
    ctx.rect(cvsWidth / 2, cvsHeight / 2, 1, 1);
    ctx.stroke();
    ctx.restore();
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
        let billboardTexture = level.billboardTexture(level.billboards[i].type);
        let z = distanceFromCamera * Math.cos(angle);
        let height = (cvsHeight + (billboardTexture.height + (cvsHeight * .333))) / z;
        let floor = (cvsHeight + 32) / 2 * (1 + 1/z) - 15;
        let ceiling = floor - height;
        
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
              let bufferHeight = Math.floor(height);
              let bufferCeiling = Math.ceil(ceiling);
              if (height > cvsHeight)
                bufferHeight = cvsHeight;
              if (ceiling < 0)
                bufferCeiling = 0;
              for (let y = 0; y < bufferHeight; y++)
              {
                let ySample = Math.floor(y/height * billboardTexture.height);
                if (ceiling < 0)
                  ySample = Math.floor((y - ceiling)/height * billboardTexture.height);
                let xSample = Math.floor(billboardTexture.width * sampleX);
                let textureSample = 4 * (ySample * billboardTexture.width + xSample);
                let screenBufferSample = 4 * ((bufferCeiling + y) * cvsWidth + column);
                if (billboardTexture.data[textureSample + 3] != 0) {
                  this.screenBuffer.data[screenBufferSample] = billboardTexture.data[textureSample];
                  this.screenBuffer.data[screenBufferSample + 1] = billboardTexture.data[textureSample + 1];
                  this.screenBuffer.data[screenBufferSample + 2] = billboardTexture.data[textureSample + 2];
                  this.screenBuffer.data[screenBufferSample + 3] = billboardTexture.data[textureSample + 3];
                }
              }
              //ctx.drawImage(billboardTexture, Math.floor(billboardTexture.width * sampleX), 0, 1, billboardTexture.height, column, ceiling, 1, height);
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
    let texture = level.data.textures["floors"];
    let cvsHeight = ctx.canvas.height;
    let cvsWidth = ctx.canvas.width;
    let halfCvsHeight = (cvsHeight) >> 1;
    let floorFloorStart = Math.round(floorStart);
    for (let iy = floorFloorStart; iy < cvsHeight; iy++)
    {
      let distance = (300 / (iy - halfCvsHeight));
      let x = distance * rayData.rayAngleX + camera.x;
      let y = distance * rayData.rayAngleY + camera.y;

      let textureSample = 4 * (Math.floor((y % 1) * texture.height) * texture.width + Math.floor((x % 1) * texture.width));
      let screenBufferSample = 4 * (cvsWidth * iy + column);
      this.screenBuffer.data[screenBufferSample] = texture.data[textureSample];
      this.screenBuffer.data[screenBufferSample + 1] = texture.data[textureSample + 1];
      this.screenBuffer.data[screenBufferSample + 2] = texture.data[textureSample + 2];
      this.screenBuffer.data[screenBufferSample + 3] = 255;
      //ctx.drawImage(texture, Math.floor((x % 1) * texture.width), Math.floor((y % 1) * texture.height), 1, 1, column, iy, 1,1);
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