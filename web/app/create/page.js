"use client";
import React, { useEffect, useState } from "react";
import "./creating.css";
import axios from "axios";
import User from "@app/User";
import Autocomplete from "react-google-autocomplete";

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

export default createPage;
