using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public class Projectile : Player
  {
    public double dist { get; set; }

    public Projectile(double x, double y, double a) : base(x, y, -1, true)
    {
      this.a = a;
    }

    public void Update(double speed)
    {
      dist += speed;
      x += speed * Math.Sin(a);
      y += speed * Math.Cos(a);
    }
  }
}
