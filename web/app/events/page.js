"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";

const EventDetails = () => {
  const [user, setUser] = useState(new User()); // current logged in user
  const [event, setEvent] = useState({
    // event details
    title: "",
    desc: "",
    city: "",
    sport: "",
    open: false,
    currentParticipants: 0,
    maxParticipants: 0,
    participants: [],
  });

  const status = event.currentParticipants < event.maxParticipants ? "Open" : "Closed";
  const router = useRouter(); // create router object
  const searchParams = useSearchParams(); // create searchParams object
  const eventID = searchParams.get("id"); // get the id from the URL

  // Set the user as current user is session
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  useEffect(() => {
    console.log(event.participants);
  }, [event.participants]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        axios.get(`http://localhost:5000/get_event_details?id=${eventID}`).then((response) => {
          const data = response.data;
          setEvent({
            title: data.title,
            desc: data.desc,
            city: data.city,
            sport: data.sport,
            open: data.open,
            currentParticipants: data.currentParticipants,
            maxParticipants: data.maxParticipants,
            participants: data.participants,
          });
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getEventDetails();
  }, [eventID]);

  const handleJoinEvent = () => {
    if (event.currentParticipants < event.maxParticipants) {
      if (!user) {
        // If no user session
        console.log("User not logged in...");
        router.push("/signin");
        return;
      } else {
        axios
          .post("http://localhost:5000/join_event", {
            id: eventID,
            username: user.username,
          })
          .then((response) => {
            if (response.status === 200) {
              alert("You have successfully joined the event!");
              window.location.reload();
            }
          })
          .catch((error) => {
            console.error("Error joining event: ", error);
          });
      }
    } else {
      alert("The event is full. You cannot join at the moment.");
    }
  };

  return (
    <div className="w-full flex gap-8">
      {/* ITEM: Left Side */}
      <div className="w-4/5">
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <p className="text-gray-600 border-b border-gray-300 pb-4">
          {event.city} • {event.sport}
        </p>
        <p className="pt-4">{event.desc}</p>
      </div>
      {/* ITEM: Right Bar*/}
      <div className="w-1/3 border border-gray-300 rounded-xl h-96 shadow-lg">
        <div className="py-10 px-8">
          <h1 className="text-xl font-semibold">
            Status:{" "}
            <span
              className={
                status === "Open" ? "text-blue-500 font-base" : "text-red-500 font-base"
              }
            >
              {status}
            </span>
          </h1>
          <p className="text-sm text-gray-600 pb-6">
            Participants{" "}
            <span>
              {event.currentParticipants} / {event.maxParticipants}
            </span>
          </p>
          <button
            onClick={handleJoinEvent}
            className="w-full bg-green-500 text-white font-semibold text-lg ho rounded-xl py-2 mb-4"
          >
            Join Event
          </button>
          <div>
            <h2 className="pb-2">Currently Registered</h2>
            <div className="grid grid-cols-2">
              {event.participants.map((event, index) => (
                <p className="text-sm">{event}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
