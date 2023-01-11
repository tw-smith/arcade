from flask import render_template, flash, redirect, url_for, session, request
from flask_login import current_user
from arcade_app.game import bp
from arcade_app import db
from arcade_app.models import Lobby, ActiveUsers
from flask_login import login_required




@bp.route('/singleplayer', methods=['GET'])
@login_required
def singleplayer():
    return render_template('singleplayer.html')


@bp.route('/multiplayer/lobby/', methods=['GET'])
@login_required
def multiplayer_lobby():
    session['lobby_id'] = request.args.get('lobby_id')
    if request.args.get('is_host') == 'True':
        is_host = True
    else:
        is_host = False
    #lobby = db.session.execute(db.select(Lobby).filter_by(public_id=session.get('lobby_id'))).first()
    lobby = db.session.execute(db.select(Lobby).filter_by(public_id=session.get('lobby_id'))).scalars().first()
    print(type(lobby.active_user.first()))
    if not lobby:
        flash('No such lobby exists!')
        return redirect(url_for('main.matchmake'))
    #number_players = db.session.query(ActiveUsers).filter_by(lobby_id=session.get('lobby_id')).count()
    players = db.session.execute(db.select(ActiveUsers).filter_by(lobby_id=session.get('lobby_id'))).scalars().all()
    number_players = len(players)
    print(number_players)
    if number_players >= 2:
        flash('Lobby full!')
        return redirect(url_for('main.matchmake'))
    if is_host:
        for player in players:
            if player.is_host:
                flash('This lobby already has a host!')
                return redirect(url_for('main.matchmake'))
    new_active_user = ActiveUsers(player_id=current_user.username, lobby_id=session.get('lobby_id'), is_host=is_host)
    db.session.add(new_active_user)
    db.session.commit()
    return render_template('lobby.html')
    

