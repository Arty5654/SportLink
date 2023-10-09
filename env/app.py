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
    username = user['username']

    #encrypt password
    salt = bcrypt.gensalt()
    hashWord = bcrypt.hashpw(password, salt)

    #generate a unique username for the user
    #user['username] so the digits don't keep adding to end on multiple iterations
    while users.find_one({'username': username}):
        username = user['username'] + str(random.randint(100, 9999))

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






app = connexion.App(__name__, specification_dir='.')
CORS(app.app)
app.add_api('swagger.yaml')

flask_app = app.app

#email sending information
flask_app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
flask_app.config['MAIL_PORT'] = 587
flask_app.config['MAIL_USE_TLS'] = True
flask_app.config['MAIL_USERNAME'] = 'apikey'
flask_app.config['MAIL_PASSWORD'] = os.getenv('SG_API_KEY')
flask_app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_SENDER')
mail = Mail(flask_app)


if __name__ == '__main__':
    app.run(port=5000)
