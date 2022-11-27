import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db/arcade_app_dev.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '***REMOVED***'
