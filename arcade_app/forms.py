from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, EmailField
from wtforms.validators import DataRequired, Length, EqualTo, Email

class HighScoreForm(FlaskForm):
    username = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Submit Score')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class SignupForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8), EqualTo('repeat_password')])
    repeat_password = PasswordField('Repeat Password', validators=[DataRequired(), Length(min=8)])
    submit = SubmitField('Sign Up')
