from flask import Flask, jsonify, request
from pymongo import MongoClient
import connexion
import random
import bcrypt

#app = Flask(__name__)


MONGO_URI="mongodb+srv://group21:turkstra@sportlinkcluster.tjcbtxj.mongodb.net/?retryWrites=true&w=majority"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]
from flask_cors import CORS


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
    while users.find_one({username: username}):
        username = user['username'] + str(random.randint(100, 9999))

    # insert new user into the db
    userData = {
        'email': email,
        'password': hashWord.decode('utf-8'), #store hashed pass as a string
        'username': username
    }
    users.insert_one(userData)

    # return complete username for frontend use and success
    return jsonify({'username': username}), 201


app = connexion.App(__name__, specification_dir='.')
CORS(app.app)
app.add_api('swagger.yaml')


if __name__ == '__main__':
    app.run(port=5000)
