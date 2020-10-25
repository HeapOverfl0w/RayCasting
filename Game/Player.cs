using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
    public class Player
    {
        public double x { get; set; }
        public double y { get; set; }

        public double a { get; set; }

        public int num { get; set; }

        public bool isEnemy { get; set; }
        public Player(double x, double y, int num, bool isEnemy = false)
        {
            this.x = x;
            this.y = y;
            this.num = num;
            this.isEnemy = isEnemy;
        }
    }
}
