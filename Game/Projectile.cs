using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public class Projectile : GameObject
  {
    public double dist { get; set; }
    public int type { get; set; }
    public int own { get; set; }

    public Projectile(double x, double y, double a, int ownership) : base(x, y, a)
    {
      this.a = a;
      this.type = 0; //arrow
      this.own = ownership;
    }

    public void Update(double speed)
    {
      dist += speed;
      x += speed * Math.Sin(a);
      y += speed * Math.Cos(a);
    }
  }
}
