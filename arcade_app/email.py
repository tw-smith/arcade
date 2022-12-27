from flask_mail import Message
from arcade_app import mail

def send_email(subject, sender, recipients, text_body, html_body):
    msg = Message(subject=subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    print(msg.body)
    #mail.send(msg)