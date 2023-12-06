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

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  
    if (currentUser) {
      const fetchEventHistory = async () => {
        try {
          const eventHistoryResponse = await axios.get(`http://localhost:5000/get_event_history?username=${currentUser.username}`);
          const createdEventsResponse = await axios.get(`http://localhost:5000/get_my_created_events?email=${currentUser.email}`);
  
          const uniqueEvents = eventHistoryResponse.data.reduce((acc, event) => {
            const uniqueId = `${event._id}-${event.user}`;
            if (!acc.some(e => `${e._id}-${e.user}` === uniqueId)) {
              acc.push(event);
            }
            return acc;
          }, []);
  
          const createdEvents = createdEventsResponse.data;
          const combinedEvents = [...uniqueEvents, ...createdEvents];
  
          setEventHistory(combinedEvents);
          getEmailsForPlayers(combinedEvents);
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
  
      fetchEventHistory();
    }
  }, []);

  const formatDate = (joinDate) => {
    if (!joinDate) return "Unknown";
    try {
      const date = new Date(joinDate);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting join date:", error);
      return "Invalid Date";
    }
  };

  const findUserJoinDate = (participants) => {
    const currentUserParticipant = participants.find(participant => 
      typeof participant === 'object' && participant.username === user.username
    );
    return currentUserParticipant ? formatDate(currentUserParticipant.join_date) : "Unknown";
  };

  const getEmailFromUsername = async (participant) => {
    let username = typeof participant === 'object' ? participant.username : participant;

    try {
        const response = await axios.get(`http://localhost:5000/get_user_info2?username=${username}`);
        return response.data.email;
    } catch (error) {
        console.error("Error fetching email:", error);
        return null;
    }
};

const handleSortBy = (criteria) => {
  let sortedData = [...eventHistory];

  if (criteria === "date") {
    // Sorting based on the 'join_date' of the current user in each event
    sortedData.sort((a, b) => {
      const dateA = a.participants.find(p => p.username === user.username)?.join_date;
      const dateB = b.participants.find(p => p.username === user.username)?.join_date;
      return new Date(dateB) - new Date(dateA); // Sort in descending order
    });
  } else if (criteria === "eventName") {
    sortedData.sort((a, b) => a.title.localeCompare(b.title));
  }

  setEventHistory(sortedData);
  setSortBy(criteria);
};


  const getEmailsForPlayers = async (data) => {
    if (data.length > 0) {
        const allPlayers = data.reduce((players, event) => players.concat(event.participants), []);
        const emailPromises = allPlayers.map((player) => getEmailFromUsername(player));
        const emails = await Promise.all(emailPromises);
        const playerEmailData = allPlayers.reduce((acc, player, index) => {
            const username = typeof player === 'object' ? player.username : player;
            acc[username] = emails[index];
            return acc;
        }, {});
        setPlayerEmails(playerEmailData);
    }
};

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        <Sidebar active="userPlayerHistory" />
        <div className="flex-grow p-8">
          <h1 className="text-2xl font-semibold mb-6">Player History</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <span className="text-gray-700">Sort by:</span>
              <button
                onClick={() => handleSortBy('date')}
                className={`ml-3 px-3 py-1 rounded-full text-sm ${
                  sortBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => handleSortBy('eventName')}
                className={`ml-3 px-3 py-1 rounded-full text-sm ${
                  sortBy === 'eventName' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                Event Names
              </button>
            </div>
            {eventHistory.map((event, index) => (
              <div key={index} className="mb-4 p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">Date Joined: {findUserJoinDate(event.participants)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {event.participants.map((participant, playerIndex) => {
                    const participantUsername = typeof participant === 'object' ? participant.username : participant;
                    const emailForLink = playerEmails[participantUsername];
                    return (
                      <Link key={playerIndex} href={`/profile/userProfilePage?email=${emailForLink}`}>
                        <span className="text-blue-600 hover:underline cursor-pointer">{participantUsername}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
