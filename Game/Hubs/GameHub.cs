using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros.Hubs
{
  public class GameHub : Hub
  {
    private UpdateManager _updatedManager;
    public GameHub(UpdateManager updateManager, IHubContext<GameHub> gameHub)
    {
      _updatedManager = updateManager;
      _updatedManager.Initialize(gameHub);
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
      _updatedManager.Players.Remove(Context.Items["player"] as Player);
      return Clients.All.SendAsync("BroConnect", "Bro disconnected.");
    }

    public async Task Connect()
    {
      await Clients.All.SendAsync("BroConnect", "Bro connected.");
      await Clients.Caller.SendAsync("PlayerNumber", ++_updatedManager.CurrentPlayerNumber);
      Context.Items.Add("player", new Player(4, 4, _updatedManager.CurrentPlayerNumber));
      _updatedManager.Players.Add(Context.Items["player"] as Player);
      //await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMaze", _mazeBuilder.CurrentMaze);
    }

    public async Task SendLocation(double x, double y, double a)
    {
      (Context.Items["player"] as Player).x = x;
      (Context.Items["player"] as Player).y = y;
      (Context.Items["player"] as Player).a = a;
    }

    public async Task SendAttack(double a)
    {
      var x = (Context.Items["player"] as Player).x;
      var y = (Context.Items["player"] as Player).y;
      var num = (Context.Items["player"] as Player).num;
      var cameraX = Math.Sin(a);
      var cameraY = Math.Cos(a);

      foreach (Player p in _updatedManager.Players)
      {
        if (p.num != num)
        {
          var angle = Math.Atan2(cameraY, cameraX) - Math.Atan2(p.y - y, p.x - x);
          if (angle < -Math.PI)
            angle += 2 * Math.PI;
          if (angle > Math.PI)
            angle -= 2 * Math.PI;

          if (Math.Abs(angle) < (Math.PI / 4))
          {
            var distanceFromPlayer = Math.Sqrt((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
            if (distanceFromPlayer < 1.7)
            {
              Clients.All.SendAsync("PlayerKill", p.num , num);
              break;
            }
          }
        }
      }

      //boss
      if (_updatedManager.Boss.health > 0)
      {
        var angle = Math.Atan2(cameraY, cameraX) - Math.Atan2(p.y - y, p.x - x);
        if (angle < -Math.PI)
          angle += 2 * Math.PI;
        if (angle > Math.PI)
          angle -= 2 * Math.PI;

        if (Math.Abs(angle) < (Math.PI / 4))
        {
          var distanceFromPlayer = Math.Sqrt((x - _updatedManager.Boss.x) * (x - _updatedManager.Boss.x) + (y - _updatedManager.Boss.y) * (y - _updatedManager.Boss.y));
          if (distanceFromPlayer < 1.7)
          {
            _updatedManager.Boss.health--;
          }
        }
      }
    }

    public async Task SendRangedAttack(double a)
    {
      Projectile p = new Projectile((Context.Items["player"] as Player).x - 0.5, (Context.Items["player"] as Player).y - 0.5, a, (Context.Items["player"] as Player).num);
      p.Update(2);
      _updatedManager.Projectiles.Add(p);    
    }

    public async Task SendBroMessage(string message)
    {
      var commandResult = CommandHandler.Handle(message, Context.Items["player"] as Player);
      if (string.Empty == commandResult)
        Clients.All.SendAsync("BroMessage", message);
      else
        Clients.Caller.SendAsync("BroMessage", commandResult);
    }
  }
}
