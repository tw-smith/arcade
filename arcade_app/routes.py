from flask import render_template, request, jsonify, Response, make_response
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
   # "username": "Test User"
   # "email": "test@tw-smith.me"
   # "password": "testpassword"





# custom decorator for verifying token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        
        if not token:
            return make_response('Missing token!',
                                  401,
                                  {'WWW-Authentication': 'Bearer realm="Valid access token required"'})

        try:
            data = jwt.decode(token, key=app.config['SECRET_KEY'], algorithms='HSA256')
            current_user = db.session.execute(db.select(MPUser).filter_by(user_name = data['user_name']).first())

        except:
            return make_response('Token is invalid!',
                                 401,
                                 {'WWW-Authentication': 'Bearer realm="Valid access token required"'})
        
        return f(current_user, *args, **kwargs)
    return decorated

        



@app.route('/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    users = db.session.execute(db.select(User)).scalars().all()
    print(users)


@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        # get form values from JSON
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # check that form has data we need
        if not username or not password:
            #return jsonify({'Message': 'No username or password'}), 401
            return make_response('No username or password',
                                401,
                                {'WWW-Authentication':'Basic realm="No username/password supplied"'})

        # hit DB for user
        user = db.session.execute(db.select(MPUser).filter_by(username=username)).first()

        # This is messy, there must be a way to return user as a useful Python object rather than this SQLalchemy thing
        for row in user:
            pw = row.password_hash
            public_id = row.public_id

        
        # return 401 if user does not exist
        if not user:
            return make_response('No such user exists',
                                  401,
                                  {'WWW-Authenticate' : 'Basic realm="User does not exist"'})

        # check password hash
        if check_password_hash(pw, password):
            jwt_token = jwt.encode({
                'public_id': public_id,
                # TODO put token expiry time in
            }, app.config['SECRET_KEY'])
            return make_response(jsonify({'token': jwt_token}), 201)




        



    



@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')
    elif request.method == 'POST':

        # Get form values from json
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        # Check if username or email already exists in DB
        username_check = db.session.execute(db.select(MPUser).filter_by(username = username)).first()
        email_check = db.session.execute(db.select(MPUser).filter_by(email = email)).first()
        
        # If username or email already exists then throw error, otherwise create user
        if username_check or email_check:
            print('username or email already exists')
            return make_response('User already exists!', 409)
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
            return make_response('User registration sucessfull', 201)
            





