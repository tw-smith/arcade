from arcade_app import db, app, login
from argon2 import PasswordHasher, exceptions
import argon2
import jwt
from datetime import datetime, timedelta
import uuid
import random
import string
from flask import make_response, render_template, url_for


ph = PasswordHasher()

@login.user_loader
def load_user(public_id):
    user = db.session.execute(db.select(MPUser).filter_by(public_id=public_id)).first()
    if user:
        return user[0]
    return None

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(30))
    scores = db.relationship('Score', backref='player', lazy='dynamic')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return '<Score {}>'.format(self.user_id)


class MPUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(50), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    verified = db.Column(db.Boolean(1))

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = ph.hash(password)


        self.public_id = str(uuid.uuid4())
        self.verified = False

    # Properties & method for flask-login
    @property
    def is_active(self):
        return self.verified
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.public_id




    def create_token(self, expires_in=600):
        # Encode token
        # TODO should we be using a different crypto algo?
        token = jwt.encode({
            'iss': 'https://arcade.tw-smith.me',
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=15),
            'public_id': self.public_id,
        }, app.config['SECRET_KEY'],
            headers={
            'typ': 'JWT',
            'alg': 'HS256'
            }
        )
        return token



    @staticmethod
    def decode_token(token):
        try:
            return jwt.decode(token,
                                options={'require': ['exp', 'iss']},
                                key=app.config['SECRET_KEY'],
                                algorithms='HS256',
                                issuer='https://arcade.tw-smith.me')

        except jwt.exceptions.ExpiredSignatureError:
            raise jwt.exceptions.ExpiredSignatureError

        except jwt.exceptions.InvalidAlgorithmError:
            raise jwt.exceptions.InvalidAlgorithmError

        except jwt.exceptions.InvalidIssuedAtError:
            raise jwt.exceptions.InvalidIssuedAtError

        except jwt.exceptions.InvalidSignatureError:
           raise jwt.exceptions.InvalidSignatureError

        except jwt.exceptions.MissingRequiredClaimError:
            raise jwt.exceptions.MissingRequiredClaimError

        except jwt.exceptions.DecodeError:
            raise jwt.exceptions.DecodeError

    
    @staticmethod
    def verify_user_verification_token(token):
        try:
            public_id = MPUser.decode_token(token)
        except:
            raise
        public_id = public_id['public_id']
        return db.session.execute(db.select(MPUser).filter_by(public_id=public_id)).first()

    def set_password(self, password):
        self.password_hash = ph.hash(password)

    def check_password(self, password):
        try:
            check = ph.verify(self.password_hash, password)
        except (argon2.exceptions.VerificationError, argon2.exceptions.HashingError):
            raise

        if ph.check_needs_rehash(self.password_hash):
            self.password_hash = ph.hash(password)
            db.session.commit()

        return check




    def __repr__(self):
        return '<MP_User {}>'.format(self.username)
