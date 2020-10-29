using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
  public static class CommandHandler
  {
    public static string Handle(string message, Player playerData)
    {
      if (message.StartsWith("/"))
      {
        var commandInputs = message.Split(" ");
        switch (commandInputs[0])
        {
          case "/skin":
            int skinChoice;
            if (commandInputs.Count() > 1 && int.TryParse(commandInputs[1], out skinChoice))
            {
              playerData.skin = skinChoice;
              var characterName = "Viking";
              switch (skinChoice)
              {
                case 1:
                  characterName = "Orc";
                  break;
                case 2:
                  characterName = "Thief";
                  break;
                case 3:
                  characterName = "Mage";
                  break;
                case 4:
                  characterName = "Skeleton";
                  break;
                case 5:
                  characterName = "Knight";
                  break;
                case 6:
                  characterName = "Goblin";
                  break;
              }
              return "You are now the " + characterName + "!";
            }
            break;
        }
      }

      return string.Empty;
    }
  }
}
