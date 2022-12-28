from flask import Blueprint

bp = Blueprint('main', __name__, template_folder='templates')

from arcade_app.main import routes, events