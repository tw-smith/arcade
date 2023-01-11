import { removeChildElements } from "./utilities.js";
const socket = io();
document.getElementById("leaveLobby").addEventListener('click', () => {
    console.log("requested lobby leave");
    leaveLobbyRequest();
});
document.getElementById("playerReady").addEventListener('click', () => {
    socket.emit('playerReadyToggle');
});
function getLobbyID() {
    const params = new URLSearchParams(window.location.search);
    const lobby_id = params.get('lobby_id'); //TODO error handling if lobby_id not found
    return lobby_id;
}
function startGameRequest() {
    socket.emit("startGameRequest");
    console.log("game started");
}
socket.on('startGame', () => {
    let num = 5;
    let timer = setInterval(() => {
        document.getElementById("countdown").innerHTML = num.toString();
        num -= 1;
        if (num == 0) {
            clearInterval(timer);
        }
    }, 1000);
});
// get lobby ID on connect
socket.on('connect', () => {
    console.log("connected");
    console.log(getLobbyID());
});
socket.on('assignHost', () => {
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
socket.on('refreshPlayerList', (players) => {
    players = JSON.parse(players);
    let list = document.getElementById("playerList");
    let startButton = document.getElementById("startButton");
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
// join lobby
function joinLobbyRequest(lobby_public_id) {
    socket.emit('joinLobbyRequest', { 'public_id': lobby_public_id }, (response) => {
        response = JSON.parse(response);
        if (response.status) {
            socket.disconnect();
            console.log(socket.connected);
            console.log(response.msg);
            window.location.href = response.dest;
            console.log(socket.connected);
            console.log(response.msg);
        }
        else {
            let item = document.createElement("p");
            item.innerText = response.msg;
            item.className = "text text--red";
            document.getElementById("multiplayer").appendChild(item);
        }
    });
}
socket.on('redirect', (dest) => {
    window.location.href = dest;
});
// leave  lobby
function leaveLobbyRequest() {
    console.log("emitting lobby leave request...");
    socket.emit('leaveLobbyRequest');
}
