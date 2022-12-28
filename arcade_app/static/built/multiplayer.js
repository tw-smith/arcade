const socket = io();
// socket.on('connect', function() {
//     console.log(socket.id)
//     socket.emit('joined', {data: "typescript connected"})
// })
const form = document.getElementById("lobbyform");
const button = document.getElementById("gobutton");
button.onclick = () => {
    socket.emit('LOBBY-CREATED');
    console.log('LOBBY CREATED');
};
function createlobby() {
    socket.emit("LOBBY-CREATED");
    console.log("LOBBY CREATED");
}
socket.on('connect', function () {
    console.log(socket.id);
    console.log("connected");
});
socket.on('created', function () {
    console.log("connecting...");
});
