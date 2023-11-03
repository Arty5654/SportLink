"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import User from "@app/User";

const HistoryPage = () => {
  const [user, setUser] = useState(new User());
  const [eventHistory, setEventHistory] = useState([]);
  const [playerHistory, setPlayerHistory] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);

    // Fetch event history for the user
    if (currentUser) {
      axios
        .get(`http://localhost:5000/get_event_history?username=${currentUser.username}`)
        .then((response) => {
          console.log(response.data);
          setEventHistory(response.data);
        });
    }
  }, []);

  return (
    <div>
      <div className="flex h-screen">
        <div>
          <Sidebar active="userPlayerHistory" />
        </div>
        <div className="pl-16">
          <h1 className="text-xl font-semibold pb-4">Player History</h1>
          <div className="flex gap-8">
            {eventHistory.length === 0 ? (
              <p className="text-sm text-gray-600">You havent participated in any events.</p>
            ) : (
              eventHistory.map((event, index) => (
                <div>
                  <p className="text-base pb-4" key={index} event={event} {...event}>
                    {event.title}
                  </p>
                  <p key={index} event={event} {...event}>
                    {event.participants.map((player, index) => (
                      <p className="text-sm text-gray-600">{player}</p>
                    ))}
                  </p>
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
