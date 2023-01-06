from flask_socketio import emit, join_room, leave_room, rooms
from arcade_app import socketio, db
from flask import current_app, url_for, redirect, make_response, jsonify, session
from arcade_app.models import Lobby, ActiveUsers
from flask_login import current_user
import json




@socketio.on('connect')
def join_lobby():
    join_room(session.get('lobby_id'))
    refresh_player_list(session.get('lobby_id'))
    print(type(current_user))

@socketio.on('disconnect')
def leave_lobby():
    leave_room(session.get('lobby_id'))
    print("disconnect event")
    active_user = db.session.execute(db.select(ActiveUsers).filter_by(player_id=current_user.username)).first()
    print(active_user)
    db.session.delete(active_user)
    db.session.commit()


    
    



def refresh_player_list(lobby_id):
    players = []
    for player in db.session.execute(db.select(ActiveUsers).filter_by(lobby_id=lobby_id)).scalars().all():
        players.append({'id': player.id, 'name': player.player_id})
    socketio.emit('refreshPlayerList', json.dumps(players), to=lobby_id)
    








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





