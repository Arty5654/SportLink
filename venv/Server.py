import connexion
import redis
from flask import Flask, jsonify, request

# Connect to redis instance
r = redis.Redis(host='localhost', port=6379, db=0)
# Create Server
app = Flask(__name__)
def create_event(event):
    event_id = r.incr('event_id')
    location = event['location']

    r.hmset(f'event:{event_id}', {
        'users': ','.join(event['users']),
        'sport': event['sport'],
        'max_users': event['max_users'],
        'location': event['location']
    })
    r.rpush(f'location:{location}:events', event_id)


def get_events(location):
    # Retrieve all event ids from the list for this location
    event_ids = r.lrange(f'location:{location}:events', 0, -1)
    events = []
    for event_id in event_ids:
        events.append(r.hgetall(f'event:{event_id.decode()}'))

    return jsonify(events)

def join_event(body):
    event_name = body.get('event_name')
    user_list = body.get('user_list')
    location = body.get('location')

    event_ids = r.lrange(f'location:{location}:events', 0, -1)

    for event_id in event_ids:
        event_data = r.hgetall(f'event:{event_id.decode()}')
        if event_data.get(b'event_name') == event_name.encode():
            # If the event is found, add the user to the 'users' field of the event hash
            current_users = event_data.get(b'users').decode().split(',')
            current_users.append(user_list)
            r.hset(f'event:{event_id.decode()}', 'users', ','.join(current_users))
            return "User joined event successfully!", 200

    return "Event not found!", 404

def create_team(team):
    team_id = r.incr('team_id')  # Generating a new team id
    team_name = team.get('team_name')

    # Storing the team data as a hash in Redis
    r.hmset(f'team:{team_id}', {
        'users': ','.join(team['users']),
        'team_name': team_name,
        'location': team['location'],
        'sport': team['sport']
    })

    # Add the team_id to the list for this location
    location = team['location']
    r.rpush(f'location:{location}:teams', team_id)

    return "Team created successfully!", 201

def get_teams(location):
    # Retrieve all event ids from the list for this location
    team_ids = r.lrange(f'location:{location}:teams', 0, -1)
    teams = []
    for team_id in team_ids:
        teams.append(r.hgetall(f'event:{team_id.decode()}'))

    return jsonify(teams)

def join_team(body):
    team_name = body.get('team_name')
    user = body.get('user')
    location = body.get('location')
    team_ids = r.lrange(f'location:{location}:teams', 0, -1)

    for team_id in team_ids:
        team_data = r.hgetall(f'team:{team_id.decode()}')
        if team_data.get(b'team_name') == team_name.encode():
            # If the team is found, add the user to the 'users' field of the team hash

            current_users = team_data.get(b'users').decode().split(',')
            max_users = team_data.get(b'max_users')

            if len(current_users) < max_users:
                current_users.append(user)
                r.hset(f'team:{team_id.decode()}', 'users', ','.join(current_users))
                return "User joined team successfully!", 200
            else:
                return "Team is filled!", 406


    return "Server Error", 404


app = connexion.App(__name__, specification_dir='.')
app.add_api('swagger.yaml')

if __name__ == '__main__':
    app.run(port=8080)