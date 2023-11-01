"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const EventDetails = () => {
  const [event, setEvent] = useState({
    title: "",
    desc: "",
    city: "",
    sport: "",
    open: false,
    currentParticipants: 0,
    maxParticipants: 0,
  });

  const status = event.open ? "Open" : "Closed";
  const searchParams = useSearchParams();
  const eventID = searchParams.get("id");

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
            maxParticipants: data.max,
          });
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getEventDetails();
  }, [eventID]);

  return (
    <div className="w-full flex gap-8">
      {/* ITEM: Left Side */}
      <div className="w-3/4">
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <p className="text-gray-600 border-b border-gray-300 pb-4">
          {event.city} • {event.sport}
        </p>
        <p className="pt-4">{event.desc}</p>
      </div>
      {/* ITEM: Right Bar*/}
      <div className="w-1/4 border border-gray-300 rounded-xl">
        <div className="py-6 px-4">
          <h1 className="text-xl font-semibold">
            Status: <span className="text-blue-500">{status}</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
