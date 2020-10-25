class Level
{
  constructor(levelArray) {
    this.levelArray = levelArray;
    this.width = levelArray.length;
    this.height = levelArray[0].length;
    this.billboards = [{ type: 1, x: 2, y: 2 },
    { type: 1, x: 5, y: 7 },
    { type: 1, x: 9, y: 4 },
    { type: 1, x: 6, y: 18 },
    { type: 1, x: 3, y: 17 },
    { type: 1, x: 10, y: 7 },
      { type: 2, x: 5, y: 5 },
      { type: 2, x: 4, y: 17 },
      { type: 2, x: 3, y: 12 },
      { type: 2, x: 13, y: 5 },
      { type: 2, x: 8, y: 5 },
      { type: 2, x: 12, y: 10 }];
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
    this.weapon = document.getElementById("weapon");
    this.bush = document.getElementById("bush");
  }

  isWall(x, y)
  {
    //for out of bounds just put a wall
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return true;
    else
      return this.levelArray[x][y] > 0 && this.levelArray[x][y] < 100;
  }

  wallTextureAt(x, y)
  {
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return "#000000";
    else
    {
      switch(this.levelArray[x][y])
      {
        case 1:
          return this.wallTextures;
      }
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
    }
  }
}