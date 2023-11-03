"use client"
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import User from "@app/User";
import Link from "next/link";

const HistoryPage = () => {
  const [user, setUser] = useState(new User());
  const [eventHistory, setEventHistory] = useState([]);
  const [playerEmails, setPlayerEmails] = useState({});
  const [sortBy, setSortBy] = useState("date");
  const [sortedEventHistory, setSortedEventHistory] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);

    if (currentUser) {
      axios
        .get(`http://localhost:5000/get_event_history?username=${currentUser.username}`)
        .then((response) => {
          setEventHistory(response.data);
          getEmailsForPlayers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching event history:", error);
        });
    }
  }, []);

  const getEmailFromUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_user_info2?username=${username}`);
      return response.data.email;
    } catch (error) {
      console.error("Error fetching email:", error);
      return null;
    }
  };

  const handleSortBy = (criteria) => {
    let sortedData = [...sortedEventHistory];

    if (criteria === "date") {
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === "gameType") {
      sortedData.sort((a, b) => a.gameType.localeCompare(b.gameType));
    }

    setSortedEventHistory(sortedData);
    setSortBy(criteria); // Update the sorting criteria
  };


  const getEmailsForPlayers = async (data) => {
    if (data.length > 0) {
      const allPlayers = data.reduce((players, event) => players.concat(event.participants), []);
      const emailPromises = allPlayers.map((player) => getEmailFromUsername(player));
      const emails = await Promise.all(emailPromises);
      const playerEmailData = allPlayers.reduce((acc, player, index) => {
        acc[player] = emails[index];
        return acc;
      }, {});
      setPlayerEmails(playerEmailData);
    }
  };

  return (
    <div>
      <div className="flex h-screen">
        <div>
          <Sidebar active="userPlayerHistory" />
        </div>
        <div className="pl-16">
          <h1 className="text-xl font-semibold pb-4">Player History</h1>
          <div>
            <div className="mb-4">
              <span>Sort by: </span>
              <button onClick={() => handleSortBy('date')} className={sortBy === 'date' ? 'font-bold' : ''}>
                Date
              </button>
              <button onClick={() => handleSortBy('gameType')} className={sortBy === 'gameType' ? 'font-bold' : ''}>
                Game Type
              </button>
            </div>
            {eventHistory.length === 0 ? (
              <p className="text-sm text-gray-600">You haven't participated in any events.</p>
            ) : (
              eventHistory.map((event, index) => (
                <div key={index}>
                  <p className="text-base pb-4">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    Game Type: {event.gameType}, Date: {event.date}
                  </p>
                  <div>
                    {event.participants.map((player, playerIndex) => {
                      return (
                        <div key={playerIndex}>
                          <Link href={`/profile/userProfilePage?email=${playerEmails[player]}`} passHref>
                            <p className="text-sm text-gray-600">{player}</p>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
