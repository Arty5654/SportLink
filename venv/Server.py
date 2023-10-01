import connexion



def create_event(event):


def get_events():

def create_team(team):

def join_team(team):

app = connexion.App(__name__, specification_dir='.')
app.add_api('openapi.yaml')

if __name__ == '__main__':
    app.run(port=8080)