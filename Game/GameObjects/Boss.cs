using HedgeMazeWithBros;
using HedgeMazeWithBros.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public class Boss : GameObject
  {
    public int health { get; set; }
    private long _lastAttack = 0;
    private long _respawnTimer = 0;
    public Boss(double x, double y) : base(x, y, 0)
    {
      health = 6;
    }

    public void Update(List<Player> players, List<Projectile> projectiles, IHubContext<GameHub> gameHub)
    {
      var currentTime = DateTime.Now.Ticks / 10000;

      if (currentTime - _respawnTimer > 60000 && health <= 0)
      {
        gameHub.Clients.All.SendAsync("BroMessage", "The Boss has respawned.");
        health = 6;
      }
      else if (currentTime - _respawnTimer < 60000 && health <= 0) //dead
        return;

      try
      {
        foreach (Projectile p in projectiles)
        {
          //detect collision with Boss
          if (((p.x + 0.5) > (x - 0.6)) &&
            ((p.x + 0.5) < (x + 0.6)) &&
            ((p.y + 0.5) > (y - 0.6)) &&
            ((p.y + 0.5) < (y + 0.6)))
          {
            health -= 1;

            if (health <= 0)
            {
              gameHub.Clients.All.SendAsync("BroMessage", "The Boss has been slain.");
              _respawnTimer = currentTime;
            }
            else if (health < 3)
              gameHub.Clients.All.SendAsync("BroMessage", "The Boss is very weak.");
            else if (health < 5)
              gameHub.Clients.All.SendAsync("BroMessage", "The Boss is injured.");
          }
        }

        var currentMillisecondTicks = currentTime;
        if (currentMillisecondTicks - _lastAttack > 2000)
        {
          foreach (Player p in players)
          {
            var distanceFromPlayer = Math.Sqrt((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
            if (distanceFromPlayer < 12)
            {
              var angleTowardsPlayer = Math.Atan2(p.x - x, p.y - y);
              projectiles.Add(new Projectile(x - 0.5, y - 0.5, angleTowardsPlayer, -1) { type = 1 });
              projectiles.Add(new Projectile(x - 0.5, y - 0.5, angleTowardsPlayer + Math.PI / 8, -1) { type = 1 });
              projectiles.Add(new Projectile(x - 0.5, y - 0.5, angleTowardsPlayer - Math.PI / 8, -1) { type = 1 });
              _lastAttack = currentTime;
              break;
            }
          }
        }
      }
      catch
      { } //collection modification in progress, just let him attack next iteration
    }
  }
}
