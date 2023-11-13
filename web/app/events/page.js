"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";

const EventDetails = () => {
  const [user, setUser] = useState(new User());
  const [event, setEvent] = useState({
    title: "",
    desc: "",
    city: "",
    sport: "",
    level: "",
    open: false,
    currentParticipants: 0,
    maxParticipants: 0,
    participants: [],
  });

  const status = event.currentParticipants < event.maxParticipants ? "Open" : "Closed";
  const isUserParticipant = event.participants.includes(user?.username);
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventID = searchParams.get("id");

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

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
            level: data.level,
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

  // const handleJoinEvent = () => {
  //   if (event.currentParticipants < event.maxParticipants) {
  //     if (!user) {
  //       // If no user session
  //       console.log("User not logged in...");
  //       router.push("/signin");
  //       return;
  //     } else {
  //       if (isUserParticipant) {
  //         // leave event
  //         axios
  //           .post("http://localhost:5000/leave_event", {
  //             id: eventID,
  //             username: user.username,
  //           })
  //           .then((response) => {
  //             if (response.status === 200) {
  //               alert("You have successfully left the event");
  //               window.location.reload();
  //             }
  //           });
  //       } else {
  //         // join event
  //         axios
  //           .post("http://localhost:5000/join_event", {
  //             id: eventID,
  //             username: user.username,
  //           })
  //           .then((response) => {
  //             if (response.status === 200) {
  //               alert("You have successfully joined the event!");
  //               window.location.reload();
  //             }
  //           })
  //           .catch((error) => {
  //             console.error("Error joining event: ", error);
  //           });
  //         // add to event history
  //         axios
  //           .post("http://localhost:5000/add_event_history", {
  //             event: eventID,
  //             user: user.username,
  //           })
  //           .then((response) => {
  //             if (response.status === 200) {
  //               console.log("Added to History");
  //             }
  //           });
  //       }
  //     }
  //   } else {
  //     alert("The event is full. You cannot join at the moment.");
  //   }
  // };

  const handleJoinEvent = () => {
    if (isUserParticipant) {
      // user is registered for event
      axios
        .post("http://localhost:5000/leave_event", {
          id: eventID,
          username: user.username,
        })
        .then((response) => {
          if (response.status === 200) {
            alert("You have successfully left the event");
            window.location.reload();
          }
        });
    } else {
      // user isnt registered for event
      if (event.currentParticipants < event.maxParticipants) {
        // join event

        let updatedUser = { ...user };
      
        if (event.sport === 'Tennis') {
          updatedUser.numTennis = (updatedUser.numTennis || 0) + 1;
        } else if (event.sport === 'Weightlifting') {
          updatedUser.numWeights = (updatedUser.numWeights || 0) + 1;
        } else if (event.sport === 'Basketball') {
          updatedUser.numBasketball = (updatedUser.numBasketball || 0) + 1;
        } else if (event.sport === 'Soccer') {
          updatedUser.numSoccer = (updatedUser.numSoccer || 0) + 1;
        }
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(user));

        axios
          .post("http://localhost:5000/join_event", {
            id: eventID,
            username: user.username,
            numBasketball: updatedUser.numBasketball,
            numTennis: updatedUser.numTennis,
            numSoccer: updatedUser.numSoccer,
            numWeights: updatedUser.numWeights
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
        // add to event history
        axios
          .post("http://localhost:5000/add_event_history", {
            event: eventID,
            user: user.username,
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("Added to History");
            }
          });
      } else {
        alert("The event is full. You cannot join at the moment.");
      }
    }
  };

  return (
    <div className="w-full flex gap-8">
      {/* ITEM: Left Side */}
      <div className="w-4/5">
        <h1 className="text-3xl font-semibold">
          {event.title}{" "}
          <span className="text-gray-600 pb-4 font-base text-sm">
            {event.city} • {event.sport}
          </span>
        </h1>
        <p className="text-blue-500 border-b border-gray-300 pb-4">{event.level}</p>
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
            className={
              status === "Open"
                ? `w-full ${
                    isUserParticipant ? "bg-red-500" : "bg-green-500"
                  } hover:ease-in duration-100 text-white font-semibold text-lg rounded-xl py-2 mb-4`
                : isUserParticipant
                ? "w-full bg-red-500 text-white font-semibold text-lg rounded-xl py-2 mb-4"
                : "w-full bg-gray-500 text-white font-semibold text-lg rounded-xl py-2 mb-4"
            }
          >
            {isUserParticipant ? "Leave Event" : "Join Event"}
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
