from flask import Flask, jsonify, request # pip install flask
from flask_mail import Mail, Message # pip install flask_mail
from pymongo import MongoClient #pip install pymogo
import connexion # pip install connexion[swagger-ui]
import random # no install
import bcrypt # pip install bcrypt
from flask_cors import CORS # pip install flas-cors
from dotenv import load_dotenv # pip install python-dotenv
import os # no install
from datetime import datetime, timedelta #pip install datetime
import string # no install

load_dotenv()


# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]
teams = db["teams"]
events = db["events"]

#sendgridtemplates
sg_account_creation = os.getenv('SG_ACCOUNT_CREATION')


def create_account():
    user = request.json

    email = user['email']
    if users.find_one({"email": email}):
        return jsonify({'message': 'Email already has an account'}), 401

    password = user['password'].encode('utf-8')
    username = email.split('@')[0]
    tempUsername = username

    #encrypt password
    salt = bcrypt.gensalt()
    hashWord = bcrypt.hashpw(password, salt)

    #generate a unique username for the user
    #user['username] so the digits don't keep adding to end on multiple iterations
    while users.find_one({'username': username}):
        username = tempUsername + str(random.randint(100, 9999))

    # insert new user into the db
    userData = {
        'email': email,
        'password': hashWord.decode('utf-8'), #store hashed pass as a string
        'username': username,
        'friends': []
    }
    users.insert_one(userData)

    # send confirmation email
    msg = Message('Account Created', recipients=[email])
    msg.html = '<p>Welcome to SportLink! Your account has successfully been created.\n\nLove,\nAlex, Ani, Arty, Allen, Yash</p>'
    mail.send(msg)

    # return complete username for frontend use and success
    return jsonify({'username': username}), 201

def login():
    req_user = request.json

    #request data
    req_email = req_user['email']
    req_password = req_user['password'].encode('utf-8')

    user = users.find_one({'email': req_email})

    # check if user exists in db
    if user:
        # re-encode it to bytes
        password = user['password'].encode('utf-8')
        if bcrypt.checkpw(req_password, password):

            # add all fields which the frontend needs here


            userData = {
                'email': user['email'],
                'username': user['username']
            }

            optional_fields = ['firstName', 'lastName', 'phoneNumber', 'friends', 'age']
            # THESE DO NOT EXIST IN EVERY PROFILE
            for field in optional_fields:
                if field in user:
                    userData[field] = user[field]

            # return each field to the user
            return jsonify(userData), 200
        else:
            return jsonify({'error': 'Invalid Password'}), 401

    else:
        return jsonify({'error': 'No email for this account!'}), 401


def google_signin():
    req_user = request.json

    email = req_user['email']
    googleId = req_user['googleId']
    firstName = req_user['firstName']
    lastName = req_user['lastName']
    
    user = users.find_one({'email': email})

    # check if they have a googleId as password,
    # or an actual password. if password, mark invalid

    if user:

        userPass = user['password']

        if userPass == googleId:
            #login to their google account
            email = user['email']
            username = user['username']

            userData = {
                'username': username
            }

            optional_fields = ['phoneNumber', 'friends']
            # THESE DO NOT EXIST IN EVERY PROFILE
            for field in optional_fields:
                if field in user:
                    userData[field] = user[field]

            return jsonify(userData), 200

        # they created an account with their email (not google)
        else:
            return jsonify({'message': 'Email already has an account'}), 401

    # create new user
    else:

        username = email.split('@')[0]
        tempUsername = username

        #generate a unique username for the user
        while users.find_one({'username': username}):
            username = tempUsername + str(random.randint(10, 9999))

        # insert new user into the db
        userData = {
            'email': email,
            'password': googleId, #store google id as their password
            'username': username,
            'firstName': firstName,
            'lastName': lastName
        }
        
        users.insert_one(userData)
        return jsonify({'username': username}), 201

def get_token():
    req = request.json     
    email = req['email']


    user = users.find_one({'email': email})

    if user:

        token = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        expire = datetime.now() + timedelta(minutes=15)

        users.update_one({"email": email}, {"$set": {"reset_code": token, "code_expiration": expire}})

        msg = Message('Password reset code', recipients=[email])
        msg.html = f'<p>Your password reset code (expires in 15 minutes) is: {token}</p>'
        mail.send(msg)

        return 200

    else:
        return jsonify({'error': 'No account with this email!'}), 401
    
def input_reset_token():
    req = request.json
    email = req['email']
    reqToken = req['reqToken']

    user = users.find_one({'email': email})
    
    if user and 'reset_code' in user and 'code_expiration' in user:
        uToken = user['reset_code']
        expire = user['code_expiration']

        if datetime.now() > expire:
            return jsonify({'error': 'Code expired!'}), 401
        
        if reqToken != uToken:
            return jsonify({'error': 'Invalid code!'}), 401
        
        return 200

    else:
        return jsonify({'error': 'Email invalid or no code generated!'}), 401
    
def change_password():

    req = request.json
    email = req['email']
    newPassword = req['password'].encode('utf-8')

    user = users.find_one({'email': email})

    if user:
        salt = bcrypt.gensalt()
        hashWord = bcrypt.hashpw(newPassword, salt)

        users.update_one(
                        {'email': email}, {"$set": {"password": hashWord.decode('utf-8')},
                                           "$unset": {"reset_code": '', "code_exipiration": ''}})
        
        
        return 200
    
    else:
        return jsonify({'error': 'Email invalid or no code generated!'}), 401

def update_user_profile():
    user = request.json
    email = user['email']
    phone_number = user['phoneNumber']
    firstName = user['firstName']
    # udpate the user's phone number in the data base
    # users.update_one({"email": email}, {"$set": {"phoneNumber": phone_number}})
    users.update_one({"email": email}, {"$set": {"firstName": firstName}})
    return jsonify({'message': 'Profile updated successfully'}), 200

def update_user_privacy():
    user = request.json
    email = user.get('email')
    display_age = user.get('displayAge')
    display_location = user.get('displayLocation')
    account_privacy = user.get('accountPrivacy')
    display_phone_number = user.get('displayPhoneNumber')

    # Update the user's privacy settings in the database
    update_query = {}
    if display_age is not None:
        update_query['displayAge'] = display_age
    if display_location is not None:
        update_query['displayLocation'] = display_location
    if account_privacy is not None:
        update_query['accountPrivacy'] = account_privacy
    if display_phone_number is not None:
        update_query['displayPhoneNumber'] = display_phone_number

    users.update_one({"email": email}, {"$set": update_query})
    return jsonify({'message': 'Privacy settings updated successfully'}), 200



def gamesUpdate():
    # Extracting data from request
    maxPlayers = request.json['maxPlayers']
    sport = request.json['sport']
    location = request.json['location']
    skill = request.json['skill']
    which = request.json['which']

    dbData = ''
    if which == 0 or which == 2:
        dbData = teams
    else:
        dbData = events

    # Inserting into MongoDB
    if location in teams:
        # If location exists, append
        teams.update_one({'_id': location}, {'$push': {'data': {
            'maxPlayers': maxPlayers,
            'sport': sport,
            'skill': skill,
            'which': which
        }}})
    else:
        # If location doesn't exist, create a new entry
        teams.insert_one({'_id': location, 'data': [{
            'maxPlayers': maxPlayers,
            'sport': sport,
            'skill': skill,
            'which': which
        }]})

        return jsonify({"message": "Team successfully created"}), 200

def add_friend():
    req = request.json
    email = req['email']
    friend = req['friend']

    user = users.find_one({'email': email})
    # friend = users.find_one({'username': friend})

    if user and friend:
        if friend in user['friends']:
            return jsonify({'error': 'Friend already added!'}), 401

        users.update_one({"email": email}, {"$push": {"friends": friend}})
        return 200

    else:
        return jsonify({'error': 'Username invalid!'}), 401

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


if __name__ == '__main__':
    app.run(port=5000)
