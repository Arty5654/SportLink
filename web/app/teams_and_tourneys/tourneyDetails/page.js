"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";

const TournamentDetails = () => {
  const [user, setUser] = useState(new User());
  const [tournament, setTournament] = useState({
    sport: "",
    teamCount: "",
    duration: 0,
    matchDuration: ""
  });

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
          setTournament({
            sport: detailsResponse.data.sport,
            teamCount: detailsResponse.data.teamCount,
            duration: detailsResponse.data.duration,
            matchDuration: detailsResponse.data.matchDuration
          });
        } catch (error) {
          console.error('Error fetching tournament data:', error);
        }
      };

      fetchTournamentDetails();
    }
  }, []);

  const handleJoinTournament = () => {
    alert("Join Tournament logic here");
  };

  const handleLeaveTournament = () => {
    alert("Leave Tournament logic here");
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
          Tournament Duration: {tournament.duration} days
        </p>
        <p>
          Match Duration: {tournament.matchDuration} minutes
        </p>
      </div>

      {/* Actions Section */}
      <div className="w-1/3 border border-gray-300 rounded-xl h-128 shadow-lg">
        <div className="py-10 px-8">
          <button
            onClick={handleJoinTournament}
            className="w-full bg-green-500 hover:ease-in duration-100 text-white font-semibold text-lg rounded-xl py-2 mb-4"
          >
            Join Tournament
          </button>
          <button
            onClick={handleLeaveTournament}
            className="w-full bg-red-500 text-white font-semibold text-lg rounded-xl py-2 mb-4"
          >
            Leave Tournament
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
