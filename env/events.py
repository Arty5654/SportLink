from flask import jsonify
from dotenv import load_dotenv  # pip install python-dotenv
from pymongo import MongoClient  # pip install pymogo
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
eventHistory = db["eventHistory"]


# Route to get event details 
def join(eventID, username, event_data, team_green, team_blue):
    for event in event_data:
        if eventID == str(event["_id"]):  # Compare as strings
            # Check if the event is open for joining
            if event["currentParticipants"] < event["maxParticipants"]:
                # Add the username to the participants array
                #event["participants"].append(username)
                event["currentParticipants"] += 1

                event["teamBlue"] = team_blue
                event["teamGreen"] = team_green

                events.update_one({"_id": event["_id"]}, {
                    "$set": {"participants": event["participants"], "currentParticipants": event["currentParticipants"],
                             "teamBlue": event["teamBlue"], "teamGreen": event["teamGreen"]}})
                return jsonify({"message": "Event joined successfully"}), 200
            else:
                return jsonify({"message": "The event is full. You cannot join at the moment."}), 400

        # return jsonify({"message": "Event not found."}), 404


# Route to leave an event if the user has joined it
def leave(eventID, username, event_data):
    for event in event_data:
        if eventID == str(event["_id"]):  # Compare as strings
            # Remove participant object
            event["participants"] = [participant for participant in event["participants"] if not (isinstance(participant, dict) and participant.get("username") == username)]
            event["currentParticipants"] = len(event["participants"])

            # Remove from teamBlue if present
            if username in event.get("teamBlue", []):
                event["teamBlue"].remove(username)

            # Remove from teamGreen if present
            if username in event.get("teamGreen", []):
                event["teamGreen"].remove(username)

            # Update the event in the database
            events.update_one({"_id": event["_id"]}, {
                "$set": {
                    "participants": event["participants"],
                    "currentParticipants": event["currentParticipants"],
                    "teamBlue": event["teamBlue"],
                    "teamGreen": event["teamGreen"]
                }
            })
            return jsonify({'message': 'Deleted User from event'}), 200



# Route to get all events associated with a user
def get_details(eventID, event_data):
    for event in event_data:
        if str(eventID) == str(event["_id"]):
            # Extract participants with username and join_date
            participants = [{"username": p["username"], "join_date": p["join_date"]} if isinstance(p, dict) else p for p in event["participants"]]
            
            event_info = {
                "title": event["title"],
                "desc": event["desc"],
                "address": event["address"],
                "lat": event["lat"],
                "lng": event["lng"],
                "open": event["open"],
                "sport": event["sport"],
                "level": event["level"],
                "currentParticipants": event["currentParticipants"],
                "maxParticipants": event["maxParticipants"],
                "participants": participants,
                "eventOwner": event["eventOwner"],
                "town": event["town"],
                "end": event["end"],
                "teamGreen": event["teamGreen"],
                "teamBlue": event["teamBlue"]
            }
            break

    return jsonify(event_info), 200


def edit_event(event_id, event_data):
    for event in event_data:
        if str(event_id) == str(event["_id"]):
            events.update_one({"_id": event["_id"]}, {"$set": data})

    return jsonify({"message": "Event details updated successfully"}), 200


# Route to join a user to an event
def get_all(email):
    # Get the email from the query parameters
    email = request.args.get('email')

    # Filter events based on the user's email
    user_events = [
        {
            "title": event['title'],
            "sport": event['sport'],
            "city": event['city'],
            "desc": event['desc'],
            "level": event['level'],
            "open": event['open'],
            "currentParticipants": event['currentParticipants'],
            "maxParticipants": event['maxParticipants'],
            "participants": event['participants'],
            "end": event["end"]
        }
    ]

    if user_events:
        return jsonify(user_events), 200
    else:
        return "User not found or no events for this user!", 404


def get_my(event_data, username):
    user_events = []

    for event in event_data:
        event['_id'] = str(event['_id'])

    for event in event_data:
        participants = event.get("participants", [])  # Ensure participants is a list
        for participant in participants:
            if isinstance(participant, dict) and participant.get("username") == username:
                user_events.append(event)
                break  # Break the inner loop once the user is found in this event

    # Return the modified event data as JSON
    return jsonify(user_events), 200


# Route to get the event history of a user
def get_history(username, event_history, event_data):
    user_event_history = {}
    user_events = []

    for record in event_history:
        if record["user"] == username:
            # Use .get() to safely access join_date
            print("here")
            user_event_history[record["event"]] = record.get("join_date")

    for event in event_data:
        event_dict = dict(event)
        event_dict['_id'] = str(event['_id'])
        event_id = str(event['_id'])
        if event_id in user_event_history:
            # Safely assign join_date if it exists
            event_dict['join_date'] = user_event_history.get(event_id)
            user_events.append(event_dict)

    return jsonify(user_events), 200





# Route to add an event to the user's history
def add_history(event, user):
    event_entry = {
        "user": user,
        "event": event,
    }
    eventHistory.insert_one(event_entry)

    return jsonify({'message': 'Added to History'}), 200


# Route to delete an event from the user's history
def delete_history(event, user):
    event_entry = {
        "user": user,
        "event": event,
    }
    eventHistory.delete_one(event_entry)

    return jsonify({'message': 'Deleted History'}), 200