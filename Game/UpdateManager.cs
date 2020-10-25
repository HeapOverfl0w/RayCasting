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
            Players = new List<Player>();
            Enemies = new List<Enemy>();
        }

        public List<Player> Players { get; private set; }

        public List<Enemy> Enemies { get; private set; }

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
            _updateTimer.Change(0, 100);
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
            for (int e = 0; e < Enemies.Count; e++)
            {
                Enemies[e].Update();
            }
            List<Player> playersAndEnemies = new List<Player>();
            playersAndEnemies.AddRange(Players);
            playersAndEnemies.AddRange(Enemies);
            _gameHub.Clients.All.SendAsync("UpdateBros", playersAndEnemies);
        }

    }
}
