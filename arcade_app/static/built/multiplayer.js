const socket = io();
socket.on('refreshPlayerList', (players) => {
    players = JSON.parse(players);
    let list = document.getElementById("playerList");
    players.forEach(player => {
        let li = document.createElement("li");
        li.innerText = player.name;
        list.appendChild(li);
    });
});
// socket.on('connect', function() {
//     console.log(socket.id)
//     socket.emit('joined', {data: "typescript connected"})
// })
//const form = document.getElementById("createLobbyForm")
// button.onclick = () => {
//     socket.emit('createLobbyRequest', {"room": form.lobbyName.value})
//     console.log('lobby requested')
// }
// join lobby
function joinLobbyRequest(lobby_public_id) {
    socket.emit('joinLobbyRequest', { 'public_id': lobby_public_id }, (response) => {
        response = JSON.parse(response);
        if (response.status) {
            console.log(response.msg);
            window.location.href = response.dest;
        }
        else {
            let item = document.createElement("p");
            item.innerText = response.msg;
            item.className = "text text--red";
            document.getElementById("multiplayer").appendChild(item);
        }
    });
}
export {};
