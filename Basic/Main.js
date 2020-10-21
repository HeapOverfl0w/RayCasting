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
                     [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
    this.level = new Level(demoLevel);
    this.camera = new Camera(this.level.width/2, this.level.height/2, 0, 100);
    this.rayCaster = new RayCaster(90);
    this.FPS = 30;
  }

  initialize()
  {
    setInterval(this.update, 1000/this.FPS, this);
  }

  update(main)
  {
    main.rayCaster.draw(main.ctx, main.camera, main.level);
  }

  handleKeyDown(keyCode)
  {
    this.camera.handleKeyDown(keyCode, this.level);
  }
}