from flask_socketio import emit, join_room, leave_room, rooms
from arcade_app import socketio, db
from flask import current_app, url_for, redirect, make_response, jsonify
from arcade_app.models import Lobby
from flask_login import current_user
import json


# @socketio.on('connect')
# def handlemessage(message):
#     print("in flask socket")
#     current_app.logger.info("in flask socket")
#     print(message)

# @socketio.on('created')
# def create_lobby(lobbyname):
#     emit('created', 'lobby name is ' + lobbyname, namespace='/test')
#     return redirect(url_for('main.multiplayer'))


@socketio.on('lobbyListRequest')
def lobby_list_request():
    lobby_list = db.session.execute(db.select(Lobby))
    packet = []
    for r in lobby_list:
        lobby = r._asdict()['Lobby'].to_dict()
        packet.append(lobby)

    #print(json.dumps(packet))
    #result_as_dict = (lobby_list.mappings().all())

    socketio.emit("lobbyListReturn", json.dumps(packet))
    # packet = []
    # for lobby in result_as_dict:
    #     tmp = lobby['Lobby']
    #     print(tmp.name)
    #     #print(lobby.name)
    #     packet.append(tmp.name)
    # print(jsonify(packet))
    


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





