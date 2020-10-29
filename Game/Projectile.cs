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

    public bool Update(double speed, int[,] mapData)
    {
      dist += speed;
      x += speed * Math.Sin(a);
      y += speed * Math.Cos(a);
      int mapx = (int)Math.Floor(x + 0.5);
      int mapy = (int)Math.Floor(y + 0.5);
      if (mapx > -1 && mapx < mapData.GetLength(0) && mapy > -1 && mapy < mapData.GetLength(1))
        return mapData[mapx, mapy] > 6 || mapData[mapx, mapy] == 0; //if we hit wall, return false and remove
      else
        return false; //outside the map, remove
    }
  }
}
