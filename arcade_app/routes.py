from flask import render_template, request, jsonify, Response, make_response, redirect, url_for
from arcade_app import app, db
from arcade_app.forms import LoginForm, SignupForm
from arcade_app.models import Score, User, MPUser
from arcade_app.email import send_user_validation_email
import json
from werkzeug.security import check_password_hash
from functools import wraps
from sqlalchemy import exc



@app.errorhandler(500)
def internal_error(error):
    print("http 500")
    return render_template('500.html'), 500


@app.route('/score', methods=['GET', 'POST'])
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


@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


# custom decorator for verifying token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        userFingerprint = None
        print(request.headers)

        if 'Authorization' in request.headers:
            token = MPUser.decode_token(request.headers.get('Authorization'))
            userFingerprintHash = token['userFingerprint']

        if not token:
            return make_response('Missing token!', 401, {'WWW-Authentication': 'Bearer realm="Access token required"'})

        if 'Cookie' not in request.headers:
            return make_response('No fingerprint cookie', 401, {'WWW-Authentication': 'Bearer realm="fingerprint cookie"'})
        userFingerprint = request.cookies.get('secure-fgp')

        if not userFingerprint:
            return make_response('No fingerprint', 401, {'WWW-Authentication': 'Bearer realm="Fingerprint required'})

        if not check_password_hash(userFingerprintHash, userFingerprint):
            return make_response('Invalid fingerprint', 401, {'WWW-Authentication': 'Bearer realm="fingerprint error"'})

        try:
            print(token['public_id'])
            current_user = db.session.execute(db.select(MPUser).filter_by(
                public_id=token['public_id'])).first()
            print(current_user)

        except exc.SQLAlchemyError:
            return make_response('DB Error!', 500)

        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    users = db.session.execute(db.select(User)).scalars().all()
    return make_response('OK', 201)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if request.method == 'GET':
        if 'signup' in request.args:
            if request.args['signup'] == 'success':
                return render_template('login.html', signup='success', form=form)
            if request.args['signup'] == 'exists':
                return render_template('login.html', signup='exists', form=form)
        return render_template('login.html', form=form)
    elif request.method == 'POST':
        if not form.validate_on_submit():
            return render_template('/login.html', form=form)
        username = form.username.data
        password = form.password.data

        # check that form has data we need
        if not username or not password:
            return make_response('No username or password',
                                 401,
                                 {'WWW-Authentication': 'Basic realm="No username/password supplied"'})

        # hit DB for user
        user = db.session.execute(
            db.select(MPUser).filter_by(username=username)).first()

        # TODO remove or put proper DB error catch in?
        if not user:
            return render_template('500.html'), 500

        # TODO This is messy, there must be a way to return user as a
        # useful Python object rather than this SQLalchemy thing
        for row in user:
            user = row

        # return 401 if user does not exist
        if not user:
            return make_response('No such user exists',
                                 401,
                                 {'WWW-Authenticate': 'Basic realm="User does not exist"'})

        if user.check_password(password):
            if not user.verified:
                return "<p>Not verified</p>"

            token, fingerPrintCookie = user.create_token()

            return make_response(jsonify({'token': token}),
                                 201,
                                 {'Set-Cookie': fingerPrintCookie})


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if request.method == 'GET':
        return render_template('signup.html', form=form)
    elif request.method == 'POST':
        if not form.validate_on_submit():
            return render_template('/signup.html', form=form)
        username = form.username.data
        email = form.email.data
        password = form.password.data

        # Check if username or email already exists in DB
        username_check = db.session.execute(
            db.select(MPUser).filter_by(username=username)).first()
        email_check = db.session.execute(
            db.select(MPUser).filter_by(email=email)).first()

        # If username or email already exists then throw error, otherwise create user
        if username_check or email_check:
            print('username or email already exists')
            return make_response('User already exists!', 409)
        else:
            user = MPUser(
                username=username,
                email=email,
                password=password
            )
            db.session.add(user)
            db.session.commit()
            send_user_validation_email(user)
            return render_template('verify_email.html')


@app.route('/verify/<token>', methods=['GET'])
def validate_user(token):
    user = MPUser.verify_user_verification_token(token)
    user[0].verified = True
    db.session.commit()
    return redirect(url_for('login', signup='success'))
