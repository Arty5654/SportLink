from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from pymongo import MongoClient
import connexion
import random
import bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()


# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]

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
        'username': username
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

            optional_fields = ['firstName', 'lastName', 'phoneNumber', 'friends']
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
                    print(user[field])
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
       

def update_user_profile():
    user = request.json
    email = user['email']
    phone_number = user['phoneNumber']
    # udpate the user's phone number in the data base
    users.update_one({"email": email}, {"$set": {"phoneNumber": phone_number}})
    return jsonify({'message': 'Profile updated successfully'}), 200







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
