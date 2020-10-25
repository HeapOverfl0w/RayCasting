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
    this.lastDeath = new Date().getTime();
    this.lastX = this.camera.x;
    this.lastY = this.camera.y;
    this.keysDown = [];

    this.weapon2RechargeTime = 3500;
    this.weaponRechargeTime = 1500;
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
      main.lastDeath = currentTime;
      PLAYERKILL = false;
      let spawn = Math.floor(Math.random() * main.spawns.length);
      if (spawn >= main.spawns.length)
        spawn = spawn.length - 1;
      main.camera.x = main.spawns[spawn].x;
      main.camera.y = main.spawns[spawn].y;
      main.camera.angle = main.spawns[spawn].a;
    }

    let timeRequirement = main.camera.weapon == 2 ? main.weapon2RechargeTime : main.weaponRechargeTime;
    if (main.camera.attacking && currentTime - main.lastAttack > timeRequirement)
    {
      main.camera.attacking = false;
    }

    for (let k = 0; k < main.keysDown.length; k++)
      main.camera.handleKeyDown(main.keysDown[k], main.level, 1 / main.FPS);

    main.rayCaster.draw(main.ctx, main.camera, main.level);

    if (currentTime - main.lastSecond > 100 && (main.lastX != main.camera.x || main.lastY != main.camera.y))
    {
      main.lastSecond = currentTime;
      main.lastX = main.camera.x;
      main.lastY = main.camera.y;
      SendLocation(main.camera.x, main.camera.y);
    }

    //check if hit by arrow
    for (let i = 0; i < main.level.players.length; i++) {
      let a = main.level.players[i];
      if (a.isEnemy) {
        if (((a.x) > (main.camera.x - 0.5)) &&
          ((a.x) < (main.camera.x + 0.5)) &&
          ((a.y) > (main.camera.y - 0.5)) &&
          ((a.y) < (main.camera.y + 0.5))) {
          SendBroMessage("Player " + PLAYERNUM + " was killed by an arrow!");
          PLAYERKILL = true;
        }
      }
    }

    if (currentTime - main.lastDeath < 1000) {
      main.ctx.save()
      main.ctx.globalAlpha = 0.3;
      main.ctx.fillStyle = "Red";
      main.ctx.fillRect(0, 0, main.ctx.canvas.width, main.ctx.canvas.height);
      main.ctx.restore();
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
    let timeRequirement = this.camera.weapon == 2 ? this.weapon2RechargeTime : this.weaponRechargeTime;
    if (keyCode == 32 && currentTime - this.lastAttack > timeRequirement) //space
    {
      this.camera.attacking = true;
      this.lastAttack = currentTime;
      if (this.camera.weapon == 1)
        SendAttack(this.camera.angle);
      else
        SendRangedAttack(this.camera.angle);
    }

    if (keyCode == 50 && this.camera.weapon != 2 && currentTime - this.lastAttack > timeRequirement) //2 switch to bow
    {
      this.camera.weapon = 2;
    }
    if (keyCode == 49 && this.camera.weapon != 1 && currentTime - this.lastAttack > timeRequirement) //1 switch to sword
    {
      this.camera.weapon = 1;
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