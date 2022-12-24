from arcade_app import db, app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import uuid
import random
import string
from flask import make_response

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
        self.password_hash = generate_password_hash(password)
        self.public_id = str(uuid.uuid4())
        self.verified = False




    def create_token(self, expires_in=600):
        # TODO is the fingerprint ok as random string or does it need to be random hex?
        userFingerprint = ''.join(
        random.choices(string.ascii_letters, k=50))
        fingerPrintCookie = 'secure-fgp=' + userFingerprint + \
        "; SameSite=Strict; HttpOnly; Secure"

    # Create hash of fingerprint
    # TODO is this hashing algo sufficient
        userFingerprintHash = generate_password_hash(userFingerprint, 'SHA256')

        # Encode token
        # TODO should we be using a different crypto algo?
        token = jwt.encode({
            'iss': 'https://arcade.tw-smith.me',
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=15),
            'public_id': self.public_id,
            'userFingerprint': userFingerprintHash,
        }, app.config['SECRET_KEY'],
            headers={
            'typ': 'JWT',
            'alg': 'HS256'
            }
        )
        return token, fingerPrintCookie




    # def get_user_verification_token(self, expires_in=600):
    #     return jwt.encode({
    #             'iss': 'https://arcade.tw-smith.me',
    #             'iat': datetime.utcnow(),
    #             'exp': datetime.utcnow() + timedelta(seconds=expires_in),
    #             'public_id': self.public_id,
    #         }, app.config['SECRET_KEY'],
    #             headers={
    #             'typ': 'JWT',
    #             'alg': 'HS256'
    #         }
    #     )




    @staticmethod
    def decode_token(token):
        try:
            return jwt.decode(token,
                                options={'require': ['exp', 'iss']},
                                key=app.config['SECRET_KEY'],
                                algorithms='HS256',
                                issuer='https://arcade.tw-smith.me')

        except jwt.exceptions.ExpiredSignatureError:
            return make_response('Token has expired', 401, {'WWW-Authentication': 'Bearer realm="Expired token"'})
        except jwt.exceptions.InvalidAlgorithmError:
            return make_response('Invalid algorithm', 401, {'WWW-Authentication': 'Bearer realm="Invalid algorithm'})
        except jwt.exceptions.InvalidIssuedAtError:
            return make_response('Invalid issuer', 401, {'WWW-Authentication': 'Bearer realm="Invalid issuer'})
        except jwt.exceptions.InvalidSignatureError:
            return make_response('Invalid signature', 401, {'WWW-Authentication': 'Bearer realm="Invalid signature"'})
        except jwt.exceptions.MissingRequiredClaimError:
            return make_response('Missing claim', 401, {'WWW-Authentication': 'Bearer realm="missing claim"'})
        except jwt.exceptions.DecodeError:
            return make_response('JWT decode error', 401, {'WWW-Authentication': 'Bearer realm="JWT decode error"'})

    
    @staticmethod
    def verify_user_verification_token(token):
        # try:
        #     id = jwt.decode(token,
        #                     options={'require': ['exp', 'iss']},
        #                     key=app.config['SECRET_KEY'],
        #                     algorithms='HS256',
        #                     issuer='https://arcade.tw-smith.me')['public_id']
        # except:
        #     return
        public_id = MPUser.decode_token(token)['public_id']
        print(public_id)
        return db.session.execute(db.select(MPUser).filter_by(public_id=public_id)).first()

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<MP_User {}>'.format(self.username)
