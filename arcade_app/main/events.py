from flask_socketio import emit
from arcade_app import socketio
from flask import current_app, url_for, redirect

# @socketio.on('connect')
# def handlemessage(message):
#     print("in flask socket")
#     current_app.logger.info("in flask socket")
#     print(message)

# @socketio.on('created')
# def create_lobby(lobbyname):
#     emit('created', 'lobby name is ' + lobbyname, namespace='/test')
#     return redirect(url_for('main.multiplayer'))

@socketio.on('LOBBY-CREATED')
def success():
    print("LOBBY CREATED")



