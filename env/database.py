from dotenv import load_dotenv # pip install python-dotenv
import json # no install

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
fs = GridFS(db)
history = db["eventHistory"]