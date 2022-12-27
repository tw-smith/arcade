from flask import render_template, request, jsonify, Response
from arcade_app import app, db
from arcade_app.main import bp
from arcade_app.models import Score, User
import json
from flask_login import login_required

@bp.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = "frame-ancestors: 'deny'"
    response.headers['Strict-Transport-Security'] = "max-age=31536000; includeSubDomains; preload"
    return response


@bp.route('/score', methods=['GET', 'POST'])
def score_handler():
    if request.method == 'POST':
        content = request.json
        # Check if player already exists
        player_exists = db.session.execute(db.select(User).filter_by(
            user_name=content['username'])).scalars().all()
        if player_exists:
            for row in player_exists:
                player_id = row.id
            s = Score(user_id=player_id, score=content['score'])
            db.session.add(s)
            db.session.commit()

        else:
            print("player does not exist")
            u = User(user_name=content['username'])
            db.session.add(u)
            db.session.flush()
            s = Score(user_id=u.id, score=content['score'])
            db.session.add(s)
            db.session.commit()

        return Response(status=201)
    elif request.method == 'GET':
        high_scores = db.session.execute(db.select(Score.id, Score.score, User.user_name).join(
            User).order_by(Score.score.desc()).limit(10))
        output = [dict(row) for row in high_scores]
        output = jsonify(output)
        print(output)
        return output, 200


@bp.route('/', methods=['GET'])
@bp.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


@bp.route('/menu', methods=['GET'])
@login_required
def game_menu():
    return render_template('menu.html')










