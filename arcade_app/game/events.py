from flask_socketio import emit, join_room, leave_room, rooms, close_room
from arcade_app import socketio, db
from flask import current_app, url_for, redirect, make_response, jsonify, session
from arcade_app.models import Lobby, ActiveUsers
from flask_login import current_user
import json

# connect
# disconnect
# get player list
# ready up

#TODO are all these emits going to all clients? Do we need to emit to room = request.sid or something?
# emit goes to the sender, socketio.emit is broadcast unless to put a "to" argument in

def disconnect_user(disconnection_type):
    try: #TODO improve this error handling
        leave_room(session.get('lobby_id'))
        active_user = db.session.execute(db.select(ActiveUsers).filter_by(player_id=current_user.username)).scalars().first()
        db.session.delete(active_user)
        db.session.commit()
        get_player_list(session.get('lobby_id'))
         # TODO should this go into a class method? But then how do we deal with the session.get bit?
        number_players = db.session.query(ActiveUsers).filter_by(lobby_id=session.get('lobby_id')).count()
        if number_players == 0:
            close_room(session.get('lobby_id'))
        if disconnection_type == "soft":
            emit('redirect', url_for('main.matchmake'))
            socketio.disconnect()
    except:
        return False

def get_player_list(lobby_id):
    players = []
    for player in db.session.execute(db.select(ActiveUsers).filter_by(lobby_id=lobby_id)).scalars().all():
        players.append({'id': player.id, 'name': player.player_id, 'ready': player.ready})
    socketio.emit('refreshPlayerList', json.dumps(players), to=lobby_id)



@socketio.on('connect')
def join_lobby():
    join_room(session.get('lobby_id'))
    get_player_list(session.get('lobby_id'))

@socketio.on('disconnect')
def disconnect():
    disconnect_user(disconnection_type='soft')
    

@socketio.on('createLobbyRequest')
def create_lobby_request(data):
    room = data['room']

    lobby = Lobby(
        name=room,
    )

    db.session.add(lobby)
    db.session.commit()
    join_room(lobby.public_id)
    socketio.emit("lobbyCreated", {"lobbyname": room, "public_id": lobby.public_id}, to=lobby.public_id)

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

@socketio.on('leaveLobbyRequest')
def leave_lobby_request():
    disconnect_user(disconnection_type='soft')

@socketio.on('playerReadyToggle')
def player_ready_toggle():
     active_user = db.session.execute(db.select(ActiveUsers).filter_by(player_id=current_user.username)).scalars().first()
     active_user.ready = not active_user.ready
     db.session.commit()
     get_player_list(session.get('lobby_id'))











