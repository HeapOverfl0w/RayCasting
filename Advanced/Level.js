class Level
{
  constructor(levelArray, data)
  {
    this.levelArray = levelArray;
    this.width = levelArray.length;
    this.height = levelArray[0].length;
    this.billboards = [{type: 1, x: 2, y: 2}];
    this.data = data;

    this.loadTextures();
  }

  loadTextures()
  {
    this.wallTextures = document.getElementById("walls");
    this.billboardTextures = document.getElementById("billboards");
    this.floors = document.getElementById("floors");
    this.skybox = document.getElementById("skybox");
  }

  isWall(x, y)
  {
    //for out of bounds just put a wall
    if (x < 0 || x >= this.levelArray.length || y < 0 || y >= this.levelArray[x].length)
      return true;
    else
      return this.levelArray[x][y] > 0 && this.levelArray[x][y] < 100;
  }

  isPassable(x, y) {
    return !this.isWall(x, y);
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
          return this.data.textures["walls"];
      }
    }
  }

  billboardTexture(type)
  {
    switch(type)
    {
      case 1:
        return this.data.textures["billboards"];
    }
  }
}