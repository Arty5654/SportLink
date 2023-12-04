"use client";
import React, { useEffect, useState } from "react";
import "./creating.css";
import axios from "axios";
import User from "@app/User";
import Autocomplete from "react-google-autocomplete";
const apiKey = "AIzaSyB3DAFbqW_2DHh4yBuvUeIbk5Xp_bQYnXc";
import { useRouter } from "next/navigation";

const CreatePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(new User());
  const [friends, setFriends] = useState([]);
  const [checkedFriends, setCheckedFriends] = useState({});
  const [currentParticipants, setCurrentParticipants] = useState(1);
  const [teamGreen, setTeamGreen] = useState([]); // Renamed from teamRed
  const [teamBlue, setTeamBlue] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [skillLevel, setSkillLevel] = useState("Any");

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

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser) {
      // If user is not logged in, redirect to the sign-in page
      router.push("/signin");
    } else {
      setUser(currentUser);
      // ... rest of your useEffect logic
    }
  }, [router]);

  useEffect(() => {
    if (user["email"]) {
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
          setCheckedFriends({ ...checkedFriends, [user.email]: true });
          setParticipants((prevParticipants) => [...prevParticipants, user.email]);
        })
        .catch((error) => {
          console.error("Error making the API call:", error);
        });
    }
  }, [user]);

  const handleCheckboxChange = (friendId, friendEmail, isChecked) => {
    setCurrentParticipants(currentParticipants + 1);

    setCheckedFriends({ ...checkedFriends, [friendId]: isChecked });

    if (isChecked) {
      setParticipants([...participants, friendEmail]);
    } else {
      setCurrentParticipants(currentParticipants - 1);
      setTeamGreen((prev) => prev.filter((email) => email !== friendEmail));
      setTeamBlue((prev) => prev.filter((email) => email !== friendEmail));
      setParticipants((prev) => prev.filter((email) => email !== friendEmail));
    }
  };

  const handleTeamSelect = (event, friendId, friendEmail) => {
    if (!checkedFriends[friendId]) return;

    const team = event.target.value;
    if (team === "green") {
      setTeamGreen((prev) => [...prev, friendEmail]);
      setTeamBlue((prev) => prev.filter((email) => email !== friendEmail));
    } else if (team === "blue") {
      setTeamBlue((prev) => [...prev, friendEmail]);
      setTeamGreen((prev) => prev.filter((email) => email !== friendEmail));
      console.log("blue");
    } else {
      setTeamBlue((prev) => prev.filter((email) => email !== friendEmail));
      setTeamGreen((prev) => prev.filter((email) => email !== friendEmail));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSkill = (event) => {
    setSkillLevel(event.target.value);
  };

  const handleSelect = (place) => {
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

  const handleSubmit = () => {
    if (
      teamData["sport"] === "" ||
      teamData.locationDetails.lat === "" ||
      teamData.locationDetails.lng === ""
    ) {
      return;
    }

    // Check that each participant is on a team
    const allParticipantsOnTeam = participants.every(
      (participant) => teamGreen.includes(participant) || teamBlue.includes(participant)
    );

    if (!allParticipantsOnTeam) {
      alert("Please ensure all participants are assigned to a team.");
      return;
    }

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
        participants: participants,
        level: skillLevel,
        eventOwner: user.email,
        town: teamData.locationDetails.town,
        end: false,
        teamBlue: teamBlue,
        teamGreen: teamGreen,
      })
      .then((response) => {
        console.log("Data received:", response.data);
        router.push("/");
      })
      .catch((error) => {
        console.error("Error making the API call:", error);
      });
  };

  return (
    <div>
      <div className="event-title-container">
        <div className="event-title">
          Create an Event
          {/* SVG for sports icon */}
        </div>
      </div>

      <div className="team-container">
        <div className="team-card green-team">
          <h3 className="team-title">Team Green</h3>
          {teamGreen.map((member, index) => (
            <p key={index} className="team-member">
              {member}
            </p>
          ))}
        </div>

        <div className="team-card blue-team">
          <h3 className="team-title">Team Blue</h3>
          {teamBlue.map((member, index) => (
            <p key={index} className="team-member">
              {member}
            </p>
          ))}
        </div>
      </div>

      <div className="friends-list-container">
        <h2 className="friends-list-title">Potential Participants</h2>
        <ul className="friends-list">
          {/* Include the current user */}
          <li className="friend-item">
            <div className="friend-email">You: {user.email}</div>
            <div>
              Participating:
              <input
                type="checkbox"
                checked={checkedFriends[user.email] || false}
                onChange={(e) =>
                  handleCheckboxChange(user.email, user.email, e.target.checked)
                }
                disabled={true}
              />
            </div>
            <div>
              <select
                className="team-select"
                disabled={!checkedFriends[user.email]}
                onChange={(e) => handleTeamSelect(e, user.email, user.email)}
              >
                <option value="">Select Team</option>
                <option value="green">Team Green</option>
                <option value="blue">Team Blue</option>
              </select>
            </div>
          </li>
          {/* List of friends */}
          {friends.map((friend) => (
            <li key={friend._id} className="friend-item">
              <div className="friend-email">Username: {friend.friend}</div>
              <div>
                Participating:
                <input
                  type="checkbox"
                  checked={checkedFriends[friend._id] || false}
                  onChange={(e) =>
                    handleCheckboxChange(friend._id, friend.friend, e.target.checked)
                  }
                />
              </div>
              <div>
                <select
                  className="team-select"
                  disabled={!checkedFriends[friend._id]}
                  onChange={(e) => handleTeamSelect(e, friend._id, friend.friend)}
                >
                  <option value="">Select Team</option>
                  <option value="green">Team Green</option>
                  <option value="blue">Team Blue</option>
                </select>
              </div>
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
              apiKey={apiKey} // Replace with your actual API key
              onPlaceSelected={handleSelect}
              placeholder="Enter a location"
              required={true}
              options={{
                types: ["establishment"],
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
