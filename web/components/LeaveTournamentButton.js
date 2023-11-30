// LeaveTournamentButton.js
"use client"
import React from 'react';
import axios from 'axios';

const LeaveTournamentButton = ({ tournamentId, teamId, isLeader }) => {
  const handleLeaveTournament = async () => {
    if (!isLeader) {
      alert("Only the team leader can leave the tournament.");
      return;
    }

    const confirmLeave = window.confirm("Are you sure you want to leave the tournament?");
    if (confirmLeave) {
      try {
        const userEmail = JSON.parse(sessionStorage.getItem("user")).email;
        const response = await axios.post('http://localhost:5000/leave_tournament', { tournamentId, teamId, userEmail });
        alert(response.data.message);
        // Additional logic to update UI after leaving
      } catch (error) {
        console.error('Error leaving tournament:', error);
        alert(error.response?.data.message || "An error occurred while trying to leave the tournament.");
      }
    }
  };

  return (
    <button onClick={handleLeaveTournament} className="w-full bg-red-500 text-white font-semibold text-lg rounded-xl py-2 mb-4">
      Leave Tournament
    </button>
  );
};

export default LeaveTournamentButton;
