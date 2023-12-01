from flask import Flask, jsonify, request  # pip install flask
from flask_mail import Mail, Message  # pip install flask_mail
from pymongo import MongoClient  # pip install pymogo
import connexion  # pip install connexion[swagger-ui]
import random  # no install
import bcrypt  # pip install bcrypt
from flask_cors import CORS  # pip install flas-cors
from dotenv import load_dotenv  # pip install python-dotenv
import os  # no install
from datetime import datetime, timedelta  # pip install datetime
import string  # no install
import json  # no install
import pdb  # python debugger, pip install pypdb
from flask_socketio import SocketIO, send, join_room, emit
import base64
from gridfs import GridFS
from bson import ObjectId
from flask_socketio import SocketIO, send, join_room, emit
import base64
from gridfs import GridFS
from bson import ObjectId
from bson.json_util import dumps
from bson.regex import Regex
import re

# import files
from events import get_history, add_history, delete_history, join, get_details, get_all, leave, get_my, edit_event
from friends import accept_request, deny_request, get_requests, get_my_friends, remove_one
from teams import create_a_team, get_users_teams, leave_a_team, change_name, get_pub_teams, join_team

load_dotenv()

# Socket for messaging

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]
teams = db["teams"]
events = db["events"]
friends = db["friends"]
stats = db["stats"]
fs = GridFS(db)
history = db["eventHistory"]
tournaments = db["tournaments"]
groups = db["groups"]

messages = db["messages"]

# sendgridtemplates
sg_account_creation = os.getenv('SG_ACCOUNT_CREATION')


def update_stats():
    data = request.json
    user = data['user']
    wins = data['wins']
    losses = data['losses']
    elo = data['elo']

    # Find the document and update
    result = stats.update_one(
        {'_id': user},
        {'$set': {'wins': wins, 'losses': losses, 'elo': elo}},
        upsert=True  # This creates a new document if one doesn't exist
    )

    if result.matched_count > 0 or result.upserted_id is not None:
        return jsonify({'message': 'Statistics updated successfully'}), 200
    else:
        return jsonify({'message': 'No matching document found'}), 400


def refresh_msg():
    payload = request.json
    print(payload)

    key = payload['chat_key']
    all_chats = []

    chat = messages.find_one({"_id": key})
    all_chats.append({chat["_id"]: chat["messages"]})

    return jsonify(all_chats)


def init_messages():
    payload = request.json

    print(payload)

    user = payload['email']
    friends = payload['friends']

    chat_keys = []
    all_chats = []

    for friend in friends:

        chat_key = generate_user_key(user, friend)
        chat = messages.find_one({"_id": chat_key})

        # 3. If neither combination exists, create a new entry
        if not chat:

            messages.insert_one({"_id": chat_key, "messages": []})
            all_chats.append({chat_key: []})
        else:
            all_chats.append({chat["_id"]: chat["messages"]})

        chat_keys.append(chat_key)

    return jsonify({"chats": all_chats, "chat_keys": chat_keys})


def generate_user_key(user1, user2):
    # Sort the user IDs to ensure consistency
    sorted_users = sorted([user1, user2])
    # Join the sorted user IDs with a delimiter to form a unique key
    return ':'.join(sorted_users)


def check_stats():
    emails = request.json["friends"]

    print(emails)
    response_data = []

    for email in emails:
        friend = email['friend']
        user_stats = stats.find_one({"_id": friend})
        if not user_stats:
            default_stats = {
                "_id": friend,
                "wins": 0,
                "losses": 0,
                "elo": 0
            }
            stats.insert_one(default_stats)
            response_data.append(default_stats)
        else:
            response_data.append(user_stats)

    return jsonify(response_data), 200


def create():
    payload = request.json
    events.insert_one(payload)
    emails = payload['participants']

    curr = emails[0]
    msg = Message('Invite to SportLink', recipients=emails)
    msg.html = f'<p>You have been invited by {curr} to play!</p>'
    mail.send(msg)
    return "Created"


def fetch_friends():
    obj = request.json

    email = obj['email']
    friend_requests = []

    for friend in friends.find({"user": email}):
        # Convert ObjectId to string
        friend['_id'] = str(friend['_id'])
        friend_requests.append(friend)

    return jsonify({'friends': friend_requests}), 200


def create_account():
    user = request.json

    email = user['email']
    if users.find_one({"email": email}):
        return jsonify({'message': 'Email already has an account'}), 401

    password = user['password'].encode('utf-8')
    username = email.split('@')[0]
    tempUsername = username

    # encrypt password
    salt = bcrypt.gensalt()
    hashWord = bcrypt.hashpw(password, salt)

    # generate a unique username for the user
    # user['username] so the digits don't keep adding to end on multiple iterations
    while users.find_one({'username': username}):
        username = tempUsername + str(random.randint(100, 9999))

    # insert new user into the db
    userData = {
        'email': email,
        'password': hashWord.decode('utf-8'),  # store hashed pass as a string
        'username': username,
        'friends': [],
        'numTennis': 0,
        'numBasketball': 0,
        'numSoccer': 0,
        'numWeights': 0

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

    # request data
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

            optional_fields = ['firstName', 'lastName', 'phoneNumber', 'friends', 'age', 'birthday', 'gender', 'city',
                               'state', 'zipCode', 'country', 'address', 'accountPrivacy', 'displayAge',
                               'displayLocation', 'displayPhoneNumber', 'profileImage', 'imageData', "blocked",
                               "blocked_users", "blocker", 'numTennis', 'numBasketball', 'numWeights', 'numSoccer']
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

    print(req_user)

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
            # login to their google account
            email = user['email']
            username = user['username']

            userData = {
                'username': username,
                'friends': []
            }

            optional_fields = ['phoneNumber', 'friends', 'age', 'gender', 'city', 'state', 'birthday', 'zipCode',
                               'country', 'address', 'accountPrivacy', 'displayAge', 'displayLocation',
                               'displayPhoneNumber', 'profileImage', 'imageData', "blocked", "blocked_users", "blocker",
                               'numTennis', 'numBasketball', 'numWeights', 'numSoccer']
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

        # generate a unique username for the user
        while users.find_one({'username': username}):
            username = tempUsername + str(random.randint(10, 9999))

        # insert new user into the db
        userData = {
            'email': email,
            'password': googleId,  # store google id as their password
            'username': username,
            'firstName': firstName,
            'lastName': lastName,
            'friends': [],
            'numTennis': 0,
            'numBasketball': 0,
            'numSoccer': 0,
            'numWeights': 0
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
    user = request.get_json()
    email = user.get('email')

    update_query = {}
    for field in ['firstName', 'lastName', 'username', 'phoneNumber', 'address', 'state', 'country', 'zipCode', 'city',
                  'age', 'gender', 'birthday']:
        if field in user:
            update_query[field] = user.get(field)

    if 'profileImage' in user:
        profile_image = user.get('profileImage')

        # Check if the string starts with the correct prefix 'data:image/jpeg;base64,' or any other format
        if profile_image.startswith('data:image/jpeg;base64,'):
            profile_image = profile_image.replace('data:image/jpeg;base64,', '')  # Remove the prefix
        elif profile_image.startswith('data:image/png;base64,'):
            profile_image = profile_image.replace('data:image/png;base64,', '')  # Remove the prefix

        try:
            image_data = base64.b64decode(profile_image)
            fs.put(image_data, filename=email + '_profile_image')  # Use email as a unique identifier

            # Save a reference to the image in the user's profile
            update_query['profileImage'] = email + '_profile_image'
            update_query['imageData'] = base64.b64encode(image_data).decode('utf-8')
        except Exception as e:
            # Handle base64 decoding error
            return jsonify({'error': 'Base64 decoding error', 'message': str(e)}), 400

    users = db.users  # Assuming your collection name is 'users'
    users.update_one({"email": email}, {"$set": update_query})

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
    sport = request.json['sport']
    maxPlayers = request.json['maxPlayers']
    location = request.json['location']
    skill = request.json['skill']
    gameID = request.json['gameID']

    if gameID == 0 or gameID == 2:
        dbData = teams
    else:
        dbData = events

    # Inserting into MongoDB
    location_exists = dbData.find({'_id': location})

    if location_exists:
        # If location exists, append

        # Create Team or Event
        if gameID == 0 or gameID == 1:
            dbData.update_one({'_id': location}, {'$push': {'data': {
                'maxPlayers': maxPlayers,
                'sport': sport,
                'skill': skill,
                'gameID': gameID
            }}})
        # Join Team/ Event
        else:
            return jsonify(dbData.find_one({'_id': location})), 200



    else:

        if gameID == 2 or gameID == 3:
            return jsonify({"message": "No Games or Teams Found!"}), 400

        # If location doesn't exist, create a new entry
        dbData.insert_one({'_id': location, 'data': [{
            'maxPlayers': maxPlayers,
            'sport': sport,
            'skill': skill,
            'gameID': gameID
        }]})

        return jsonify({"message": "Team successfully created"}), 200


def gamesUpdate():
    # Extracting data from request
    sport = request.json['sport']
    maxPlayers = request.json['maxPlayers']
    location = request.json['location']
    skill = request.json['skill']
    gameID = request.json['gameID']

    if gameID == 0 or gameID == 2:
        dbData = teams
    else:
        dbData = events

    # Inserting into MongoDB
    location_exists = dbData.find({'_id': location})

    if location_exists:
        # If location exists, append

        # Create Team or Event
        if gameID == 0 or gameID == 1:
            dbData.update_one({'_id': location}, {'$push': {'data': {
                'maxPlayers': maxPlayers,
                'sport': sport,
                'skill': skill,
                'gameID': gameID
            }}})
        # Join Team/ Event
        else:
            return jsonify(dbData.find_one({'_id': location})), 200



    else:

        if gameID == 2 or gameID == 3:
            return jsonify({"message": "No Games or Teams Found!"}), 400

        # If location doesn't exist, create a new entry
        dbData.insert_one({'_id': location, 'data': [{
            'maxPlayers': maxPlayers,
            'sport': sport,
            'skill': skill,
            'gameID': gameID
        }]})

        return jsonify({"message": "Team successfully created"}), 200

# Use the username to find the user email
def get_email_from_username():
    data = request.get_json()
    username = data["friendUsername"]
    user_data = list(users.find())

    request_data = {
        "email": ""
    }

    for user in user_data:
        if str(username) == user["username"]:
            request_data["email"] = user["email"]

    return jsonify(request_data)


# Send a friend request to another user
def send_friend_request():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

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


# Accept a friend request from another user
def accept_friend_request():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

    return accept_request(email, friend_email)


# Deny a friend request from another user
def deny_friend_request():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

    return deny_request(email, friend_email)


def get_friend_requests():
    # Extracting data from request
    curr_email = request.args.get('email')

    return get_requests(curr_email)


def get_friends():
    # xtracting data from request
    curr_email = request.args.get('email')

    return get_my_friends(curr_email)


def remove_friend():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

    return remove_one(email, friend_email)


def get_reports():
    user_email = request.args.get('email')

    # Fetch reports only for the specified user
    user_reports = db.reports.find({'reported_user_email': user_email})

    # Convert ObjectId to string for JSON serialization
    user_reports_list = json.loads(dumps(list(user_reports)))

    return jsonify(user_reports_list), 200


def get_blocked_users():
    email = request.args.get('email')  # Get the email from the request
    user = db.blocks.find_one({'email': email})  # Find the document with the provided email

    if user:
        blocked_users = user.get('blocked_users', [])
        return jsonify(blocked_users), 200
    else:
        return jsonify(
            []), 404  # Return an empty list with a 404 status if the user is not found or has no blocked users


def unblock_user():
    data = request.get_json()
    blocker_email = data.get('blocker')
    blocked_user_email = data.get('blocked_user')

    # Find the user who has blocked someone
    user = db.blocks.find_one({'email': blocker_email})

    if user:
        blocked_users = user.get('blocked_users', [])
        if blocked_user_email in blocked_users:
            # Remove the blocked user from the list
            blocked_users.remove(blocked_user_email)

            # Update the blocked_users array for the user who blocked
            db.blocks.update_one(
                {'email': blocker_email},
                {'$set': {'blocked_users': blocked_users}}
            )

            return jsonify({'message': f'{blocked_user_email} unblocked successfully'}), 200

    return jsonify({'message': 'User not found or unblock failed'}), 404


def preprocess_phone_number(phone_number):
    # Remove non-digit characters from the phone number
    return re.sub(r'\D', '', phone_number)


def get_image_from_gridfs(image_id):
    file_doc = fs.find_one({"filename": image_id})
    image_data = None
    if file_doc:
        chunks = fs.find({"files_id": file_doc._id})
        image_data = b''.join(chunk.read() for chunk in chunks)
        image_data = base64.b64encode(image_data).decode('utf-8')
    return file_doc, image_data


def user_lookup():
    search_term = request.args.get('searchTerm')
    searching_user_email = request.args.get('email')
    matching_users = []

    # Create a case-insensitive regular expression for the search term
    regex = Regex(f"{search_term}", "i")

    # Querying the users directly and iterating over the cursor
    for user in users.find({
        "$or": [
            {"username": regex},
            {"email": regex},
            {"phoneNumber": regex},
            {"firstName": regex},
            {"lastName": regex},
        ]
    }):
        # Check if the searched user is blocked by the user performing the search
        # is_blocked = searching_user_email in user.get("blocked_users", [])

        # if not is_blocked:
        matching_users.append({
            "id": str(user["_id"]),
            "name": user.get("name"),
            "username": user.get("username"),
            "email": user.get("email"),
            "phoneNumber": user.get("phoneNumber"),
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "profileImage": user.get("profileImage"),
            # "blocked": is_blocked,
            "imageData": user.get("imageData")
        })

    return jsonify(matching_users), 200


def get_user_info():
    email = request.args.get('email')
    blocker_email = request.args.get('blocker_email')

    # Query the database for the user based on email
    user = users.find_one({"email": email})
    if user:
        # Fetch user privacy settings
        display_phone_number = user.get("displayPhoneNumber")
        display_age = user.get("displayAge")
        display_location = user.get("displayLocation")

        # Prepare user information based on privacy settings
        user_info = {
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "username": user.get("username"),
            "email": user.get("email"),
            "gender": user.get("gender"),
            "birthday": user.get("birthday"),
            "profileImage": user.get("profileImage"),
            "imageData": user.get("imageData"),
            "blocked_users": user.get("blocked_users"),
            "blocker": user.get("blocker"),
            "blocked": user.get("blocked")
        }

        # Add fields conditionally based on privacy settings
        if display_phone_number != "private":
            user_info["phoneNumber"] = user.get("phoneNumber")
        else:
            user_info["phoneNumber"] = "This information is set on private by the user."

        if not display_age:
            user_info["age"] = user.get("age")
        else:
            user_info["age"] = "This information is set on private by the user."

        if not display_location:
            user_info["city"] = user.get("city")
        else:
            user_info["city"] = "This information is set on private by the user."

        return jsonify(user_info), 200
    else:
        # User not found
        return jsonify({'message': 'User not found'}), 404


def get_user_info2():
    username = request.args.get('username')
    blocker_email = request.args.get('blocker_email')

    # Query the database for the user based on email
    user = users.find_one({"username": username})
    if user:
        # Fetch user privacy settings
        display_phone_number = user.get("displayPhoneNumber")
        display_age = user.get("displayAge")
        display_location = user.get("displayLocation")

        # Prepare user information based on privacy settings
        user_info = {
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "username": user.get("username"),
            "email": user.get("email"),
            "gender": user.get("gender"),
            "birthday": user.get("birthday"),
            "profileImage": user.get("profileImage"),
            "imageData": user.get("imageData"),
            "blocked_users": user.get("blocked_users"),
            "blocker": user.get("blocker"),
            "blocked": user.get("blocked")
        }

        # Add fields conditionally based on privacy settings
        if display_phone_number != "private":
            user_info["phoneNumber"] = user.get("phoneNumber")
        else:
            user_info["phoneNumber"] = "This information is set on private by the user."

        if not display_age:
            user_info["age"] = user.get("age")
        else:
            user_info["age"] = "This information is set on private by the user."

        if not display_location:
            user_info["city"] = user.get("city")
        else:
            user_info["city"] = "This information is set on private by the user."

        return jsonify(user_info), 200
    else:
        # User not found
        return jsonify({'message': 'User not found'}), 404


def delete_account():
    req = request.data.decode("utf-8")
    parsed = json.loads(req)
    email = parsed.get('email', '')

    print(email)
    users.delete_one({"email": email})
    return 200


def get_events():
    event_data = list(events.find())

    # Convert ObjectId to string within the event data
    for event in event_data:
        event['_id'] = str(event['_id'])

    # Return the modified event data as JSON
    return jsonify(event_data), 200


def get_event_details():
    return get_details(request.args.get("id"), list(events.find()))

def edit_event_details():
    data = request.get_json()
    return edit_event(data.get("eventID"), list(events.find()))

def delete_event_details():
    event_data = list(events.find())
    data = request.get_json()
    event_id = data.get("eventID")
    
    for event in event_data:
        if str(event_id) == str(event["_id"]):
            events.delete_one({"_id": event["_id"]})
            return jsonify({"message": "Event deleted from database"}), 200


def get_all_events():
    return get_all(request.args.get('email'))


def join_event():
    data = request.get_json()

    bball = data.get("numBasketball")
    tennis = data.get("numTennis")
    soccer = data.get("numSoccer")
    weights = data.get("numWeights")
    users.update_one({"username": data.get('username')}, {
        "$set": {"numBasketball": bball, "numTennis": tennis, "numSoccer": soccer, "numWeights": weights}})

    return join(data.get("id"), data.get("username"), list(events.find()))


def leave_event():
    data = request.get_json()
    return leave(data.get("id"), data.get("username"), list(events.find()))


def get_event_history():
    return get_history(request.args.get("username"), list(history.find()), list(events.find()))


def add_event_history():
    data = request.get_json()
    return add_history(data.get("event"), data.get("user"))


def delete_event_history():
    data = request.get_json()
    return delete_history(data.get("event"), data.get("user"))


def get_my_events():
    return get_my(list(events.find()), request.args.get("username"))

def get_my_created_events():
    event_data = list(events.find())
    email = request.args.get("email")

    user_events = []

    for event in event_data:
        event['_id'] = str(event['_id'])

    for event in event_data:
        if event["eventOwner"] == email:
            user_events.append(event)

    return jsonify(user_events), 200

def end_event():
    event_data = list(events.find())
    data = request.get_json()
    eventID = data["eventID"]
    summary = data["summary"]

    for event in event_data:
        if str(eventID) == str(event["_id"]):
            events.update_one({"_id": event["_id"]}, {"$set": {"end": True, "desc": summary}})

    return jsonify({"message": "Event ended successfully"}), 200

def remove_participant():
    event_data = list(events.find())
    data = request.get_json()
    eventID = data["eventID"]
    username = data["username"]

    for event in event_data:
        if str(eventID) == str(event["_id"]):
            event["participants"].remove(username)
            event["currentParticipants"] -= 1
            events.update_one({"_id": event["_id"]}, {"$set": {"participants": event["participants"], "currentParticipants": event["currentParticipants"]}})
            return jsonify({'message': 'Deleted User from event'}), 200

def submit_report():
    user = request.get_json()
    email = user.get('email')
    reportReason = user.get('reportReason')

    # Extracting month, day, and year from the current date
    current_date = datetime.now()
    formatted_timestamp = current_date.strftime("%m/%d/%Y")

    # Assuming you have a "reports" collection to store report reasons
    # Create a new document for each report
    report = {
        'reported_user_email': email,
        'report_reason': reportReason,
        'timestamp': formatted_timestamp
        # Add more details if needed
    }

    # Insert the report into the "reports" collection
    db.reports.insert_one(report)

    return jsonify({'message': 'Report submitted successfully'}), 200


def block_user():
    user = request.get_json()
    email = user.get('blocker')
    blocked_user = user.get('blocked_users')
    blocked = user.get('blocked')

    # Update the user's document to add the blocked user to the 'blocked_users' array field
    db.blocks.update_one(
        {"email": email},
        {"$addToSet": {"blocked_users": blocked_user}},
        upsert=True  # If the document doesn't exist, create it
    )

    return jsonify({'message': 'User blocked successfully'}), 200


def get_user_notifs_settings():
    curr_email = request.args.get('email')

    # Fetch the user's notification settings
    curr_user = users.find_one({'email': curr_email})

    if curr_user:
        # check if they have sendEmail and showInApp fields
        if 'sendEmail' in curr_user and 'showInApp' in curr_user:
            settings = {
                'sendEmail': curr_user['sendEmail'],
                'showInApp': curr_user['showInApp']
            }
            return jsonify(settings), 200

    # create a dummy array of sendEmail and showInApp as true
    settings = {
        'sendEmail': True,
        'showInApp': True
    }

    return jsonify(settings), 200


def set_user_notifs_settings():
    user = request.get_json()
    email = user.get('email')
    sendEmail = user.get('sendEmail')
    showInApp = user.get('showInApp')

    # Update the user's notification settings in the database
    update_query = {}
    if sendEmail is not None:
        update_query['sendEmail'] = sendEmail
    if showInApp is not None:
        update_query['showInApp'] = showInApp

    users.update_one({"email": email}, {"$set": update_query})
    return jsonify({'message': 'Notification settings updated successfully'}), 200


def clear_notifications():
    data = request.json
    user_email = data.get("email")

    if not user_email:
        print("Error: Email is required in the request body")  # Log for debugging
        return jsonify({"error": "Email is required"}), 400

    # Check for pending friend requests
    try:
        pending_requests = db.friends.count_documents(
            {"friend": user_email, "status": "pending"}
        )
    except Exception as e:
        print(f"Database error: {e}")  # Log for debugging
        return jsonify({"error": "Database error"}), 500

    if pending_requests > 0:
        print(f"Error: Cannot clear notifications with pending friend requests for {user_email}")  # Log for debugging
        return jsonify({"error": "Cannot clear notifications with pending friend requests"}), 400

    # Delete 'friends' status notifications
    try:
        db.friends.delete_many({"friend": user_email, "status": "friends"})
    except Exception as e:
        print(f"Database error during friends deletion: {e}")  # Log for debugging
        return jsonify({"error": "Database error during friends deletion"}), 500

    # Clear report notifications
    try:
        db.reports.delete_many({"reported_user_email": user_email})
    except Exception as e:
        print(f"Database error during reports deletion: {e}")  # Log for debugging
        return jsonify({"error": "Database error during reports deletion"}), 500

    return jsonify({"message": "Notifications cleared"}), 200


def create_team():
    req = request.get_json()
    team_name = req['name']
    team_leader = req['leader']
    teammates = req['members']
    team_size = req['size']
    max_team_size = req['maxSize']
    privacy_settings = req['publicity']

    return create_a_team(team_name, team_leader, teammates, team_size, max_team_size, privacy_settings)


def get_teams():
    curr_email = request.args.get('email')

    list_of_teams = get_users_teams(curr_email)

    return jsonify(list_of_teams), 200


def leave_team():
    req = request.get_json()
    team_name = req['name']
    user_leaving = req['user']
    new_leader = req['new_leader']

    return leave_a_team(user_leaving, team_name, new_leader)


def change_team_name():
    req = request.get_json()
    team_name = req['name']

    return change_name(team_name), 200


def get_public_teams():
    return get_pub_teams(), 200


def joinTeam():
    req = request.json

    return join_team(req), 200


def create_tournament():
    data = request.json

    tournament_data = {
        'sport': data.get('sport', ''),
        'teamCount': data.get('teamCount', ''),
        'tournamentDuration': data.get('tournamentDuration', ''),
        'matchDuration': data.get('matchDuration', ''),
        'startTime': data.get('startTime', '')
    }

    tournaments.insert_one(tournament_data)

    return jsonify({'message': 'Tournament created successfully'}), 200


def get_tournaments():
    all_tournaments = list(tournaments.find({}))

    # Convert ObjectId to string
    for tournament in all_tournaments:
        tournament['_id'] = str(tournament['_id'])

    # print("All tournaments:", all_tournaments)

    return jsonify(json.loads(json.dumps(all_tournaments, default=str)))

def get_tournament_id():
    tournament = tournaments.find_one({})
    if tournament:
        return jsonify({'tournamentId': str(tournament['_id'])}), 200
    else:
        return jsonify({'message': 'Tournament not found'}), 404

def get_tournament_details():
    tournament_id = request.args.get('id')
    if not tournament_id:
        return jsonify({'message': 'Missing tournament ID'}), 400

    try:
        object_id = ObjectId(tournament_id)
    except:
        return jsonify({'message': 'Invalid tournament ID'}), 400

    tournament = tournaments.find_one({'_id': object_id})
    if tournament:
        tournament['_id'] = str(tournament['_id'])
        return jsonify(json.loads(json.dumps(tournament, default=str)))
    else:
        return jsonify({'message': 'Tournament not found'}), 404

def join_tournament():
    data = request.json
    tournament_id = data.get('tournamentId')
    team_id = data.get('teamId')

    # Validate inputs
    if not tournament_id or not team_id:
        return jsonify({"message": "Missing tournamentId or teamId"}), 400

    # Convert IDs to ObjectId
    try:
        obj_tournament_id = ObjectId(tournament_id)
        obj_team_id = ObjectId(team_id)
    except:
        return jsonify({"message": "Invalid tournamentId or teamId"}), 400

    # Check if tournament and team exist
    tournament = db.tournaments.find_one({'_id': obj_tournament_id})
    team = db.teams.find_one({'_id': obj_team_id})
    if not tournament or not team:
        return jsonify({"message": "Tournament or Team not found"}), 404

    # Add team name to tournament
    updated_tournament = db.tournaments.update_one(
        {'_id': obj_tournament_id},
        {'$addToSet': {'teams': team['name']}}  # Use team name here
    )

    if updated_tournament.modified_count == 0:
        return jsonify({"message": "Failed to join the tournament"}), 500

    return jsonify({"message": "Joined the tournament successfully"}), 200

def leave_tournament():
    data = request.get_json()
    tournament_id = data.get('tournamentId')
    team_id = data.get('teamId')
    user_email = data.get('userEmail')

    # Validate inputs
    if not tournament_id or not team_id or not user_email:
        return jsonify({"message": "Missing tournamentId, teamId, or userEmail"}), 400

    # Convert tournament ID to ObjectId
    try:
        obj_tournament_id = ObjectId(tournament_id)
    except:
        return jsonify({"message": "Invalid tournamentId"}), 400

    # Check if tournament exists
    tournament = db.tournaments.find_one({'_id': obj_tournament_id})
    if not tournament:
        return jsonify({"message": "Tournament not found"}), 404

    # Check if the team exists and the user is the leader
    team = db.teams.find_one({'_id': ObjectId(team_id), 'leader': user_email})
    if not team:
        return jsonify({"message": "Team not found or you are not the leader"}), 403

    # Check if the tournament has started
    if tournament.get('start_date') and tournament['start_date'] <= datetime.now():
        return jsonify({"message": "Cannot leave the tournament after it has started"}), 403

    # Remove the team name from the tournament
    if team['name'] in tournament.get('teams', []):
        result = db.tournaments.update_one(
            {'_id': obj_tournament_id},
            {'$pull': {'teams': team['name']}}
        )

        if result.modified_count == 0:
            return jsonify({"message": "Failed to leave the tournament"}), 500

        # Notify team members (Implement your notification logic here)
        return jsonify({"message": "Left the tournament successfully"}), 200
    else:
        return jsonify({"message": "Team not participating in this tournament"}), 400

def get_teams2():
    #curr_email = request.args.get('email')

    #list_of_teams = get_users_teams(curr_email)

    #return jsonify(list_of_teams), 200

    all_teams = list(teams.find({}))

    # Convert ObjectId to string
    for team in all_teams:
        team['_id'] = str(team['_id'])

    #print("All teams:", all_teams)

    return jsonify(all_teams), 200





def init_groups():
    req = request.json
    user = req['email']

    # Find the user document in the collection
    user_document = groups.find_one({"user": user})

    group_keys = []
    if user_document and "chat_keys" in user_document:
        group_chats = []
        for key in user_document["chat_keys"]:
            # Fetch each group chat by its key
            group_chat = groups.find_one({"key": key})
            if group_chat:
                # Append the chat key and its messages to the list
                group_chats.append({
                    "key": key,
                    "messages": group_chat.get("messages", [])
                })

                group_keys.append(key)

        return jsonify({"group_chats": group_chats, 'group_keys': group_keys})
    else:
        # Return an empty list if the user document does not exist or has no chat keys
        return jsonify({"group_chats": [], 'group_keys': []})


def generate_group_key(members, user):
    # Include the user in the list of members
    all_members = members + [user]
    # Sort the user IDs to ensure consistency
    sorted_users = sorted(all_members)
    return ':'.join(sorted_users)


def create_chat():
    req = request.json
    members = req['members']
    user = req['user']

    key = generate_group_key(members, user)

    # Insert so each user can lookup their groupchat key
    groups.update_one(
        {"user": user},
        {"$addToSet": {"chat_keys": key}},  # Use $addToSet to avoid duplicates
        upsert=True  # Create a new document if the user does not exist
    )

    for member in members:
        groups.update_one(
            {"user": member},
            {"$addToSet": {"chat_keys": key}},
            upsert=True
        )
    groups.insert_one({"key": key, "messages": []})

    return jsonify({'key': key, 'messages': []}, 200)

def refresh_gmsg():
    payload = request.json
    print(payload)

    key = payload['chat_key']

    chat = groups.find_one({"key": key})
    return jsonify({'key': key, 'messages': chat['messages']})

app = connexion.App(__name__, specification_dir='.')
CORS(app.app)
app.add_api('swagger.yaml')

# Socket for messaging
socketIo = SocketIO(app.app, cors_allowed_origins="*")
flask_app = app.app

# email sending information
key = os.getenv("SG_API_KEY")
sender = os.getenv("MAIL_SENDER")

flask_app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
flask_app.config['MAIL_PORT'] = 587
flask_app.config['MAIL_USE_TLS'] = True
flask_app.config['MAIL_USERNAME'] = 'apikey'
flask_app.config['MAIL_PASSWORD'] = key
flask_app.config['MAIL_DEFAULT_SENDER'] = sender
mail = Mail(flask_app)


@socketIo.on('connect')
def handle_connect():
    print('Client connected')


@socketIo.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketIo.on('join')
def handle_join(obj):
    print("Client Joined")
    join_room(obj)
    print(obj)
    send(f"{request.sid} has entered the room.", room=obj)


@socketIo.on('new_message')
def handle_new_message(data):
    print("Handling Messages")
    IP_TO = data['IP_TO']
    IP_FROM = data['IP_FROM']
    content = data['content']

    chat_key = generate_user_key(IP_TO, IP_FROM)

    chat = messages.find_one({"_id": chat_key})

    if chat:
        # Append the new message to the existing messages array
        new_message = {"content": content}
        messages.update_one({"_id": chat["_id"]}, {"$push": {"messages": new_message}})
    else:
        # If chat doesn't exist, create it (assuming IP_FROM is the user initiating the chat)
        messages.insert_one({"_id": chat_key, "messages": [{"content": content}]})

    # Broadcast or emit the message as needed
    emit('message_response', {'key': chat_key}, room=IP_TO)
    print(content)
    print(IP_FROM)
    print(IP_TO)
    print("Message Sent")


@socketIo.on('group_message')
def group_message(data):
    print("Handling Group Message")
    user = data['user']
    members = data['members']
    content = data['content']

    key = generate_group_key(members, user)

    chat = groups.find_one({"key": key})

    print(chat)

    if chat:
        # Append the new message to the existing messages array
        new_message = {"content": content}
        print(new_message)
        groups.update_one({"key": key}, {"$push": {"messages": new_message}})
        print("Complete")
    else:
        # If chat doesn't exist, create it (assuming IP_FROM is the user initiating the chat)
        groups.insert_one({"key": key, "messages": [{"content": content}]})

    # Broadcast or emit the message as needed
    for member in members:
        emit('group_response', {'key': key, 'content': content}, room=member)
        print("Sent to : " + member)

    print("Messages Sent")


if __name__ == '__main__':
    app.run(port=5000)
