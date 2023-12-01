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
  const [userTeams, setUserTeams] = useState([])
  const [tournament, setTournament] = useState({
    sport: "",
    teamCount: "",
    duration: 0,
    matchDuration: "",
    teams: [],
    isFull: false,
    startTime: ""
  });

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
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
            teams: detailsResponse.data.teams || [],
            isFull: (detailsResponse.data.teams || []).length >= detailsResponse.data.teamCount,
            startTime: formatDateTime(detailsResponse.data.startTime),
          });

          setMaxTeamsAllowed(detailsResponse.data.teamCount);
          setTournament(tournamentData);
          
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
        const response = await axios.get(`http://localhost:5000/get_teams?email=${currentUser.email}`);
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

    try {
      await axios.post('http://localhost:5000/join_tournament', { tournamentId: tournament.objectID, teamId: selectedTeamId });
      setIsJoinTournamentModalOpen(false);
      setSelectedTeamId(null);
    } catch (error) {
      console.error('Error joining tournament:', error);
    }
  };
  
  
  const createAndJoinTeam = async () => {
    try {
      // API call to create a new team
      const newTeam = await axios.post('http://localhost:5000/join_tournament', { name: newTeamName });
      joinTournamentWithTeam(newTeam.data.id);
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
    <div className="w-full flex gap-8">
      {/* Tournament Details Section */}
      <div className="w-4/5">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl font-semibold">{tournament.sport} Tournament</h1>
        </div>

        <p className="text-gray-700 font-base border-b border-gray-300 pb-4">
          Teams: {tournament.teamCount}
        </p>

        <p className="pt-4">
          Tournament Duration: {tournament.tournamentDuration} days
        </p>
        <p>
          Match Duration: {tournament.matchDuration} minutes
        </p>
        <p>
          Countdown: {tournament.startTime} minutes
        </p>
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
    />
    <label className="ml-2 cursor-pointer" onClick={() => handleCheckboxChange(team._id)}>
      {team.name}
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-4" onClick={createAndJoinTeam}>Create and Join</button>
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
