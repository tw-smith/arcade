import { removeChildElements } from "./utilities.js";
const socket = io();
// socket.on('connect', function() {
//     console.log(socket.id)
//     socket.emit('joined', {data: "typescript connected"})
// })
//const form = document.getElementById("createLobbyForm")
const form = document.forms[0];
const lobbyNameField = document.getElementById("lobbyName");
const button = document.getElementById("gobutton");
socket.emit('lobbyListRequest');
button.onclick = () => {
    socket.emit('createLobbyRequest', { "room": form.lobbyName.value });
    console.log('lobby requested');
};
document.getElementById("refreshButton").addEventListener('click', () => socket.emit('lobbyListRequest'));
socket.on("lobbyCreated", function (data) {
    console.log("lobby created");
    let parent = document.getElementById("multiplayerdiv");
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
    let listTest = document.createElement("p");
    listTest.innerText = "list test success";
    listTest.className = "text text--red";
    parent.append(listTest);
    console.log(data);
});
socket.on("lobbyListReturn", function (data) {
    let parent = document.getElementById("lobbyList");
    removeChildElements(parent);
    const lobbies = JSON.parse(data);
    for (let lobby of lobbies) {
        let item = document.createElement("p");
        item.innerText = lobby.name;
        item.className = "text text--black lobbyList__item";
        item.dataset.id = lobby.public_id;
        item.addEventListener('click', function (lobby) {
            console.log('lobby join request' + item.dataset.id);
            socket.emit('joinLobbyRequest', { 'public_id': item.dataset.id }, (response) => {
                if (response) {
                    console.log("lobby join success");
                }
                else {
                    console.log("lobby join fail");
                }
            });
        });
        parent.append(item);
    }
    console.log("refreshed");
});
