from flask import render_template
from arcade_app.game import bp
from flask_login import login_required




@bp.route('/singleplayer', methods=['GET'])
@login_required
def singleplayer():
    return render_template('singleplayer.html')

@bp.route('/multiplayer', methods=['GET'])
@login_required
def multiplayer():
    #lobbies = socketio.rooms.keys()
    return render_template('multiplayer.html')