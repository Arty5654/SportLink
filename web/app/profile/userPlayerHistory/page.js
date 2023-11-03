"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '@components/profileSidebar';
import axios from 'axios';
import User from "@app/User";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(new User());

  useEffect(() => {
    // Fetch the user from session storage
    const userFromSession = JSON.parse(sessionStorage.getItem("user"));
    setLoggedInUser(userFromSession);
    // Check if user exists and fetch history based on the user's email
    if (userFromSession && userFromSession.email) {
      axios.get(`http://localhost:5000/get_all_events?email=${userFromSession.email}`)
        .then((response) => {
          setHistory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user history", error);
        });
    }
  }, []);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar active="userPlayerHistory" />
        <div>
          <h1>History of Games</h1>
          {/* Display historical game data */}
          <ul>
            {history.map((game) => (
              <li key={game.id}>
                <p>Game Type: {game.sport}</p>
                <p>Date and Time: [Mock Date and Time]</p>
                <p>Notes: {game.desc}</p>
                <button>View Players</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
