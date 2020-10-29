using HedgeMazeWithBros.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public class UpdateManager
  {
    private Timer _updateTimer;
    private Timer _resetGameTimer;
    private bool _initialized;
    private IHubContext<GameHub> _gameHub;

    



    public int CurrentPlayerNumber { get; set; }

    public UpdateManager()
    {
      _initialized = false;
      _updateTimer = new Timer(new TimerCallback(TimerTask), null, Timeout.Infinite, Timeout.Infinite);
      Boss = new Boss(20, 20);
      Players = new List<Player>();
      Projectiles = new List<Projectile>();

      MapData =  new int[,]{{3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 2, 2, 5, 71, 5, 2, 2, 2},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1, 5, 2, 5, 7, 5, 2, 5, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 71, 2, 4, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 7, 7, 7, 7, 7, 7, 2},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 7, 7, 7, 7, 7, 7, 2},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 5, 5, 7, 7, 5, 5, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 4, 2, 4, 4, 4, 2, 4, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 7, 7, 5, 5, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 2, 7, 7, 7, 7, 7, 2, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 5, 5, 5, 7, 7, 5, 5, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 4, 7, 7, 7, 7, 7, 4, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 5, 5, 5, 7, 7, 5, 73, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 4, 7, 7, 7, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 4, 7, 7, 7, 7, 7, 4, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 2, 7, 7, 7, 7, 7, 7, 2},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 2, 7, 7, 7, 7, 7, 2, 0, 0, 1, 7, 1, 1, 1, 1, 0, 0, 1, 2, 7, 7, 7, 7, 7, 7, 2},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 4, 2, 2, 72, 2, 2, 4, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 5, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 5, 2, 5, 5, 2, 5, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 5, 7, 7, 2, 2, 72, 2, 2, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 7, 7, 7, 7, 7, 7, 7, 7, 2},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 7, 7, 7, 7, 7, 7, 7, 7, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 5, 5, 2, 5, 5, 2, 5, 5},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 4, 2, 2, 2, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 2, 2, 4, 4, 2, 2, 4, 4, 4},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 4, 2, 73, 2, 4, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3},
      {8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3}};
    }

    public List<Player> Players { get; private set; }

    public List<Projectile> Projectiles { get; private set; }

    public Boss Boss { get; private set; }

    public int[,] MapData { get; private set; }

    public void Initialize(IHubContext<GameHub> gameHub)
    {
      if (!_initialized)
      {
        _gameHub = gameHub;
        _initialized = true;
        StartGame();
      }
    }
    public void StartGame()
    {
      _updateTimer.Change(0, 75);
    }

    public void StopGame()
    {
      _updateTimer.Change(Timeout.Infinite, Timeout.Infinite);
    }

    /// <summary>
    /// lol
    /// </summary>
    public void ResetResetGameTimer()
    {
      _resetGameTimer.Change(Timeout.Infinite, Timeout.Infinite);
      _resetGameTimer.Change(1000 * 60 * 10, 1000 * 60 * 10);
    }

    private void TimerTask(object timerState)
    {
      List<int> projectilesToRemove = new List<int>(); 
      for (int e = 0; e < Projectiles.Count; e++)
      {
        if (!Projectiles[e].Update(1, MapData) || Projectiles[e].dist > 20)
        {
          projectilesToRemove.Add(e);
        }
      }

      foreach(int e in projectilesToRemove)
      {
        try
        {
          Projectiles.RemoveAt(e);
        }
        catch { } //could have thread collision, forget about it and try next update
      }

      Boss.Update(Players, Projectiles, _gameHub);

      List<dynamic> playersAndProjectiles = new List<dynamic>();
      playersAndProjectiles.AddRange(Players);
      try
      {
        playersAndProjectiles.AddRange(Projectiles);
        if (Boss.health > 0)
          playersAndProjectiles.Add(Boss);
      }
      catch { } //could have thread collision, forget about it and try next update
      _gameHub.Clients.All.SendAsync("UpdateBros", playersAndProjectiles);
    }

  }
}
