from flask import render_template, request, Response, redirect, url_for, flash
from arcade_app import db
from arcade_app.auth import bp
from arcade_app.auth.forms import LoginForm, SignupForm, PasswordResetRequestForm, PasswordResetForm
from arcade_app.models import Score, MPUser
from arcade_app.auth.email import send_user_validation_email, send_password_reset_email
import json
from werkzeug.urls import url_parse
from flask_login import login_user, logout_user, login_required, current_user



@bp.route('/login', methods=['GET', 'POST'])
def login(message=None):
    if current_user.is_authenticated:
        return redirect(url_for('main.game_menu'))
    form = LoginForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            user = db.session.execute(db.select(MPUser).filter_by(username=form.username.data)).first()
            if not user or not user[0].check_password(form.password.data):
                flash('Invalid username or password!')
                return redirect(url_for('auth.login'))
            user = user[0]
            login_user(user)
            # get next from query string if we were redirected here by loginrequired
            redirect_to = request.args.get('next')
            if not redirect_to or url_parse(redirect_to).netloc != '':
                redirect_to = url_for('main.game_menu')
            return redirect(redirect_to)
    return render_template('login.html', title='Sign In', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if request.method == 'POST':
        if form.validate_on_submit():
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
                return redirect(url_for('auth.login'))
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
    return render_template('signup.html', title='Sign Up', form=form)


@bp.route('/verify/<token>', methods=['GET'])
def validate_user(token):
    try:
        user = MPUser.verify_user_verification_token(token)
    except:
        flash("Verification error. Please try again")
        return redirect(url_for('auth.signup'))
    user[0].verified = True
    db.session.commit()
    flash("Signup successful! Please log in.")
    return redirect(url_for('auth.login'))



@bp.route('/requestresetpassword', methods=['GET', 'POST'])
def request_password_reset():
    form = PasswordResetRequestForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            user = db.session.execute(db.select(MPUser).filter_by(email=form.email.data)).first()
            if user:
                user = user[0]
                send_password_reset_email(user)
                flash("Password reset link sent if this account exists")
                return redirect(url_for('auth.login'))
    if request.method == 'GET':
        return render_template('requestresetpassword.html', title='Reset Password', form=form)            


@bp.route('/resetpassword/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        user = MPUser.verify_user_verification_token(token)
    except:
        flash("Password reset error. Please try again")
        return redirect(url_for('auth.request_password_reset'))

    form = PasswordResetForm()
    if form.validate_on_submit():
        user[0].set_password(form.password.data)
        db.session.commit()
        flash("Password reset. Please log in")
        return redirect(url_for('auth.login'))

    return render_template('resetpassword.html', form=form)