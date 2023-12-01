from flask import Flask, jsonify, request # pip install flask
from flask_mail import Mail, Message # pip install flask_mail
from dotenv import load_dotenv # pip install python-dotenv
from pymongo import MongoClient #pip install pymogo
import connexion # pip install connexion[swagger-ui]
from flask_cors import CORS # pip install flas-cors
import json
import os
from bson.objectid import ObjectId

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

def create_a_team(team_name, team_leader, teammates, size, maxSize, privacy):
    team_data = {
        'name': team_name,
        'leader': team_leader,
        'members': teammates,
        'size': size,
        'maxSize': maxSize,
        'public': privacy
    }

    # check if team name is already taken
    if teams.find_one({'name': team_name}):
        return jsonify({"message": "Team name already taken!"}), 401

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

    # find all teams that the user is a member or leader of
    for team in teams.find({'members': curr_email}):
        team_list.append({
            'name': team['name'],
            'leader': team['leader'],
            'members': team['members']
        })

    for team in teams.find({'leader': curr_email}):
        team_list.append({
            'name': team['name'],
            'leader': team['leader'],
            'members': team['members']
        })

    # change all emails to username
    for team in team_list:
        team['leader'] = users.find_one({'email': team['leader']})['username']
        for i in range(len(team['members'])):
            team['members'][i] = users.find_one({'email': team['members'][i]})['username']

    return team_list

def leave_a_team(curr_email, team_name, new_leader):
    # remove user from team, decrement team size
    teams.update_one({'name': team_name}, {'$pull': {'members': curr_email}})
    teams.update_one({'name': team_name}, {'$inc': {'size': -1}})

    # check if the user is the team leader
    if teams.find_one({'name': team_name})['leader'] == curr_email:
        # if new_leader is not provided, delete team
        if not new_leader:
            teams.delete_one({'name': team_name})
        else:
            # new leader is given as a username, so convert to email
            new_leader = users.find_one({'username': new_leader})['email']
            teams.update_one({'name': team_name}, {'$set': {'leader': new_leader}})
            # remove new leader from members list
            teams.update_one({'name': team_name}, {'$pull': {'members': new_leader}})

            # send email to new leader, if they want emails
            if users.find_one({'email': new_leader, 'sendEmail': True}):
                msg = Message('You are now the leader of a team!', recipients=[new_leader])
                msg.html = f'<p>Hello! You\'ve been made the leader of a team! Sign in to SportLink to check it out!</p>'
                mail.send(msg)

    return jsonify({"message": "Team Left!"}), 200

# TODO: SWAGGER FILE AND FRONT END
def change_name(team_name):
    # check if team name is already taken
    if teams.find_one({'name': team_name}):
        return jsonify({"message": "Team name already taken!"}), 401

    # change team name
    teams.update_one({'name': team_name}, {'$set': {'name': request.json['new_name']}})

    return jsonify({"message": "Team Name Changed!"}), 200

def get_pub_teams():
    # get all public teams
    team_list = []

    # append all public teams to the list
    # will need to add a check for if the teams are full
    # if a team is full dont display it
    for team in teams.find({'public': True}):
        team_list.append({
            'name': team['name'],
            'leader': team['leader'],
            'members': team['members'],
            'size': team['size'],
            'maxSize': team['maxSize'],
            '_id': str(team['_id'])
        })

    # change all emails to usernames
    for team in team_list:
        team['leader'] = users.find_one({'email': team['leader']})['username']
        for i in range(len(team['members'])):
            team['members'][i] = users.find_one({'email': team['members'][i]})['username']

    return team_list

def join_team(req):

    team_id = req['_id']


    teams.update_one(
        {"_id": ObjectId(team_id)},
        {"$addToSet": {"members": req['user']}}  # Use $addToSet to avoid duplicate entries
    )
    teams.update_one({"_id": ObjectId(team_id)}, {'$set': {'size': req['num']}})

    print("Done!")

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
