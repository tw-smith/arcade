from flask_socketio import emit, join_room, leave_room, rooms
from arcade_app import socketio, db
from flask import current_app, url_for, redirect, make_response, jsonify
from arcade_app.models import Lobby
from flask_login import current_user
import json


@socketio.on('lobbyListRequest')
def lobby_list_request():
    lobby_list = db.session.execute(db.select(Lobby))
    packet = []
    for r in lobby_list:
        lobby = r._asdict()['Lobby'].to_dict()
        packet.append(lobby)
    socketio.emit("lobbyListReturn", json.dumps(packet))

@socketio.on('joinLobbyRequest')
def join_lobby_request(data):
    try:
        lobby = db.session.execute(db.select(Lobby).filter_by(public_id=data['public_id'])).first()
        if not lobby:
            raise TypeError("No such lobby")
        join_room(lobby[0].public_id)
        return True
    except:
        return False





    


@socketio.on('createLobbyRequest')
def success(data):
    room = data['room']
    print(room)
    

    lobby = Lobby(
        name=room,
    )

    db.session.add(lobby)
    db.session.commit()

    join_room(lobby.public_id)

    print("LOBBY CREATED")
    socketio.emit("lobbyCreated", {"lobbyname": room, "public_id": lobby.public_id}, to=lobby.public_id)

@socketio.on('disconnect')
def disconnect():
    for room in rooms():
        leave_room(room)




   # lobby = db.session.execute(db.select(Lobby).filter_by(name=room)).first()





