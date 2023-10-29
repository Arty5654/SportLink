from flask import jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv
import os

MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['group21']
events = db["tempEvents"]

load_dotenv()


def get_events():
  event_data = list(events.find())

  # Convert ObjectId to string within the event data
  for event in event_data:
      event['_id'] = str(event['_id'])

  # Return the modified event data as JSON
  return jsonify(event_data), 200


