"use client";

import User from "@app/User";
import axios from 'axios';
import { useEffect, useState } from "react";
import Sidebar from "@components/profileSidebar";
import "@styles/global.css";

const teamsNtourneys = () => {
  const [user, setUser] = useState(new User());
  const [isModalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedTeammates, setSelectedTeammates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);

    const fetchData = async () => {
        try {
          var curr_email = user1.email;
          console.log("Getting teams for user:", curr_email)
          const response = await axios.get(`http://localhost:5000/get_teams?email=${curr_email}`);

          // only set teams if the data array is not empty
          if (response.data.length > 0) {
            console.log("Teams: ", response.data)
            setTeams(response.data);
          } else {
            console.log("No teams found\n")
            console.log("Response: ", response.data)

          }
        } catch (error) {
          console.error('Error getting teams', error);
        }
    }

    fetchData(); // Call the async function here
  }, []);

  // Add this function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const selectedEmail = event.target.value;
    console.log("Selected Email: ", selectedEmail)

    if (event.target.checked) {
        setSelectedTeammates([...selectedTeammates, selectedEmail]);
    } else {
        setSelectedTeammates(selectedTeammates.filter((email) => email !== selectedEmail));
    }
  };

  const openModal = () => {
    setModalOpen(true);

    const fetchData = async () => {
        try {
          var curr_email = user.email;
          console.log("Getting friends for user:", curr_email)
          const response = await axios.get(`http://localhost:5000/get_friends?email=${curr_email}`);

          // only set friends if the data array is not empty
          if (response.data.length > 0) {
            setFriends(response.data);
          }
        } catch (error) {
          console.error('Error getting friends', error);
        }
    }

    fetchData(); // Call the async function here
  };

  const closeModal = () => {
    setTeamName("");
    setSelectedTeammates([]);
    setModalOpen(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (teamName.trim() === "") {
      alert("Please enter a team name.");
      return;
    }
    console.log("Team Name: ", teamName);
    console.log("Selected Teammates: ", selectedTeammates);

    try {
        const response = axios.post('http://localhost:5000/create_team', {
            'name': teamName,
            'members': selectedTeammates,
            'leader': user.email
        });

        response.then((response) => {
            console.log("request responded");

            if (response.status === 200) {
                console.log("Team created");
                alert("Team created!")
                setTeamName("");
                setSelectedTeammates([]);
                closeModal();
                window.location.reload();
            }
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              console.log("Team name already exists");
              alert("Sorry, this team name is already available. Please try again.");
            }
          }
        });
    } catch (error) {
        console.error('Error creating team', error);
    }
  };

  const openTeamModal = (team) => {
    setCurrentTeam(team);
    setIsTeamModalOpen(true);
  };

  const handleLeaveTeam = (team) => {
    try {
      console.log("Leaving team: ", team.name)
      console.log("User: ", user.email)

      const response = axios.post('http://localhost:5000/leave_team', {
        'name': team.name,
        'user': user.email
      });

      response.then((response) => {
        console.log("request responded");

        if (response.status === 200) {
          console.log("Team left");
          alert("Team left!")
          setIsTeamModalOpen(false);
          window.location.reload();
        }
      }).catch((error) => {
        console.error('Error leaving team', error);
      });
    } catch (error) {
      console.error('Error leaving team', error);
    }
  };

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);
  }, []);

  return (
    <div className="w-full flex pb-64">
      <div className="w-1/4">
          <Sidebar active="teams_and_tourneys"/>
      </div>
      <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
          <h1 className="text-2xl font-semibold mb-4">Teams & Tournaments</h1>
          <div className="flex flex-row">
          <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">Your Teams</h2>
              <div className="flex flex-col px-2">
              {teams.map((team, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-6 mb-4 cursor-pointer" onClick={() => openTeamModal(team)}>
                  <h2 className="text-lg font-semibold mb-2">{team.name}</h2>
                </div>
              ))}
              </div>

              <div className="flex justify-center items-center">
              <button className="bg-blue-500 text-white py-2 rounded-lg w-11/12" onClick={openModal}>Create Team</button>
              </div>

              {isTeamModalOpen && currentTeam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 p-6">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg float-right" onClick={() => setIsTeamModalOpen(false)}>X</button>
                    <h1 className="text-2xl font-semibold mb-4">{currentTeam.name}</h1>
                    <p className="text-sm text-gray-600">Leader: {currentTeam.leader}</p>
                    <p className="text-sm text-gray-600">Members:</p>
                    <ul className="list-disc list-inside">
                      {currentTeam.members.map((member, index) => (
                        <li key={index} className="text-sm text-gray-600">{member}</li>
                      ))}
                    </ul>
                    <button className="bg-red-500 text-white py-2 rounded-lg w-full mt-4" onClick={() => handleLeaveTeam(currentTeam)}>Leave Team</button>
                  </div>
                </div>
              )}

              {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 p-6">
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg float-right" onClick={closeModal}>X</button>
                      <form onSubmit={handleFormSubmit}>
                          <h1 className="text-2xl font-semibold mb-4">Create Team</h1>
                          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</label>
                          <input
                              type="text"
                              className="w-full border mt-1 p-2 rounded-md"
                              placeholder="Enter Team Name"
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                          />

                          <div className="mt-4">
                          <h2 className="text-lg font-semibold mb-2">Choose Teammates</h2>
                          {friends.map((curr_user, index) => (
                              <div key={index}>
                              <input
                                  type="checkbox"
                                  id={`friend-${index}`}
                                  value={curr_user.friend}
                                  checked={selectedTeammates.includes(curr_user.friend)}
                                  onChange={handleCheckboxChange}
                              />
                              <label htmlFor={`friend-${index}`} className="ml-2">{curr_user.friend}</label>
                              </div>
                          ))}
                          </div>

                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Submit</button>
                      </form>
                      </div>
                  </div>
              )}
            </div>
            <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">Tournaments</h2>
            </div>
          </div>
        </div>
    </div>
  );
}

export default teamsNtourneys;
