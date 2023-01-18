import { removeChildElements } from "./utilities.js";
import { renderGame } from "./rendergame.js";
import { socket } from "./socket.js";
import { startGame } from "./snake_mp.js";
import { redirect } from "./utilities.js";
let role = 'client';
// Document event listeners
document.getElementById("leaveLobby").addEventListener('click', () => {
    leaveLobbyRequest();
});
document.getElementById("playerReady").addEventListener('click', () => {
    socket.emit('playerReadyToggle');
});
// Socket events
socket.on('connect', () => {
    console.log("connected");
    console.log(getLobbyID());
});
socket.on('refreshPlayerList', (players) => {
    players = JSON.parse(players);
    let list = document.getElementById("playerList");
    let startButton = document.getElementById("startButton"); //TODO throws null error is client is not host
    let lobbyReady = [];
    removeChildElements(list);
    players.forEach(player => {
        let li = document.createElement("li");
        li.innerText = player.name;
        if (player.ready) {
            li.className = "text text--green";
        }
        else {
            li.className = "text text--red";
        }
        list.appendChild(li);
        lobbyReady.push(player.ready);
    });
    if (lobbyReady.every(el => el === true)) {
        startButton.disabled = false;
    }
});
socket.on('startGame', () => {
    let num = 5;
    let timer = setInterval(() => {
        document.getElementById("countdown").innerHTML = num.toString();
        num -= 1;
        if (num == 0) {
            clearInterval(timer);
            renderGame();
            startGame(role);
        }
    }, 1000);
});
socket.on('assignHost', () => {
    role = 'host';
    const startButton = document.createElement("button");
    startButton.innerText = "Start";
    startButton.className = "form__item";
    startButton.id = "startButton";
    startButton.disabled = true;
    startButton.addEventListener('click', () => {
        startGameRequest();
    });
    document.getElementById("lobbyControls").appendChild(startButton);
});
socket.on('redirect', (destination) => {
    redirect(destination);
});
// Functions
function leaveLobbyRequest() {
    socket.emit('leaveLobbyRequest');
}
;
function getLobbyID() {
    const params = new URLSearchParams(window.location.search);
    const lobby_id = params.get('lobby_id'); //TODO error handling if lobby_id not found
    return lobby_id;
}
;
function startGameRequest() {
    socket.emit("startGameRequest");
    console.log("game started");
}
;
