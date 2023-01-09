const socket = io();
document.getElementById("leaveLobby").addEventListener('click', leaveLobbyRequest);
function getLobbyID() {
    const params = new URLSearchParams(window.location.search);
    const lobby_id = params.get('lobby_id'); //TODO error handling if lobby_id not found
    return lobby_id;
}
// get lobby ID on connect
socket.on('connect', () => {
    console.log("connected");
    console.log(getLobbyID());
});
socket.on('refreshPlayerList', (players) => {
    players = JSON.parse(players);
    let list = document.getElementById("playerList");
    players.forEach(player => {
        let li = document.createElement("li");
        li.innerText = player.name;
        list.appendChild(li);
    });
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
// leave  lobby
function leaveLobbyRequest() {
    const lobby_id = getLobbyID();
    socket.emit('leaveLobbyRequest', { 'public_id': lobby_id }, (response) => {
        response = JSON.parse(response);
        if (response.status) {
            console.log("left lobby");
        }
        else {
            console.log("some error in leaving lobby");
        }
    });
}
export {};