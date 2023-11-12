from flask import Flask, jsonify, request # pip install flask
from flask_mail import Mail, Message # pip install flask_mail
from dotenv import load_dotenv # pip install python-dotenv
from pymongo import MongoClient #pip install pymogo
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

def send_request(email, friend_email):
    # check if friend exists
    if not users.find_one({'email': friend_email}):
        return jsonify({'message': 'Friend does not exist!'}), 404

    # check if friend request already exists
    if friends.find_one({'user': email, 'friend': friend_email, 'status': 'pending'}):
        return jsonify({'message': 'There is already a request pending between you and this user!'}), 409
    elif friends.find_one({'user': friend_email, 'friend': email, 'status': 'pending'}):
        return jsonify({'message': 'There is already a request pending between you and this user!'}), 409

    # check if already friends
    if friends.find_one({'user': email, 'friend': friend_email, 'status': 'friends'}):
        return jsonify({'message': 'Already Friends!'}), 409

    # setup request data
    requestData = {
        'user': email,
        'friend': friend_email,
        'status': 'pending'
    }

    # insert friend request into db
    friends.insert_one(requestData)

    # send email to friend
    print(f"Want to send email to {friend_email}, from {email}")

    # check if friend doesnt have sendEmails set to False
    if users.find_one({'email': friend_email, 'sendEmail': False}):
        print("no email to this user")
        return jsonify({"message": "Friend Request Sent"}), 200

    msg = Message('New Friend Request!', recipients=[friend_email])
    msg.html = '<p>Hello! You have a friend request waiting for you! Sign in <a href="http://localhost:3000/signin">here</a> and click the bell in the top right to view.</p>'
    mail.send(msg)

    return jsonify({"message": "Friend Request Sent"}), 200

def accept_request(email, friend_email):
    # check if already friends
    if friends.find_one({'user': email, 'friend': friend_email, 'status': 'friends'}) or friends.find_one({'user': friend_email, 'friend': email, 'status': 'friends'}):
        return jsonify({'info': 'Already Friends!'}), 401

    # update friend request status to friends
    # print(f"updating the request where the user is {friend_email} and the friend is {email}")
    friends.update_one({'user': friend_email, 'friend': email, 'status': 'pending'}, {'$set': {'status': 'friends'}})

    # add a new entry for the other user
    # print(f"inserting a new entry where the user is {email} and the friend is {friend_email}")
    friends.insert_one({'user': email, 'friend': friend_email, 'status': 'friends'})

    return jsonify({"message": "Friend Request Accepted"}), 200

def deny_request(email, friend_email):
    # check that the request exists
    if not friends.find_one({'user': friend_email, 'friend': email, 'status': 'pending'}):
        return jsonify({'info': 'Request does not exist!'}), 401

    # delete friend request
    friends.delete_one({'user': friend_email, 'friend': email, 'status': 'pending'})

    return jsonify({"message": "Friend Request Denied"}), 200


def get_requests(curr_email):
    # get all friend requests for the user
    friend_requests = []

    for freq in friends.find({'friend': curr_email}):
    # for freq in friends.find({'friend': curr_email, 'status': 'pending'}):
        friend_requests.append({
            'user': freq['user'],
            'friend': freq['friend'],
            'status': freq['status']
        })

    return jsonify(friend_requests), 200

def get_my_friends(curr_email):
    curr_friends = []

    for relation in friends.find({'user': curr_email, 'status': 'friends'}):
        curr_friends.append({
            'user': relation['user'],
            'friend': relation['friend'],
            'status': relation['status'],
        })

    return jsonify(curr_friends), 200

def remove_one(email, friend_email):
    # check that the friendship exists
    if not friends.find_one({'user': email, 'friend': friend_email, 'status': 'friends'}):
        return jsonify({'info': 'Friendship does not exist!'}), 401

    # delete friendship, from both ends
    friends.delete_one({'user': email, 'friend': friend_email, 'status': 'friends'})
    friends.delete_one({'user': friend_email, 'friend': email, 'status': 'friends'})

    return jsonify({"message": "Friend Removed"}), 200