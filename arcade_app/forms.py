from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class HighScoreForm(FlaskForm):
    username = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Submit Score')
