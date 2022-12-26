from flask import render_template, request, jsonify, Response, make_response, redirect, url_for, flash
from arcade_app import app, db
from arcade_app.forms import LoginForm, SignupForm, PasswordResetRequestForm, PasswordResetForm
from arcade_app.models import Score, User, MPUser
from arcade_app.email import send_user_validation_email, send_password_reset_email
import json
from werkzeug.security import check_password_hash
from werkzeug.urls import url_parse
from functools import wraps
from sqlalchemy import exc
from flask_login import current_user, login_user, logout_user, login_required



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


@app.route('/menu', methods=['GET'])
@login_required
def game_menu():
    return render_template('menu.html')


@app.route('/login', methods=['GET', 'POST'])
def login(message=None):
    form = LoginForm()
    if request.method == 'GET':
        return render_template('login.html', title='Sign In', form=form)
    if request.method == 'POST':
        if form.validate_on_submit():
            user = db.session.execute(db.select(MPUser).filter_by(username=form.username.data)).first()
            if not user or not user[0].check_password(form.password.data):
                flash('Invalid username or password!')
                return redirect(url_for('login'))
            user = user[0]
            login_user(user)
            # get next from query string if we were redirected here by loginrequired
            redirect_to = request.args.get('next')
            if not redirect_to or url_parse(redirect_to).netloc != '':
                redirect_to = url_for('index')
            return redirect(redirect_to)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


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
            flash('Username or email already exists!')
            return redirect(url_for('login'))
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
    try:
        user = MPUser.verify_user_verification_token(token)
    except:
        flash("Verification error. Please try again")
        return redirect(url_for('signup'))
        #return make_response(render_template('signup.html'), 401, {'WWW-Authentication': 'Bearer realm="Site access"'})
    user[0].verified = True
    db.session.commit()
    flash("Signup successful! Please log in.")
    return redirect(url_for('login'))



@app.route('/requestresetpassword', methods=['GET', 'POST'])
def request_password_reset():
    form = PasswordResetRequestForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            user = db.session.execute(db.select(MPUser).filter_by(email=form.email.data)).first()
            if user:
                user = user[0]
                send_password_reset_email(user)
                flash("Password reset link sent if this account exists")
                return redirect(url_for('login'))
    if request.method == 'GET':
        return render_template('requestresetpassword.html', title='Reset Password', form=form)            


@app.route('/resetpassword/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        user = MPUser.verify_user_verification_token(token)
    except:
        flash("Password reset error. Please try again")
        return redirect(url_for('request_password_reset'))
        #return make_response(render_template(url_for('index')), 401, {'WWW-Authentication': 'Bearer realm="Site access"'})

    form = PasswordResetForm()
    if form.validate_on_submit():
        user[0].set_password(form.password.data)
        db.session.commit()
        flash("Password reset. Please log in")
        return redirect(url_for('login'))

    return render_template('resetpassword.html', form=form)








