from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, EmailField
from wtforms.validators import DataRequired, Length, EqualTo, Email

class HighScoreForm(FlaskForm):
    username = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Submit Score')

class CreateLobbyForm(FlaskForm):
    lobbyname = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Enter')
                                                          

