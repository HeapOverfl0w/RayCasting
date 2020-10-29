class Level
{
  constructor(levelArray) {
    this.levelArray = levelArray;
    this.width = levelArray.length;
    this.height = levelArray[0].length;
    this.billboards = [{ type: 1, x: 2, y: 14 },
    { type: 1, x: 5, y: 19 },
    { type: 1, x: 9, y: 16 },
    { type: 1, x: 6, y: 30 },
    { type: 1, x: 3, y: 29 },
      { type: 1, x: 17, y: 19 },
      { type: 1, x: 24, y: 24 },
      { type: 1, x: 22, y: 26 },
      { type: 1, x: 26, y: 15 },
      { type: 1, x: 25, y: 34 },
      { type: 1, x: 28, y: 37 },
      { type: 2, x: 5, y: 17 },
      { type: 2, x: 4, y: 29 },
      { type: 2, x: 3, y: 24 },
      { type: 2, x: 13, y: 21 },
      { type: 2, x: 8, y: 17 },
      { type: 2, x: 12, y: 22 },
      { type: 2, x: 24, y: 15 },
      { type: 2, x: 25, y: 28 },
      { type: 2, x: 27, y: 23 },
      { type: 2, x: 22, y: 23 },
      { type: 2, x: 25, y: 12 },
      { type: 2, x: 26, y: 16 },
      { type: 3, x: 4, y: 16 },
      { type: 3, x: 4, y: 17 },
      { type: 3, x: 17, y: 13 },
      { type: 3, x: 16, y: 28 },
      { type: 3, x: 21, y: 12 },
      { type: 3, x: 22, y: 12 },
      { type: 3, x: 28, y: 18 }];
    this.players = [];

    this.loadTextures()
  }

  loadTextures()
  {
    this.wallTextures = document.getElementById("walls");
    this.billboardTextures = document.getElementById("billboards");
    this.floors = document.getElementById("floors");
    this.skybox = document.getElementById("skybox");
    this.player = document.getElementById("player");
    this.playerBack = document.getElementById("playerback");
    this.weapon = document.getElementById("weapon");
    this.bush = document.getElementById("bush");
    this.tallWall = document.getElementById("tallwall");
    this.barrell = document.getElementById("barrell");
    this.water = document.getElementById("water");
    this.wateredge = document.getElementById("wateredge");
    this.stoneWall = document.getElementById("stonewall");
    this.wood = document.getElementById("wood");
    this.tallWall2 = document.getElementById("tallwall2");
    this.tallDoor = document.getElementById("talldoor");
    this.tallWallIndoor = document.getElementById("tallwallindoor");
    this.weapon2 = document.getElementById("weapon2");
    this.arrow = document.getElementById("arrow");

    this.player1 = document.getElementById("player1");
    this.playerBack1 = document.getElementById("playerback1");
    this.player2 = document.getElementById("player2");
    this.playerBack2 = document.getElementById("playerback2");
    this.player3 = document.getElementById("player3");
    this.playerBack3 = document.getElementById("playerback3");
    this.player4 = document.getElementById("player4");
    this.playerBack4 = document.getElementById("playerback4");
    this.player5 = document.getElementById("player5");
    this.playerBack5 = document.getElementById("playerback5");
    this.player6 = document.getElementById("player6");
    this.playerBack6 = document.getElementById("playerback6");

    this.boss = document.getElementById("boss");
    this.fireball = document.getElementById("fireball");

    this.playerSkins = [this.player, this.player1, this.player2, this.player3, this.player4, this.player5, this.player6];
    this.playerBackSkins = [this.playerBack, this.playerBack1, this.playerBack2, this.playerBack3, this.playerBack4, this.playerBack5, this.playerBack6];
  }

  isWall(x, y)
  {
    //for out of bounds just put a wall
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return true;
    else
      return (this.levelArray[x][y] > 0 && this.levelArray[x][y] < 7) || this.levelArray[x][y] > 70;
  }

  isPassable(x, y)
  {
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return false;
    else
      return this.levelArray[x][y] == 0 || this.levelArray[x][y] == 7 ;
  }

  wallTextureAt(x, y)
  {
    if (this.levelArray[x][y] > 70)
      return this.tallDoor;
    switch(this.levelArray[x][y])
    {
      case 1:
        return this.wallTextures;
      case 2:
        return this.tallWall;
      case 3:
        return this.stoneWall;
      case 4:
        return this.tallWall2;
      case 5:
        return this.tallWallIndoor;
    }
  }

  isInside(x, y)
  {
    switch (this.levelArray[x][y])
    {
      case 7:
        return true;
    }
    return false;
  }

  isTeleport(x, y)
  {
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return false;
    else
      return this.levelArray[x][y] > 70;
  }

  floorTextureAt(x, y)
  {
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return undefined;

    switch (this.levelArray[x][y])
    {
      case 8:
      case 3:
        return this.water;
      case 9:
        return this.wateredge;
      case 5:
      case 7:
        return this.wood;
      default:
        return this.floors;
    }
  }

  billboardTexture(type)
  {
    switch(type)
    {
      case 1:
        return this.billboardTextures;
      case 2:
        return this.bush;
      case 3:
        return this.barrell;
    }
  }

  projectileTexture(type) {
    switch (type) {
      case 1:
        return this.fireball;
      default:
        return this.arrow;
    }
  }

  playerTexture(skin, isBack) {
    if (skin > -1 && skin < this.playerSkins.length) {
      return isBack ? this.playerBackSkins[skin] : this.playerSkins[skin];
    }
    else
      return isBack ? this.playerBackSkins[0] : this.playerSkins[0];
  }
}