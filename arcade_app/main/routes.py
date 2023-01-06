from flask import render_template, request, jsonify, Response, redirect, url_for, make_response, current_app, flash
from arcade_app import db, socketio
from arcade_app.main import bp
from arcade_app.models import Score, MPUser, Lobby
import json
from flask_login import login_required, current_user
from arcade_app.main.forms import CreateLobbyForm

@bp.after_request #TODO do we need to add this to all other routes files?
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = "frame-ancestors: 'deny'"
    response.headers['Strict-Transport-Security'] = "max-age=31536000; includeSubDomains; preload"
    return response


# @bp.route('/score', methods=['GET', 'POST'])
# def score_handler():
#     if request.method == 'POST':
#         content = request.json
#         # Check if player already exists
#         player_exists = db.session.execute(db.select(User).filter_by(
#             user_name=content['username'])).scalars().all()
#         if player_exists:
#             for row in player_exists:
#                 player_id = row.id
#             s = Score(user_id=player_id, score=content['score'])
#             db.session.add(s)
#             db.session.commit()

#         else:
#             u = User(user_name=content['username'])
#             db.session.add(u)
#             db.session.flush()
#             s = Score(user_id=u.id, score=content['score'])
#             db.session.add(s)
#             db.session.commit()

#         return Response(status=201)
#     elif request.method == 'GET':
#         high_scores = db.session.execute(db.select(Score.id, Score.score, User.user_name).join(
#             User).order_by(Score.score.desc()).limit(10))
#         output = [dict(row) for row in high_scores]
#         output = jsonify(output)
#         return output, 200


@bp.route('/', methods=['GET'])
@bp.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


@bp.route('/menu', methods=['GET'])
@login_required
def game_menu():
    return render_template('menu.html')



@bp.route('/matchmake', methods=['GET','POST'])
@login_required
def matchmake():
    form = CreateLobbyForm()
    lobbies = db.session.execute(db.select(Lobby)).scalars().all()
    if form.validate_on_submit():
        for lobby in lobbies:
            if lobby.name == form.lobby_name.data:
                flash("A lobby with that name already exists!")
                return render_template('matchmake.html', form=form, lobbies=lobbies)
        new_lobby = Lobby(name=form.lobby_name.data)
        db.session.add(new_lobby)
        db.session.commit()
        return redirect(url_for('game.multiplayer_lobby', lobby_id=form.lobby_name.data ))
    return render_template('matchmake.html', form=form, lobbies=lobbies)






@bp.route('/gameover', methods=['GET'])
@login_required
def gameover():
    return render_template('gameover.html')

@bp.route('/highscores', methods=['GET', 'POST'])
@login_required
def highscores():
    if request.method == 'GET':
        high_scores = db.session.execute(db.select(Score.id, Score.score, MPUser.username).join(
                                        MPUser).order_by(Score.score.desc()).limit(10))
        scores = [dict(row) for row in high_scores]
        return render_template('highscores.html', scores=scores)


    if request.method == 'POST':
        content = request.json
        print(current_user.id)
        s = Score(user_id=current_user.id, score=content['score'])
        db.session.add(s)
        db.session.commit()

        return redirect(url_for('main.highscores'))








