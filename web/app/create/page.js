"use client";
import React, { useEffect, useState } from "react";
import "./creating.css";
import axios from "axios";

import User from "@app/User";
import Autocomplete from "react-google-autocomplete";

const CreatePage = () => {
    const [user, setUser] = useState(new User());
    const [friends, setFriends] = useState([]);
    const [checkedFriends, setCheckedFriends] = useState({});
    const [teamRed, setTeamRed] = useState([]);
    const [teamBlue, setTeamBlue] = useState([]);
    const [skillLevel, setSkillLevel] = useState('Any');

    const [teamData, setTeamData] = useState({
        title: "",
        desc: "",
        locationDetails: {
            address: "",
            lat: null,
            lng: null,
            town: ""
        },
        open: true,
        sport: "",
        maxParticipants: 0,
    });

    useEffect(() => {
        const currentUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(currentUser);
    }, []);

    useEffect(() => {
        if (user['email']) {
            axios.post('http://localhost:5000/fetch_friends', {
                email: user['email']
            })
                .then(response => {
                    setFriends(response.data.friends);
                    console.log('Data received:', response.data);
                    const initialCheckedState = response.data.friends.reduce((acc, friend) => {
                        acc[friend._id] = false;
                        return acc;
                    }, {});
                    setCheckedFriends(initialCheckedState);
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
        }
    }, [user]);

    const handleCheckboxChange = (friendId, friendEmail) => {
        setCheckedFriends({ ...checkedFriends, [friendId]: !checkedFriends[friendId] });
    };

    const handleTeamSelect = (event, friendId, friendEmail) => {
        const team = event.target.value;
        if (team === 'red') {
            setTeamRed(prev => [...prev, friendEmail]);
            setTeamBlue(prev => prev.filter(email => email !== friendEmail));
        } else if (team === 'blue') {
            setTeamBlue(prev => [...prev, friendEmail]);
            setTeamRed(prev => prev.filter(email => email !== friendEmail));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSkill = (event) => {
        setSkillLevel(event.target.value);
    };

    const handleSelect = (place) => {
        setTeamData(currentTeamData => ({
            ...currentTeamData,
            locationDetails: {
                address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                town: place.address_components[2].short_name
            }
        }));
    };

    const handleSubmit = () => {
        if (teamData['sport'] === "" || teamData.locationDetails.lat === "" || teamData.locationDetails.lng === "") {
            return;
        }

        axios.post('http://localhost:5000/create', {
            ...teamData,
            currentParticipants: teamRed.length + teamBlue.length,
            participants: { red: teamRed, blue: teamBlue },
            level: skillLevel,
            eventOwner: user.email,
        })
            .then(response => {
                console.log('Data received:', response.data);
            })
            .catch(error => {
                console.error('Error making the API call:', error);
            });
    }

    return (
        <div>

            <div className="event-title-container">
                <div className="event-title">
                    Create an Event
                    <svg className="sports-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <path d="M7 12c0-2.76 2.24-5 5-5 1.45 0 2.75.78 3.54 1.94l-1.35..." />
                    </svg>
                </div>
            </div>


            <div className="team-container">
                <div className="team-card red-team">
                    <h3 className="team-title">Team Red</h3>
                    {teamRed.map((member, index) => (
                        <p key={index} className="team-member">{member}</p>
                    ))}
                </div>

                <div className="team-card blue-team">
                    <h3 className="team-title">Team Blue</h3>
                    {teamBlue.map((member, index) => (
                        <p key={index} className="team-member">{member}</p>
                    ))}
                </div>
            </div>

            <div className="friends-list-container">
                <h2 className="friends-list-title">Friends List</h2>
                <ul className="friends-list">
                    {friends.map(friend => (
                        <li key={friend._id} className="friend-item">
                            <div className="friend-email">Email: {friend.friend}</div>

                            <select
                                className="team-select"
                                onChange={(e) => handleTeamSelect(e, friend._id, friend.friend)}>
                                <option value="">Select Team</option>
                                <option value="red">Team Red</option>
                                <option value="blue">Team Blue</option>
                            </select>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="team-container">
                <div className="team-card">
                    <input type="text" name="title" placeholder="Title" onChange={handleChange} />
                    <textarea name="desc" placeholder="Description" onChange={handleChange}></textarea>

                    <label>
                        Location:
                        <Autocomplete
                            apiKey={"YOUR_API_KEY"}
                            onPlaceSelected={handleSelect}
                            placeholder="Enter a location"
                            required={true}
                            options={{
                                types: ['establishment'],
                            }}
                        />
                    </label>

                    <label>
                        Open:
                        <input type="checkbox" name="open" checked={teamData.open} onChange={() => setTeamData(prevState => ({ ...prevState, open: !prevState.open }))} />
                    </label>

                    <select name="sport" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Select a sport</option>
                        <option value="Soccer">Soccer</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Weightlifting">Weightlifting</option>
                    </select>

                    <div>
                        Current Participants: {teamRed.length + teamBlue.length}
                    </div>
                    <input type="number" name="maxParticipants" placeholder="Max Participants" onChange={handleChange} />

                    <div>
                        <label htmlFor="skill-level">Skill Level:</label>
                        <select id="skill-level" value={skillLevel} onChange={handleSkill}>
                            <option value="Any">Any</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button onClick={handleSubmit}>Create Event</button>
                </div>
            </div>
        </div>
    );
}
const apiKey = "AIzaSyB3DAFbqW_2DHh4yBuvUeIbk5Xp_bQYnXc";

const createPage = () => {
  const [user, setUser] = useState(new User());
  const [friends, setFriends] = useState([]);
  const [checkedFriends, setCheckedFriends] = useState({});
  const [currentParticipants, setCurrentParticipants] = useState(1);
  const [participants, setParticipants] = useState([]); // New state to track participants' email
  const [value, setValue] = useState(1); // Initial value for the slider

  const [location, setLocation] = useState({
    address: "",
    lat: null,
    lng: null,
  }); // for each event's map

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (user["email"] !== undefined) {
      axios
        .post("http://localhost:5000/fetch_friends", {
          email: user["email"],
        })
        .then((response) => {
          setFriends(response.data.friends);
          console.log("Data received:", response.data);
          const initialCheckedState = response.data.friends.reduce((acc, friend) => {
            acc[friend._id] = false;
            return acc;
          }, {});
          setCheckedFriends(initialCheckedState);
        })
        .catch((error) => {
          console.error("Error making the API call:", error);
        });
    }
  }, [user]);
  useEffect(() => {
    if (user["email"] !== undefined) {
      setParticipants([...participants, user["email"]]);
    }
  }, [user]);
  const [selected, setSelected] = useState("team"); // 'team' or 'event'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevState) => ({ ...prevState, [name]: value }));
  };
  const [skillLevel, setSkillLevel] = useState("Any");

  const handleSkill = (event) => {
    setSkillLevel(event.target.value);
  };

  const handleSelect = (place) => {
    console.log(place);
    setTeamData((currentTeamData) => ({
      ...currentTeamData,
      locationDetails: {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        town: place.address_components[2].short_name,
      },
    }));
  };

  const [teamData, setTeamData] = useState({
    title: "",
    desc: "",
    locationDetails: {
      address: "",
      lat: null,
      lng: null,
      town: "",
    },
    open: true,
    sport: "",
    maxParticipants: 0,
  });
  const handleCheckboxChange = (friendId, friendEmail) => {
    const updatedState = { ...checkedFriends, [friendId]: !checkedFriends[friendId] };

    // Directly set the updated state without a function callback
    setCheckedFriends(updatedState);

    // Update current participants count and participants' email list outside the setState callback
    if (updatedState[friendId]) {
      setCurrentParticipants(currentParticipants + 1);
      setParticipants([...participants, friendEmail]);
    } else {
      setCurrentParticipants(currentParticipants - 1);
      setParticipants(participants.filter((email) => email !== friendEmail));
    }
  };

  const handleSubmit = () => {
    console.log(teamData.locationDetails);

    if (teamData["sport"] === "") {
      return;
    }

    if (teamData.locationDetails.lat === "" || teamData.locationDetails.lng === "") {
      return;
    }

    console.log(teamData);
    axios
      .post("http://localhost:5000/create", {
        title: teamData["title"],
        desc: teamData["desc"],
        address: teamData.locationDetails.address,
        lat: teamData.locationDetails.lat,
        lng: teamData.locationDetails.lng,
        open: teamData["open"],
        sport: teamData["sport"],
        currentParticipants: parseInt(currentParticipants),
        maxParticipants: parseInt(teamData["maxParticipants"]),
        type: selected,
        participants: participants,
        level: skillLevel,
        eventOwner: user.email,
        town: teamData.locationDetails.town,
        end: false,
      })
      .then((response) => {
        console.log("Data received:", response.data);
      })
      .catch((error) => {
        console.error("Error making the API call:", error);
      });
  };

  return (
    <div>
      <div
        className={`switch-container ${
          selected === "team" ? "team-selected" : "event-selected"
        }`}
      >
        <div className="switch-option" onClick={() => setSelected("team")}>
          Create a Team
        </div>
        <div className="switch-option" onClick={() => setSelected("event")}>
          Create an Event
        </div>
      </div>
      <div>
        <h2>Friends List</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend._id}>
              <div>Email: {friend.friend}</div>
              <input
                type="checkbox"
                checked={checkedFriends[friend._id] || false}
                onChange={() => handleCheckboxChange(friend._id, friend.friend)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={"team-container"}>
        <div className="team-card">
          <input type="text" name="title" placeholder="Title" onChange={handleChange} />
          <textarea name="desc" placeholder="Description" onChange={handleChange}></textarea>

          <label>
            Location:
            <Autocomplete
              apiKey={apiKey}
              onPlaceSelected={handleSelect}
              placeholder="Enter a location"
              required={true}
              options={{
                types: ["establishment"], // This will suggest specific addresses
              }}
            />
          </label>

          <label>
            Open:
            <input
              type="checkbox"
              name="open"
              checked={teamData.open}
              onChange={() =>
                setTeamData((prevState) => ({ ...prevState, open: !prevState.open }))
              }
            />
          </label>

          <select
            name="sport"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select a sport</option>
            <option value="Soccer">Soccer</option>
            <option value="Tennis">Tennis</option>
            <option value="Basketball">Basketball</option>
            <option value="Weightlifting">Weightlifting</option>
          </select>

          <div>Current Participants: {currentParticipants}</div>
          <input
            type="number"
            name="maxParticipants"
            placeholder="Max Participants"
            onChange={handleChange}
          />
          <div>
            <label htmlFor="skill-level">Skill Level:</label>
            <select id="skill-level" value={skillLevel} onChange={handleSkill}>
              <option value="Any">Any</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <button onClick={handleSubmit}>Create Event</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
