"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";
import LeaveTournamentButton from "@components/LeaveTournamentButton";



const TournamentDetails = () => {
  const [user, setUser] = useState(new User());
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isJoinTournamentModalOpen, setIsJoinTournamentModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [maxTeamsAllowed, setMaxTeamsAllowed] = useState(0);
  const [maxTeamSize, setMaxTeamSize] = useState(0);
  const [userTeams, setUserTeams] = useState([])
  const [tournament, setTournament] = useState({
    sport: "",
    teamCount: "",
    duration: 0,
    matchDuration: "",
    teams: [],
    isFull: false,
    startTime: "",
    skillLevel: "",
    location: "",
    teamSize: ""
  });

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
  };

  const pickWinner = (team, team2) => {
    // if one of the teams is a bye, then the other team automatically wins and if both are byes then just return
    if (team.includes("BYE") && !team2.includes("BYE")) {
      winner = team2;
      loser = team;
      return;
    } else if (team2.includes("BYE") && !team.includes("BYE")) {
      winner = team;
      loser = team2;
      return;
    } else if (team.includes("BYE") && team2.includes("BYE")) {
      console.log("Both teams are byes")
      alert("Both teams are byes, auto updating to next round")
      window.location.reload();
      return;
    }

    var teams = team + ", " + team2;
    var winner = prompt("Let us know who won: " + teams);
    var loser = "";

    if (winner == "") {
      alert("Please pick from one of the teams");
      pickWinner(team, team2);
    } else if (winner != team && winner != team2) {
      alert("Please make sure you enter the name correctly");
      pickWinner(team, team2);
    }

    if (winner == team) {
      loser = team2;
    } else if (winner == team2) {
      loser = team;
    }

    console.log("winner", winner);
    console.log("loser", loser);
    console.log("tournamentId", tournament.objectID)
    var response = axios.post('http://localhost:5000/tourney_game_winner', {
      'tournamentId': tournament.objectID,
      'winner': winner,
      'loser': loser
    });

    window.location.reload();
  };

  useEffect(() => {
    // Set the current user from session storage
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  useEffect(() => {
    // Manually parse the URL to get the tournament ID
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    if (tournamentId) {
      const fetchTournamentDetails = async () => {
        try {
          const detailsResponse = await axios.get(`http://localhost:5000/get_tournament_details?id=${tournamentId}`);
          const tournamentData = ({
            objectID: detailsResponse.data._id,
            sport: detailsResponse.data.sport,
            teamCount: detailsResponse.data.teamCount,
            tournamentDuration: detailsResponse.data.tournamentDuration,
            matchDuration: detailsResponse.data.matchDuration,
            skillLevel: detailsResponse.data.skillLevel,
            location: detailsResponse.data.location,
            teams: detailsResponse.data.teams || [],
            teamSize: detailsResponse.data.teamSize,
            isFull: (detailsResponse.data.teams || []).length >= detailsResponse.data.teamCount,
            startTime: formatDateTime(detailsResponse.data.startTime),
            rounds: detailsResponse.data.rounds,
            champion: detailsResponse.data.champion,
          });

          setMaxTeamsAllowed(detailsResponse.data.teamCount);
          setTournament(tournamentData);

          const maxTeamSizeForTournament = detailsResponse.data.teamSize;
          setMaxTeamSize(maxTeamSizeForTournament);

        } catch (error) {
          console.error('Error fetching tournament data:', error);
        }
      };

      fetchTournamentDetails();
    }
  }, []);

  console.log("TOURNY INFO", tournament);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_teams2?email=${currentUser.email}`);
        if (response.data.length > 0) {
          const teams = response.data;
          // Assuming each team object has a 'leader' field with the leader's email
          setUserTeams(teams);
          // If the user is a leader of at least one team, set the first one as selected by default
          if (leaderTeams.length > 0) {
            setSelectedTeamId(leaderTeams[0]._id);
          }
          console.log("Fetched teams:", teams);
          console.log("leader", leaderTeams);
        } else {
          console.log("No teams found");
        }
      } catch (error) {
        console.error('Error getting teams', error);
      }
    };

    fetchData();
  }, []);

  const leaderTeams = userTeams.filter(team => team.leader === user.email);


  const handleCheckboxChange = (teamId) => {
     console.log("Selected team ID:", teamId);
    setSelectedTeamId(teamId);
  };


  const handleJoinTournament = () => {
    setIsJoinTournamentModalOpen(true);
    //alert("Join Tournament logic here");
  };

  const joinTournamentWithTeam = async () => {
    //if (!selectedTeamId) return;

    //console.log("teamID", team._id);

    if (isTournamentStarted()) {
      alert("The tournament has already started. You cannot join at this time.");
      return;
    }

    if (tournament.isFull) {
      alert("The tournament is full. You cannot join at this time.");
      return;
    }

    const selectedTeam = userTeams.find(team => team._id === selectedTeamId);
    if (selectedTeam.size > maxTeamSize) {
      alert('This team exceeds the maximum size allowed for this tournament.');
      return;
    }



    try {
      await axios.post('http://localhost:5000/join_tournament', { tournamentId: tournament.objectID, teamId: selectedTeamId });
      setIsJoinTournamentModalOpen(false);
      setSelectedTeamId(null);
      window.location.reload();
    } catch (error) {
      console.error('Error joining tournament:', error);
    }
  };

  const createAndJoinTeam = async () => {
    try {
      // API call to create a new team
      const response = axios.post('http://localhost:5000/create_team', {
          'name': newTeamName,
          'leader': user.email,
          'members': [],
          'size': 1,
          'maxSize': 8,
          'publicity': true,
        });

        response.then((response) => {
            console.log("request responded");

            if (response.status === 200) {
                console.log("Team created!");
                alert("Team created, now try joining the tournament with your newly created team!")
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
      console.error('Error creating new team:', error);
    }
  };

  const isTournamentStarted = () => {
    const now = new Date();
    const startTime = new Date(tournament.startTime);
    return now >= startTime;
  };


  return (
    <div className="w-full flex gap-8 mb-8">
      {/* Tournament Details Section */}
      <div className="w-4/5">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl font-semibold">{tournament.sport} Tournament</h1>
        </div>

        <p className="text-gray-700 font-base border-b border-gray-300 pb-4">
          Teams: {tournament.teamCount} Team Size: {tournament.teamSize}
        </p>

        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⏳</span>
          <span style={{ fontWeight: 'bold' }}>Tournament Duration:</span>
          <span style={{ fontSize: '16px', marginLeft: 'auto' }}>{tournament.tournamentDuration} days</span>
        </div>
        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⌚</span>
          <span style={{ fontWeight: 'bold' }}>Match Duration:</span>
          <span style={{ fontSize: '16px', marginLeft: 'auto' }}>{tournament.matchDuration} minutes</span>
        </div>

        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🏆</span>
          <span style={{ fontWeight: 'bold' }}>Skill Level:</span>
          <span style={{ fontSize: '16px', marginLeft: 'auto' }}>{tournament.skillLevel}</span>
        </div>
        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>📍</span>
          <span style={{ fontWeight: 'bold' }}>Location:</span>
          <span style={{ fontSize: '16px', marginLeft: 'auto' }}>{tournament.location}</span>
        </div>
        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⏲️</span>
          <span style={{ fontWeight: 'bold' }}>Countdown till Tournament Close:</span>
          <span style={{ fontSize: '16px', marginLeft: 'auto' }}>{tournament.startTime}</span>
        </div>

      {/* bracket for the tournament */}
      <br />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-2">Bracket:</h2>
        {tournament.champion ? (
          <p className="text-gray-700 font-base border-b border-gray-300 pb-4">Champion: {tournament.champion}</p>
        ) : (
          <p className="text-gray-700 font-base border-b border-gray-300 pb-4"></p>
        )}
      </div>
      {
        tournament.rounds && tournament.rounds.length > 0 && (
          <div className="mt-4">
            {tournament.rounds.map((round, roundIndex) => {
              const teamPairs = [];
              for (let i = 0; i < round.length; i += 2) {
                teamPairs.push([round[i], round[i + 1]]);
              }

              return (
                <div key={roundIndex} className="flex flex-col items-center space-y-6 my-4">
                  <h3 className="text-lg font-semibold text-blue-700">Round {roundIndex + 1}</h3>
                  {teamPairs.map((pair, pairIndex) => (
                    <div key={pairIndex} className="flex items-center justify-center space-x-4 md:space-x-6">
                      <div className={`bg-blue-100 p-3 rounded-md w-32 text-center ${pair[1] ? '' : 'col-span-2'}`}>{pair[0]}</div>
                      {pair[1] ? (
                        <>
                          <div className="text-lg font-bold text-gray-600">vs</div>
                          <div className="bg-blue-100 p-3 rounded-md w-32 text-center">{pair[1]}</div>
                          <button
                            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
                            onClick={() => pickWinner(pair[0], pair[1])}
                          >
                            Pick Winner
                          </button>
                        </>
                      ) : (
                        <div className="bg-yellow-300 text-black px-4 py-2 rounded-lg">{pair[0]} advances</div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )
      }

      </div>



      {/* Actions Section */}
      <div className="w-1/3 border border-gray-300 rounded-xl h-128 shadow-lg">
        <div className="py-10 px-8">
        {!isTournamentStarted() && !tournament.isFull && (
          <button
            onClick={handleJoinTournament}
            className="w-full bg-green-500 hover:ease-in duration-100 text-white font-semibold text-lg rounded-xl py-2 mb-4"
            disabled={tournament.isFull}
          >
            {tournament.isFull ? "Tournament Full" : "Join Tournament"}
          </button>
        )}

          {isJoinTournamentModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 p-6">
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg float-right" onClick={() => setIsJoinTournamentModalOpen(false)}>X</button>
      <h1 className="text-2xl font-semibold mb-4">Join Tournament</h1>

      {/* Team Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Your Team</h2>
        {userTeams.map((team) => (
  <div key={team._id} className="flex items-center mb-2">
    <input
      type="radio"
      name="teamSelection"
      value={team._id}
      checked={selectedTeamId === team._id}
      onChange={() => handleCheckboxChange(team._id)}
      disabled={team.size > tournament.maxTeamSize}
    />
    <label
      className={`ml-2 cursor-pointer ${team.size > tournament.maxTeamSize ? 'text-gray-500' : ''}`}
      onClick={() => team.size <= tournament.maxTeamSize && handleCheckboxChange(team._id)}
      title={team.size > tournament.maxTeamSize ? "This team exceeds the maximum size allowed for this tournament." : ""}
    >
      {team.name} (Size: {team.size})
    </label>
  </div>
))}

      </div>

      {/* Join with Selected Team Button */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg w-full mt-4"
        onClick={() => joinTournamentWithTeam()}
        //disabled={!selectedTeamId}
      >
        Join with Selected Team
      </button>

      {/* Create New Team */}
      <div className="mt-4">
        <input
          type="text"
          className="w-full border mt-1 p-2 rounded-md"
          placeholder="Enter New Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-4" onClick={createAndJoinTeam}>Create Team</button>
      </div>
    </div>
  </div>
)}



          {!isTournamentStarted() && (
            <LeaveTournamentButton
              tournamentId={tournament.objectID}
              leaderTeams={leaderTeams}
              //teamId={selectedTeamId}
              //isLeader={userTeams.some(team => team._id === selectedTeamId && team.leader === user.email)}
            />
          )}

            {isTournamentStarted() && <p className="text-red-500">Tournament has already started.</p>}


          <h2 className="text-xl font-semibold mb-2">Teams in this Tournament:</h2>
          <p>Teams: {tournament.teams.length} / {maxTeamsAllowed}</p>
        {tournament.teams && tournament.teams.length > 0
          ? tournament.teams.map((teamName, index) => (
           <p key={index}>{teamName}</p>
          ))
          : <p>No teams have joined yet.</p>
        }
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
