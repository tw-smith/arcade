from arcade_app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_name = db.Column(db.String(30))
    scores = db.relationship('Score', backref='player', lazy='dynamic')
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Score(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    score = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return '<Score {}>'.format(self.user_id)
