from flask import Blueprint

bp = Blueprint('game', __name__, template_folder='templates')

from arcade_app.game import routes, events
