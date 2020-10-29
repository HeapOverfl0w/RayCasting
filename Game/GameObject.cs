using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public abstract class GameObject
  {
    public double x { get; set; }
    public double y { get; set; }
    public double a { get; set; }

    public GameObject(double x, double y, double a)
    {
      this.x = x;
      this.y = y;
      this.a = a;
    }
  }
}
