class Main
{
  constructor(ctx)
  {
    this.ctx = ctx;
    let demoLevel = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                     [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
                     [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
    this.level = new Level(demoLevel);
    this.camera = new Camera(this.level.width/2, this.level.height/2, 0, Math.PI * (4/18), 5);
    this.rayCaster = new RayCaster(15, true, "#7da1f5");
    this.FPS = 30;
    this.fpsCounter = 0;
    this.lastSecond = new Date().getTime();

    this.keysDown = [];
  }

  initialize()
  {
    setInterval(this.update, 1000/this.FPS, this);
  }

  update(main)
  {
    for (let k = 0; k < main.keysDown.length; k++)
      main.camera.handleKeyDown(main.keysDown[k], main.level, 1/main.FPS);
    main.rayCaster.draw(main.ctx, main.camera, main.level);

    main.fpsCounter++;
    if (new Date().getTime() - main.lastSecond > 1000)
    {
      console.log(main.fpsCounter);
      main.fpsCounter = 0;
      main.lastSecond = new Date().getTime();
    }
  }

  handleKeyDown(keyCode)
  {
    if (!this.keysDown.includes(keyCode))
      this.keysDown.push(keyCode);
  }

  handleKeyUp(keyCode)
  {
    let removeAt = -1;
    for(let k = 0; k < this.keysDown.length; k++)
    {
      if (this.keysDown[k] == keyCode)
        removeAt = k;
    }
    
    if (removeAt != -1)
      this.keysDown.splice(removeAt,1);
  }
}