// LeaveTournamentButton.js
"use client"
import React, { useState } from 'react';
import axios from 'axios';

const LeaveTournamentButton = ({ tournamentId, leaderTeams }) => {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleLeaveTournament = async () => {
    if (!selectedTeamId) {
      alert("Please select a team to leave the tournament.");
      return;
    }

    try {
      const userEmail = JSON.parse(sessionStorage.getItem("user")).email;
      const response = await axios.post('http://localhost:5000/leave_tournament', { tournamentId, teamId: selectedTeamId, userEmail });
      alert(response.data.message);
      setShowModal(false);
      window.location.reload();
      // Additional logic to update UI after leaving
    } catch (error) {
      console.error('Error leaving tournament:', error);
      alert(error.response?.data.message || "An error occurred while trying to leave the tournament.");
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="w-full bg-red-500 text-white font-semibold text-lg rounded-xl py-2 mb-4">
        Leave Tournament
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 p-6">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg float-right" onClick={() => setShowModal(false)}>X</button>
            <h1 className="text-2xl font-semibold mb-4">Select Team to Leave</h1>

            {leaderTeams.map(team => (
              <div key={team._id} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="teamSelection"
                  value={team._id}
                  checked={selectedTeamId === team._id}
                  onChange={() => setSelectedTeamId(team._id)}
                />
                <label className="ml-2 cursor-pointer" onClick={() => setSelectedTeamId(team._id)}>
                  {team.name}
                </label>
              </div>
            ))}

            <button onClick={handleLeaveTournament} className="bg-red-500 text-white py-2 rounded-lg w-full mt-4">
              Confirm Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTournamentButton;
