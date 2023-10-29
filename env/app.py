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
load_dotenv()


# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]
teams = db["teams"]
events = db["events"]
friends = db["friends"]

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

            optional_fields = ['friends']
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
    phoneNumber = user.get('phoneNumber')
    firstName = user.get('firstName')
    lastName = user.get('lastName')
    username = user.get('username')
    address = user.get('address')
    state = user.get('state')
    country = user.get('country')
    zipCode = user.get('zipcode')
    city = user.get('city')
    age = user.get('age')
    gender = user.get('gender')
    birthday = user.get('birthday')

    # udpate the user's phone number in the data base
    update_query = {}
    if firstName is not None:
        update_query['firstName'] = firstName
    if lastName is not None:
        update_query['lastName'] = lastName
    if username is not None:
        update_query['username'] = username
    if phoneNumber is not None:
        update_query['phoneNumber'] = phoneNumber
    if address is not None:
        update_query['address'] = address 
    if state is not None:
        update_query['state'] = state
    if country is not None:
        update_query['country'] = country
    if zipCode is not None:
        update_query['zipCode'] = zipCode
    if city is not None:
        update_query['city'] = city
    if age is not None:
        update_query['age'] = age
    if birthday is not None:
        update_query['birthday'] = birthday
    if gender is not None:
        update_query['gender'] = gender
    
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
        return jsonify({'info': 'Friend does not exist!'}), 204

    # check if friend request already exists
    if friends.find_one({'user': email, 'friend': friend_email, 'status': 'pending'}):
        return jsonify({'info': 'There is already a request pending between you and this user!'}), 204
    elif friends.find_one({'user': friend_email, 'friend': email, 'status': 'pending'}):
        return jsonify({'info': 'There is already a request pending between you and this user!'}), 204
    
    # check if already friends
    if friends.find_one({'user': email, 'friend': friend_email, 'status': 'friends'}):
        return jsonify({'info': 'Already Friends!'}), 204

    # setup request data
    requestData = {
        'user': email,
        'friend': friend_email,
        'status': 'pending'
    }

    # insert friend request into db
    friends.insert_one(requestData)

    # send email to friend
    # msg = Message('New Friend Request!', recipients=[friend_email])
    # msg.html = '<p>You have a new friend request on SportLink! Check your friends list to accept or deny the request.</p>'
    # mail.send(msg)

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
    print(f"updating the request where the user is {friend_email} and the friend is {email}")
    friends.update_one({'user': friend_email, 'friend': email, 'status': 'pending'}, {'$set': {'status': 'friends'}})

    # add a new entry for the other user
    print(f"inserting a new entry where the user is {email} and the friend is {friend_email}")
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

    for freq in friends.find({'friend': curr_email, 'status': 'pending'}):
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

def user_lookup():
    search_term = request.args.get('searchTerm')
    matching_users = []
    for user in users.find({"$or": [{"username": search_term}, {"email": search_term}, {"phone": search_term}, {"firstName": search_term}, {"lastName": search_term}]}):
        matching_users.append({
            "id": str(user["_id"]),  
            "name": user.get("name"),
            "username": user.get("username"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName")
        })
    #print(f"Matching users: {matching_users}")
    return jsonify(matching_users), 200
    
def get_user_info():
    email = request.args.get('email')

    # Query the database for the user based on email
    user = users.find_one({"email": email})

    if user:
        # User found, return user information
        user_info = {
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "username": user.get("username"),
            "email": user.get("email"),
            "phoneNumber": user.get("phoneNumber"),
            "address": user.get("address"),
            "state": user.get("state"),
            "country": user.get("country"),
            "zipCode": user.get("zipCode"),
            "city": user.get("city"),
            "age": user.get("age"),
            "gender": user.get("gender"),
            "birthday": user.get("birthday")
        }
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

def get_user_info():
    email = request.args.get('email')

    # Query the database for the user based on email
    user = users.find_one({"email": email})

    if user:
        # User found, return user information
        user_info = {
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "username": user.get("username"),
            "email": user.get("email"),
            "phoneNumber": user.get("phoneNumber"),
            "address": user.get("address"),
            "state": user.get("state"),
            "country": user.get("country"),
            "zipCode": user.get("zipCode"),
            "city": user.get("city"),
            "age": user.get("age")
        }
        return jsonify(user_info), 200
    else:
        # User not found
        return jsonify({'message': 'User not found'}), 404


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
