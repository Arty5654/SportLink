"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from "@components/profileSidebar";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch historical game data when the component mounts
    fetch('')
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <div className="flex h-screen">
      <Sidebar active="userPlayerHistory" />
      <h1>History of Games</h1>
      {/* Display historical game data */}
      <ul>
        {history.map((game) => (
          <li key={game.id}>
            <p>Game Type: {game.type}</p>
            <p>Date and Time: {game.date}</p>
            <p>Notes: {game.notes}</p>
            <button>View Players</button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default HistoryPage;
