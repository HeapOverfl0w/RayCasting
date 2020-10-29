var MAZE = [];
var PLAYERS = [];
var PLAYERNUM = 0;
var PLAYERKILL = false;
var BRO_MESSAGE = "";
var BRO_CHAT_MESSAGES = [];
var broMessageTimeout = undefined;
var broChatMessageTimeout = undefined;
var PLAYER_NUM = 0;

const gameConnect = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("/raycastworld/")
    .build();

gameConnect.on("UpdateBros", function(result){
    PLAYERS = result;
});

gameConnect.on("PlayerNumber", function (result) {
    PLAYERNUM = result;
});

gameConnect.on("BroConnect", function(result){
    SetMessage(result);
});

gameConnect.on("BroMessage", (result) => {
  SetMessage(result);
});

gameConnect.on("PlayerKill", (pnum, knum) => {
  if (PLAYERNUM == pnum) {
    PLAYERKILL = true;
  }
  SetMessage("Player " + knum + " stabbed Player " + pnum + "!");
});

function SetMessage(message) {
  var node = document.createElement("LI");
  var textnode = document.createTextNode(message);
  node.appendChild(textnode);

  var discussion = document.getElementById("discussion");
  if (discussion.children.length > 20)
    discussion.removeChild(discussion.firstChild);
  discussion.appendChild(node);
}

function Connect()
{
    return new Promise((resolve, reject) => {
      gameConnect.start().then(() => {
        gameConnect.invoke("Connect");
        resolve();
      });
    });
}

function SendLocation(x, y, a)
{
    gameConnect.invoke("SendLocation", x, y, a);
}

function SendBroMessage(message) {
    gameConnect.invoke("SendBroMessage", message);
}

function SendAttack(a) {
  gameConnect.invoke("SendAttack", a);
}

function SendRangedAttack(a) {
  gameConnect.invoke("SendRangedAttack", a);
}