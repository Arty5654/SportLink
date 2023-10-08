from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

MONGO_URI="mongodb+srv://group21:turkstra@sportlinkcluster.tjcbtxj.mongodb.net/?retryWrites=true&w=majority"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['group21']
users = db["users"]







if __name__ == '__main__':
    app.run(debug=True)
