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
import json # no install
import pdb # python debugger, pip install pypdb
from flask_socketio import SocketIO, send, join_room, emit
import base64
from gridfs import GridFS
from bson import ObjectId
from bson.json_util import dumps
from bson.regex import Regex
import re

load_dotenv()

# Socket for messaging

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]
teams = db["teams"]
events = db["tempEvents"] # REMINDER: Change back to events
friends = db["friends"]
stats = db["stats"]
fs = GridFS(db)


#sendgridtemplates
sg_account_creation = os.getenv('SG_ACCOUNT_CREATION')

def check_stats():
    emails = request.json["friends"]

    response_data = []

    for email in emails:
        user_stats = stats.find_one({"_id": email})
        if not user_stats:
            default_stats = {
                "_id": email,
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

    print("HERE")
    for friend in friends.find({"user": email}):
        # Convert ObjectId to string
        friend['_id'] = str(friend['_id'])
        friend_requests.append(friend)
        print("HERE")

    return jsonify({'friends': friend_requests}), 200


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

            optional_fields = ['firstName', 'lastName', 'phoneNumber', 'friends', 'age', 'birthday', 'gender', 'city', 'state', 'zipCode', 'country', 'address', 'accountPrivacy', 'displayAge', 'displayLocation', 'displayPhoneNumber', 'profileImage', 'imageData']
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
            #login to their google account
            email = user['email']
            username = user['username']

            userData = {
                'username': username,
                'friends': []
            }

            optional_fields = ['phoneNumber', 'friends', 'age', 'gender', 'city', 'state', 'birthday', 'zipCode', 'country', 'address', 'accountPrivacy', 'displayAge', 'displayLocation', 'displayPhoneNumber', 'profileImage', 'imageData']
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
            'lastName': lastName,
            'friends': []
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
    for field in ['firstName', 'lastName', 'username', 'phoneNumber', 'address', 'state', 'country', 'zipCode', 'city', 'age', 'gender', 'birthday']:
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
    msg = Message('New Friend Request!', recipients=[friend_email])
    msg.html = '<p>Hello! You have a friend request waiting for you! Sign in <a href="http://localhost:3000/signin">here</a> and click the bell in the top right to view.</p>'
    mail.send(msg)

    return jsonify({"message": "Friend Request Sent"}), 200

# should be called when a user accepts a friend request
# user is presented all the requests where they are the friend email
def accept_friend_request():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

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

# should be called when a user denies a friend request
# user is presented all the requests where they are the friend email
def deny_friend_request():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

    # check that the request exists
    if not friends.find_one({'user': friend_email, 'friend': email, 'status': 'pending'}):
        return jsonify({'info': 'Request does not exist!'}), 401

    # delete friend request
    friends.delete_one({'user': friend_email, 'friend': email, 'status': 'pending'})

    return jsonify({"message": "Friend Request Denied"}), 200


def get_friend_requests():
    # Extracting data from request
    # pdb.set_trace()
    curr_email = request.args.get('email')

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

def get_friends():
    # # Extracting data from request
    # req = request.json
    # email = req['email']
    # print(email)
    curr_email = request.args.get('email')

    curr_friends = []

    for relation in friends.find({'user': curr_email, 'status': 'friends'}):
        print(relation)
        curr_friends.append({
            'user': relation['user'],
            'friend': relation['friend'],
            'status': relation['status']
        })

    return jsonify(curr_friends), 200

def get_reports():
    user_email = request.args.get('email')

    # Fetch reports only for the specified user
    user_reports = db.reports.find({'reported_user_email': user_email})

    # Convert ObjectId to string for JSON serialization
    user_reports_list = json.loads(dumps(list(user_reports)))

    return jsonify(user_reports_list), 200

def get_blocked_users():
    email = request.args.get('email')
    user = users.find_one({'email': email})
    if user:
        blocked_users = user.get('blocked_users', [])
        return jsonify(blocked_users), 200
    return jsonify([]), 404

def unblock_user():
    data = request.get_json()
    blocker = data.get('blocker')
    blocked_user = data.get('blocked_user')

    # Update the blocked_users field in the user's document
    user = users.find_one({'email': blocker})
    if user:
        blocked_users = user.get('blocked_users', [])
        if blocked_user in blocked_users:
            blocked_users.remove(blocked_user)
            # Update the user's document in the database
            users.update_one({'email': blocker}, {'$set': {'blocked_users': blocked_users}})
            return jsonify({'message': f'{blocked_user} has been unblocked by {blocker}'}), 200

    return jsonify({'error': 'Unable to unblock the user'}), 404

def remove_friend():
    # Extracting data from request
    req = request.json
    email = req['email']
    friend_email = req['friend_email']

    # check that the friendship exists
    if not friends.find_one({'user': email, 'friend': friend_email, 'status': 'friends'}):
        return jsonify({'info': 'Friendship does not exist!'}), 401

    # delete friendship, from both ends
    friends.delete_one({'user': email, 'friend': friend_email, 'status': 'friends'})
    friends.delete_one({'user': friend_email, 'friend': email, 'status': 'friends'})

    return jsonify({"message": "Friend Removed"}), 200

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
            {"profileImage": regex},
            {"imageData": regex}
        ]
    }):
        
        # Check if the searched user is blocked by the user performing the search
        is_blocked = searching_user_email in user.get("blocked_users", [])
        
        if not is_blocked:
            image_data = None
            if 'profileImage' in user: 
                file_doc, image_data = get_image_from_gridfs(user['profileImage'])
        matching_users.append({
                "id": str(user["_id"]),
                "name": user.get("name"),
                "username": user.get("username"),
                "email": user.get("email"),
                "phoneNumber": user.get("phoneNumber"),
                "firstName": user.get("firstName"),
                "lastName": user.get("lastName"),
                "profileImage": user.get("profileImage"),
                "blocked": is_blocked,
                "imageData": user.get("imageData")
            })

    return jsonify(matching_users), 200

def get_user_info():
    email = request.args.get('email')

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
            "imageData": user.get("imageData")
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

# @app.route("/get_event_details", methods=["GET"])
def get_event_details():
    eventID = request.args.get("id")
    event_data = list(events.find())

    for event in event_data:
        if str(eventID) == str(event["_id"]):
            event_info = {
                "title": event["title"],
                "desc": event["desc"],
                "city": event["city"],
                "open": event["open"],
                "sport": event["sport"],
                "level": event["level"],
                "currentParticipants": event["currentParticipants"],
                "maxParticipants": event["maxParticipants"],
                "participants": event["participants"],
            }
            break

    return jsonify(event_info), 200

def join_event():
    data = request.get_json()
    eventID = data.get("id")
    username = data.get("username")
    event_data = list(events.find())

    for event in event_data:
        if eventID == str(event["_id"]):  # Compare as strings
            # Check if the event is open for joining
            if event["currentParticipants"] < event["maxParticipants"]:
                # Add the username to the participants array
                event["participants"].append(username)
                event["currentParticipants"] += 1
                events.update_one({"_id": event["_id"]}, {"$set": {"participants": event["participants"], "currentParticipants": event["currentParticipants"]}})
                return jsonify({"message": "Event joined successfully"}), 200
            else:
                return jsonify({"message": "The event is full. You cannot join at the moment."}), 400

    return jsonify({"message": "Event not found."}), 404

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

    # Update the user's document to add the blocked user to the 'blocked_users' field
    users.update_one(
        {"email": email},
        {"$addToSet": {"blocked_users": blocked_user}}
    )

    return jsonify({'message': 'User blocked successfully'}), 200

app = connexion.App(__name__, specification_dir='.')
CORS(app.app)
app.add_api('swagger.yaml')

# Socket for messaging
socketIo = SocketIO(app.app, cors_allowed_origins="*")
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


@socketIo.on('connect')
def handle_connect():
    print('Client connected')

@socketIo.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketIo.on('join')
def handle_join(obj):
    print(obj)
    join_room(obj)
    send(f"{request.sid} has entered the room.", room=obj)

@socketIo.on('new_message')
def handle_new_message(data):
    IP_TO = data['IP_TO']
    name = data['name']
    content = data['content']
    IP_FROM = data['IP_FROM']

    # Handle the message, possibly broadcasting it or storing it, etc.
    print(IP_FROM)
    print(IP_TO)
    print(name)
    print(content)
    # Optionally, you can send an acknowledgment or response back to the client
    emit('message_response', {'name': name, 'content': content, 'IP_FROM': IP_FROM}, room=IP_TO)


if __name__ == '__main__':
    app.run(port=5000)
