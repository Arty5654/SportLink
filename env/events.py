from flask import jsonify
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


# Route to get event details 
def join (eventID, username, event_data):
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

    # return jsonify({"message": "Event not found."}), 404

# Route to leave an event if the user has joined it
def leave(eventID, username, event_data):
  for event in event_data:
    if eventID == str(event["_id"]):  # Compare as strings
      event["participants"].remove(username)
      event["currentParticipants"] -= 1
      events.update_one({"_id": event["_id"]}, {"$set": {"participants": event["participants"], "currentParticipants": event["currentParticipants"]}})
      return jsonify({'message': 'Deleted User from event'}), 200


# Route to get all events associated with a user
def get_details(eventID, event_data):
  for event in event_data:
    if str(eventID) == str(event["_id"]):
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
        "participants": event["participants"],
        "eventOwner": event["eventOwner"],
        "town": event["town"]
      }
      break

  return jsonify(event_info), 200

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
      "participants": event['participants']
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
      if username in event["participants"]:
          user_events.append(event)

  # Return the modified event data as JSON
  return jsonify(user_events), 200



# Route to get the event history of a user
def get_history(username, event_history, event_data):
  user_event_history = []
  user_events = []

  for record in event_history:
    if record["user"] == username:
      user_event_history.append(record["event"])

  for event in event_data:
    event_dict = dict(event)
    event_dict['_id'] = str(event['_id'])
    if str(event['_id']) in user_event_history:
      user_events.append(event_dict)

  return jsonify(user_events), 200

# Route to add an event to the user's history
def add_history(event, user):
  event_entry = {
      "user": user,
      "event": event,
  }
  history.insert_one(event_entry)

  return jsonify({'message': 'Added to History'}), 200

# Route to delete an event from the user's history
def delete_history(event, user):    
  event_entry = {
      "user": user,
      "event": event,
  }
  history.delete_one(event_entry) 

  return jsonify({'message': 'Deleted History'}), 200

