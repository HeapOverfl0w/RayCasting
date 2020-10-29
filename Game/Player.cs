using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public class Player : GameObject
  {
    public int num { get; set; }

    public int skin { get; set; }

    public bool isEnemy { get; set; }
    public Player(double x, double y, int num, bool isEnemy = false) : base (x, y, 0)
    {
      this.num = num;
      this.isEnemy = isEnemy;
      this.skin = 0;
    }
  }
}
