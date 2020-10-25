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
                     [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
                     [1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1],
                     [1,0,1,0,0,0,0,0,1,0,1,1,1,1,0,0,1,0,0,1],
                     [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                     [1,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0,1],
                     [1,0,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1,0,0,1],
                     [1,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,1,0,1],
                     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],]
    this.level = new Level(demoLevel);
    this.camera = new Camera(this.level.width/2, this.level.height/2, 0, Math.PI * (4/18), 5);
    this.rayCaster = new RayCaster(15, true, "#7da1f5");
    this.FPS = 25;
    this.lastSecond = new Date().getTime();
    this.lastAttack = new Date().getTime();
    this.lastX = this.camera.x;
    this.lastY = this.camera.y;

    this.spawns = [{ x: 2, y: 18, a: 2.84 }, { x: 2, y: 2, a: 0.8 }, { x: 15, y: 1, a: 1.4 }, { x: 8, y: 18, a: 1.9 }];

    this.keysDown = [];
  }

  initialize()
  {
    Connect().then(() => { setInterval(this.update, 1000 / this.FPS, this) });
  }

  update(main)
  {
    let currentTime = new Date().getTime();

    main.level.players = PLAYERS;

    if (PLAYERKILL)
    {
      PLAYERKILL = false;
      let spawn = Math.floor(Math.random() * main.spawns.length);
      if (spawn >= main.spawns.length)
        spawn = spawn.length - 1;
      main.camera.x = main.spawns[spawn].x;
      main.camera.y = main.spawns[spawn].y;
      main.camera.angle = main.spawns[spawn].a;
    }

    if (main.camera.attacking && currentTime - main.lastAttack > 1500)
    {
      main.camera.attacking = false;
    }

    for (let k = 0; k < main.keysDown.length; k++)
      main.camera.handleKeyDown(main.keysDown[k], main.level, 1/main.FPS);
    main.rayCaster.draw(main.ctx, main.camera, main.level);

    

    if (currentTime - main.lastSecond > 100 && (main.lastX != main.camera.x || main.lastY != main.camera.y))
    {
      main.lastSecond = currentTime;
      main.lastX = main.camera.x;
      main.lastY = main.camera.y;
      SendLocation(main.camera.x, main.camera.y);
    }
  }

  handleKeyDown(keyCode)
  {
    if (!this.keysDown.includes(keyCode))
      this.keysDown.push(keyCode);
  }

  handleKeyUp(keyCode)
  {
    if (keyCode == 13) //enter
    {
      let chatbox = document.getElementById("chatbox");
      if (chatbox.style.visibility == "hidden") {
        chatbox.style.visibility = "visible";
        chatbox.focus();
      }
      else {
        if (chatbox.value != undefined && chatbox.value != "")
          SendBroMessage("Player "+PLAYERNUM+" : " + chatbox.value);
        chatbox.style.visibility = "hidden";
        chatbox.value = "";
      }
    }

    let currentTime = new Date().getTime();

    if (keyCode == 32 && currentTime - this.lastAttack > 1500) //space
    {
      this.camera.attacking = true;
      this.lastAttack = currentTime;
      SendAttack(this.camera.angle);
    }

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