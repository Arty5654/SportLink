"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@components/profileSidebar";
import User from "@app/User";

const EventCard = ({ event }) => {
  const status = event.currentParticipants < event.maxParticipants ? "Open" : "Closed";
  const router = useRouter();

  const handleEventClick = () => {
    router.push(`/events?id=${event._id}`);
  };

  return (
    <div
      className="border border-gray-300 rounded-xl px-4 py-2 flex items-end relative cursor-pointer gap-4"
      onClick={handleEventClick}
    >
      <p className="font-semibold pr-2 w-1/3">{event.title}</p>
      <p className="text-sm w-2/5">
        {event.sport} in {event.city} - <span className="text-blue-500">{event.level}</span>
      </p>
      <p className="text-sm">
        <span>
          Registered {event.currentParticipants} / {event.maxParticipants}
          {" • "}
          <span className={status === "Open" ? "text-green-500" : "text-red-500"}>
            {status}
          </span>
        </span>
      </p>
    </div>
  );
};

const MyEvents = () => {
  const [user, setUser] = useState(new User());
  const [events, setEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);

  // get user from session storage, send to backend to fetch events that contain
  // the users username in the participants array
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);

    axios
      .get(`http://localhost:5000/get_my_events?username=${currentUser.username}`)
      .then((response) => {
        setEvents(response.data);
      });

    axios
      .get(`http://localhost:5000/get_my_created_events?email=${currentUser.email}`)
      .then((response) => {
        setCreatedEvents(response.data);
      });
  }, []);

  return (
    <div className="flex pb-16">
      {/* ITEM: SideBar */}
      <div className="w-1/4">
        <Sidebar active="myEvents" />
      </div>

      <div className="w-3/4 flex flex-col gap-8">
        {/* ITEM: Registered Events */}
        <div className="h-128 border border-gray-300 rounded-2xl px-8 py-10">
          <p className="text-2xl font-semibold pb-1">Registered Events</p>
          <p className="text-gray-500 pb-8">
            These are events that you are currently apart of. You can click into them to view
            the event details or to manage your status. Any event that you created will also be
            listed below.
          </p>
          <div className="flex flex-col gap-4">
            {events.map((event, index) => (
              <EventCard key={index} event={event} {...event} />
            ))}
          </div>
        </div>

        {/* ITEM: Created Events */}
        <div className="h-128 border border-gray-300 rounded-2xl px-8 py-10">
          <p className="text-2xl font-semibold pb-1">Created Events</p>
          <p className="text-gray-500 pb-8">
            These are events that you have created. You can click into them to view the event
            details or to manage the event status. As the event owner you can delete the event,
            end the event, or remove people from the event.
          </p>
          <div className="flex flex-col gap-4">
            {createdEvents.map((createdEvents, index) => (
              <EventCard key={index} event={createdEvents} {...createdEvents} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
