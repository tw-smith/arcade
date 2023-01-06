from flask_socketio import emit, join_room, leave_room, rooms
from arcade_app import socketio, db
from flask import current_app, url_for, redirect, make_response, jsonify
from arcade_app.models import Lobby, ActiveUsers
from flask_login import current_user
import json


@socketio.on('lobbyListRequest')
def lobby_list_request():
    packet = []
    lobby_list = db.session.execute(db.select(Lobby)).scalars().all()
    for lobby in lobby_list:
        packet.append(lobby.to_dict())
    socketio.emit('lobbyListReturn', json.dumps(packet))


@socketio.on('joinLobbyRequest')
def join_lobby_request(data):
   # try:
        lobby = db.session.execute(db.select(Lobby).filter_by(public_id=data['public_id'])).first()
        if not lobby:
            raise TypeError("No such lobby")

        number_players = db.session.query(ActiveUsers).filter_by(lobby_id=data['public_id']).count()
        if number_players >= 2:
            packet = {'status': False, 'msg': 'Lobby Full'}
        

        
        join_room(lobby[0].public_id)
        packet = {'status': True, 'msg': 'Joined Lobby', 'dest': url_for('main.index')}
        return json.dumps(packet)





    


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





