from flask_mail import Message
from flask import render_template
from arcade_app import mail, app

def send_email(subject, sender, recipients, text_body, html_body):
    msg = Message(subject=subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    print(msg.body)
    #mail.send(msg)

def send_user_validation_email(user):
    token, _ = user.create_token()
    send_email('Snake: Verify your email',
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=[user.email],
                text_body=render_template('email/user_validation.txt', user=user, token=token),
                html_body=render_template('email/user_validation.html', user=user, token=token))

def send_password_reset_email(user):
    token, _ = user.create_token()
    send_email('Snake: Password reset',
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=[user.email],
                text_body=render_template('email/password_reset.txt', user=user, token=token),
                html_body=render_template('email/password_reset.html', user=user, token=token))
