from flask import render_template
from arcade_app import app
from arcade_app.email import send_email

def send_user_validation_email(user):
    token = user.create_token()
    send_email('Snake: Verify your email',
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=[user.email],
                text_body=render_template('email/user_validation.txt', user=user, token=token),
                html_body=render_template('email/user_validation.html', user=user, token=token))

def send_password_reset_email(user):
    token = user.create_token()
    send_email('Snake: Password reset',
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=[user.email],
                text_body=render_template('email/password_reset.txt', user=user, token=token),
                html_body=render_template('email/password_reset.html', user=user, token=token))
