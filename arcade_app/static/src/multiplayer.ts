import { removeChildElements } from "./utilities.js"

declare const io: any
const socket = io()



socket.on('refreshPlayerList', (players) => {
    players = JSON.parse(players)
    let list = document.getElementById("playerList")
    players.forEach(player => {
        let li = document.createElement("li");
        li.innerText = player.name;
        list.appendChild(li);
    })
})












// join lobby
function joinLobbyRequest(lobby_public_id: string) {
    socket.emit('joinLobbyRequest', {'public_id': lobby_public_id}, (response) => {
        response = JSON.parse(response)
        if (response.status) {
            console.log(response.msg)
            window.location.href = response.dest;
        } else {
            let item = document.createElement("p")
            item.innerText = response.msg
            item.className = "text text--red" 
            document.getElementById("multiplayer").appendChild(item)
        }
    })
}






