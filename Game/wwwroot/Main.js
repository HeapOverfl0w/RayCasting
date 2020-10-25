class Main
{
  constructor(ctx)
  {
    this.ctx = ctx;
    this.spawns = [{ x: 2, y: 30, a: 2.19 }, { x: 2, y: 14, a: 0.8 }, { x: 15, y: 13, a: 1.4 }, { x: 8, y: 30, a: 1.9 }];
    let demoLevel = [
                      [3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,4,2,2,2,4,1,1,1,1,1,1,2,2,5,71,5,2,2,2],
                      [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,0,1,5,2,5,7,5,2,5,5],
                      [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                      [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,4,2,72,2,4,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,7,7,7,7,7,7,2],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,7,7,7,7,7,7,2],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,5,5,5,7,7,5,5,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,4,2,4,4,4,2,4,0,0,0,0,1,1,1,1,1,1,1,5,5,5,7,7,5,5,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,2,7,7,7,7,7,2,0,0,0,0,1,0,0,1,0,0,1,5,5,5,7,7,5,5,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,4,7,7,7,7,7,4,0,0,0,0,1,0,0,1,0,0,1,5,5,5,7,7,5,5,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,4,7,7,7,7,7,4,0,0,0,0,0,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,4,7,7,7,7,7,4,0,0,1,1,1,0,0,1,0,0,1,2,7,7,7,7,7,7,2],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,2,7,7,7,7,7,2,0,0,1,7,1,1,1,1,0,0,1,2,7,7,7,7,7,7,2],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,4,2,2,71,2,2,4,0,0,1,1,0,0,0,0,0,0,1,5,7,7,7,7,7,7,5],
                     [8,8,8,8,8,8,8,8,8,8,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,5,5,2,5,5,2,5,5],
                     [3,3,3,3,3,3,3,3,3,3,3,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,5,7,7,2,2,72,2,2,5],
                     [3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,7,7,7,7,7,7,7,7,2],
                     [3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,7,7,7,7,7,7,7,7,5],
                     [3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,2,5,5,2,5,5],]
    this.level = new Level(demoLevel);
    this.camera = new Camera(this.spawns[0].x, this.spawns[0].y, this.spawns[0].a, Math.PI * (4/18), 5);
    this.rayCaster = new RayCaster(15, true, "#7da1f5");
    this.FPS = 25;
    this.lastSecond = new Date().getTime();
    this.lastAttack = new Date().getTime();
    this.lastX = this.camera.x;
    this.lastY = this.camera.y;
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
    let chatbox = document.getElementById("chatbox");
    if (chatbox.style.visibility == "visible")
      return;

    if (!this.keysDown.includes(keyCode))
      this.keysDown.push(keyCode);
  }

  handleKeyUp(keyCode)
  {
    let chatbox = document.getElementById("chatbox");
    if (keyCode == 13) //enter
    {      
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

    if (chatbox.style.visibility == "visible")
      return;

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