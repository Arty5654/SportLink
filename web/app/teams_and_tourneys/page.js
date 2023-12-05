"use client";

import User from "@app/User";
import axios from 'axios';
import { useEffect, useState } from "react";
import "@styles/global.css";
import Link from "next/link";
import Switch from "react-switch";

const teamsNtourneys = () => {
  const [user, setUser] = useState(new User());

  // team stuff
  const [isModalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [publicTeam, setPublicTeam] = useState(true);
  const [maxTeamSize, setMaxTeamSize] = useState(0);
  const [selectedTeammates, setSelectedTeammates] = useState([]);
  const [friends, setFriends] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  //tourny stuff
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [sport, setSport] = useState('');
  const [teamCount, setTeamCount] = useState('');
  const [tournamentDuration, setTournamentDuration] = useState('');
  const [matchDuration, setMatchDuration] = useState('');
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [skillLevel, setSkillLevel] = useState('');
  const [location, setLocation] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [tournaments, setTournaments] = useState([]);


  const handleTournamentSubmit = async (e) => {
    e.preventDefault();
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + parseInt(countdownTimer));
    try {
        await axios.post('http://localhost:5000/create_tournament', {
            sport,
            teamCount,
            tournamentDuration,
            matchDuration,
            startTime,
            location,
            skillLevel,
            teamSize
        });
        alert('Tournament created successfully!');
        setIsTournamentModalOpen(false);
    } catch (error) {
        console.error('Error creating tournament:', error);
        alert('Failed to create tournament.');
    }
  };

  useEffect(() => {
    const fetchUserTournaments = async () => {
        const response = await axios.get(`http://localhost:5000/get_user_tournaments?email=${user.email}`);
        setTournaments(response.data); // Assuming this sets an array of tournament names
    };

    fetchUserTournaments();
}, [user.email]);

const tournamentsDisplay = tournaments.length > 0 
    ? (
        <ul>
            {tournaments.map((tournament, index) => (
                <li key={index}>
                    {tournament.name ? (
                        <Link href={`/teams_and_tourneys/tourneyDetails?id=${tournament.id}`}>
                            {tournament.name}
                        </Link>
                    ) : (
                        tournament // If it's just a string
                    )}
                </li>
            ))}
        </ul>
      ) 
    : <p>You are not a part of any tournaments!</p>;

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
    setPublicTeam(false);

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

    if (maxTeamSize < selectedTeammates.length + 1) {
      alert("Please make your team size larger!");
      return;
    }

    try {
        const response = axios.post('http://localhost:5000/create_team', {
          'name': teamName,
          'leader': user.email,
          'members': selectedTeammates,
          'size': selectedTeammates.length + 1,
          'maxSize': parseInt(maxTeamSize),
          'publicity': publicTeam
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
    var new_leader = "";
    console.log("leaving team ...")

    try {
      console.log("Leaving team: ", team.name)
      console.log("User: ", user.email)

      if (team.leader === user.username) {
        // prompt for new leader
        if (team.members.length === 0) {
          new_leader = "";
          alert("Since there are no other members of the team, it will be deleted.")
        } else {
          new_leader = prompt("Please choose a new leader from the current members: " + team.members);
        }
      } else {
        new_leader = "";
      }

      const response = axios.post('http://localhost:5000/leave_team', {
        'name': team.name,
        'user': user.email,
        'new_leader': new_leader
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
      <div className="w-full text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
          <h1 className="text-2xl font-semibold mb-4">Teams & Tournaments</h1>
          <div className="flex flex-row">
          <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">Your Teams</h2>
              <div className="flex flex-col px-2">
                {teams.length > 0 ? (
                teams.map((team, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-6 mb-4 cursor-pointer" onClick={() => openTeamModal(team)}>
                    <h2 className="text-lg font-semibold mb-2">{team.name}</h2>
                  </div>
                ))) : (
                  <p className="text-md text-gray-600 p-6 mb-2">You are not in any teams!</p>
                )}
              </div>

              <div className="flex justify-center items-center">
                <button className="bg-blue-500 text-white py-2 rounded-lg w-11/12" onClick={openModal}>Create Team</button>
              </div>

              <div className="flex justify-center items-center mt-4 flex items-center">
                  <button
                    className="bg-green-500 text-white py-2 rounded-lg w-11/12"
                    onClick={() => window.location.href = "/teams_and_tourneys/teams"}
                  >
                    View Public Teams
                  </button>
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
                            <h2 className="block text-sm font-medium text-gray-700">Choose Teammates</h2>
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

                          <div className="mt-4 flex items-center">
                            <h2 className="block text-sm font-medium text-gray-700">Public Team:</h2>
                            <Switch
                                className="ml-2"
                                checked={publicTeam}
                                onChange={(checked) => {
                                    console.log("changed team publicity to: " + !publicTeam);
                                    setPublicTeam(!publicTeam);
                                }}
                            />
                          </div>

                          <div className="mt-4 flex items-center">
                            <label htmlFor="teamName" className="w-1/4 block text-sm font-medium text-gray-700">Team Size</label>
                            <input
                                type="number"
                                id="teamCount"
                                className="w-3/4 border p-2 rounded-md"
                                value={maxTeamSize}
                                onChange={(e) => setMaxTeamSize(e.target.value)}
                            />
                          </div>

                          <div className="mt-4"/>

                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">Submit</button>
                      </form>
                      </div>
                  </div>
              )}
            </div>
            <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">Tournaments</h2>
              <div className="flex flex-col px-2">
    {tournaments.length > 0 ? (
        tournaments.map((tournament, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-6 mb-4 cursor-pointer">
                {tournament.name ? (
                    <Link href={`/teams_and_tourneys/tourneyDetails?id=${tournament.id}`}>
                        <h2 className="text-lg font-semibold mb-2">{tournament.name}</h2>
                    </Link>
                ) : (
                    <h2 className="text-lg font-semibold mb-2">{tournament}</h2> // If it's just a string
                )}
            </div>
        ))
    ) : (
        <p className="text-md text-gray-600 p-6 mb-2">You are not a part of any tournaments!</p>
    )}
</div>

              <div className="flex justify-center mb-4">
                <button onClick={() => setIsTournamentModalOpen(true)} className="bg-blue-500 text-white py-2 rounded-lg w-11/12">
                  Create Tournament
                </button>
              </div>

              <div className="flex justify-center items-center mt-4 flex items-center">
                <button
                  className="bg-green-500 text-white py-2 rounded-lg w-11/12"
                  onClick={() => window.location.href = "/teams_and_tourneys/tourneys"}
                >
                  View Tournaments
                </button>
              </div>
                {isTournamentModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 p-6">
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg float-right" onClick={() => setIsTournamentModalOpen(false)}>X</button>
                            <form onSubmit={handleTournamentSubmit} className="space-y-6">
                                {/* Tournament form fields... */}
                                <div>
                        <label htmlFor="sport" className="block text-lg font-semibold">Sport:</label>
                        <select
                            id="sport"
                            className="w-full border p-2 rounded-md"
                            value={sport}
                            onChange={(e) => setSport(e.target.value)}
                        >
                            <option value="">Select a Sport</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Soccer">Soccer</option>
                            <option value="Weightlifting">Weightlifting</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="teamCount" className="block text-lg font-semibold">Number of Teams:</label>
                        <input
                            type="number"
                            id="teamCount"
                            className="w-full border p-2 rounded-md"
                            value={teamCount}
                            onChange={(e) => setTeamCount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="teamSize" className="block text-lg font-semibold">Size of Team:</label>
                        <input
                            type="number"
                            id="teamSize"
                            className="w-full border p-2 rounded-md"
                            value={teamSize}
                            onChange={(e) => setTeamSize(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="tournamentDuration" className="block text-lg font-semibold">Tournament Duration (days):</label>
                        <input
                            type="number"
                            id="tournamentDuration"
                            className="w-full border p-2 rounded-md"
                            value={tournamentDuration}
                            onChange={(e) => setTournamentDuration(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="matchDuration" className="block text-lg font-semibold">Match Duration (minutes):</label>
                        <input
                            type="number"
                            id="matchDuration"
                            className="w-full border p-2 rounded-md"
                            value={matchDuration}
                            onChange={(e) => setMatchDuration(e.target.value)}
                        />
                    </div>

                    {/* Location field */}
                    <div>
                                <label htmlFor="location" className="block text-lg font-semibold">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="w-full border p-2 rounded-md"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter location"
                                />
                            </div>

                            {/* Skill level selection */}
                            <div>
                                <label htmlFor="skillLevel" className="block text-lg font-semibold">Skill Level:</label>
                                <select
                                    id="skillLevel"
                                    className="w-full border p-2 rounded-md"
                                    value={skillLevel}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                >
                                    <option value="">Select Skill Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                    <div>
                      
                      <label htmlFor="countdownTimer" className="block text-lg font-semibold">Countdown Timer (minutes):</label>
                    <input
                      type="number"
                      id="countdownTimer"
                      className="w-full border p-2 rounded-md"
                      value={countdownTimer}
                      onChange={(e) => setCountdownTimer(e.target.value)}
                    />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">Create Tournament</button>
                    </form>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default teamsNtourneys;
