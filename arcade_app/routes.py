from flask import render_template, request, jsonify, Response
from arcade_app import app, db
from arcade_app.models import Score, User, MPUser
from arcade_app.forms import HighScoreForm
import json
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

from functools import wraps


@app.route('/score', methods=['GET','POST'])
def score_handler():
    if request.method == 'POST':
        content = request.json
        # Check if player already exists
        player_exists = db.session.execute(db.select(User).filter_by(user_name=content['username'])).scalars().all()
        if player_exists:
            for row in player_exists:
                player_id = row.id
            s = Score(user_id = player_id, score = content['score'])
            db.session.add(s)
            db.session.commit()
            


        else:
            print("player does not exist")
            u = User(user_name=content['username'])
            db.session.add(u)
            db.session.flush()
            s = Score(user_id=u.id, score = content['score'])
            db.session.add(s)
            db.session.commit()

        return Response(status=201)
    elif request.method == 'GET':
        high_scores = db.session.execute(db.select(Score.id, Score.score, User.user_name).join(User).order_by(Score.score.desc()).limit(10))
        output = [dict(row) for row in high_scores]
        output = jsonify(output)
        print(output)
        return output, 200



@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


# AUTH SECTION

# custom decorator for verifying token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = db.session.execute(db.select(MPUser).filter_by(user_name = data['user_name']).first())

        except:
            return jsonify({'Message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

        



@app.route('/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    users = db.session.execute(db.select(User)).scalars().all()
    print(users)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')
    elif request.method == 'POST':
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        username_check = db.session.execute(db.select(MPUser).filter_by(username = username)).first()
        email_check = db.session.execute(db.select(MPUser).filter_by(email = email)).first()
        if username_check or email_check:
            print('username or email already exists')
            return('username or email already exits!')
        else:
            user = MPUser(
                username = username,
                email = email,
                public_id = str(uuid.uuid4()),
                password_hash = generate_password_hash(password)
            )
            db.session.add(user)
            db.session.commit()
            print('sign up ok')
            return('signed up sucessefully!')
            





