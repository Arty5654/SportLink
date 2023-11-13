from flask import Flask, jsonify, request # pip install flask
from flask_mail import Mail, Message # pip install flask_mail
from dotenv import load_dotenv # pip install python-dotenv
from pymongo import MongoClient #pip install pymogo
import connexion # pip install connexion[swagger-ui]
from flask_cors import CORS # pip install flas-cors
import json
import os

load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]
teams = db["teams"]
events = db["events"]
friends = db["friends"]
stats = db["stats"]
history = db["eventHistory"]

def create_a_team(team_name, team_leader, teammates):
    team_data = {
        'name': team_name,
        'leader': team_leader,
        'members': teammates
    }

    # send emails to teammates, if they want emails
    for teammate in teammates:
        if users.find_one({'email': teammate, 'sendEmail': False}):
            continue
        msg = Message('You have been invited to a team!', recipients=[teammate])
        msg.html = f'<p>Hello! You\'ve been added to a team! Sign in to SportLink to check it out!</p>'
        mail.send(msg)

    teams.insert_one(team_data)

    return jsonify({"message": "Team Created!"}), 200

def get_users_teams(curr_email):
    # get all teams that the user is a part of
    team_list = []

    for team in teams.find({'members': curr_email}):
        team_list.append({
            'name': team['name'],
            'leader': team['leader'],
            'members': team['members']
        })

    # also find teams that the user is the leader of
    for team in teams.find({'leader': curr_email}):
        team_list.append({
            'name': team['name'],
            'leader': team['leader'],
            'members': team['members']
        })

    return team_list


app = connexion.App(__name__, specification_dir='.')
CORS(app.app)
app.add_api('swagger.yaml')

flask_app = app.app

#email sending information
key = os.getenv("SG_API_KEY")
sender = os.getenv("MAIL_SENDER")


flask_app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
flask_app.config['MAIL_PORT'] = 587
flask_app.config['MAIL_USE_TLS'] = True
flask_app.config['MAIL_USERNAME'] = 'apikey'
flask_app.config['MAIL_PASSWORD'] = key
flask_app.config['MAIL_DEFAULT_SENDER'] = sender
mail = Mail(flask_app)
