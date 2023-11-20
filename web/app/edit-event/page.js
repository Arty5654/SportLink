"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";

const EditEvent = () => {
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
    eventOwner: "",
  });

  const status = event.currentParticipants < event.maxParticipants ? "Open" : "Closed";
  const eventOwner = event.eventOwner === user.email;
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
            eventOwner: data.eventOwner,
          });
          console.log(response.data);
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getEventDetails();
  }, [eventID]);

  const handleCancelClick = () => {
    router.push(`/events?id=${eventID}`);
  };

  return (
    <div className="w-full pb-16">
      <form className="flex items-start gap-16">
        {/* ITEM: Main section*/}
        <div className="w-4/5">
          {/* ITEM: First Row */}
          <div className="flex items-end pb-10 gap-2">
            <h1 className="text-3xl font-semibold">Title: </h1>
            <textarea
              name="eventTitle"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="w-full rounded-lg h-8 pl-2 text-2xl outline-0 border resize-none border-blue-100 hover:border-blue-200 active:border-blue-200"
            />
          </div>

          {/* ITEM: Second Row */}
          <div className="flex gap-4 pb-8">
            {/* Sport dropdown */}
            <div className="flex gap-4 w-1/2">
              <h2 className="text-2xl font-semibold">Sport: </h2>
              <select
                name="eventSport"
                value={event.sport}
                onChange={(e) => setEvent({ ...event, sport: e.target.value })}
                className="w-full border-blue-100 hover:border-blue-200 active:border-blue-200"
              >
                <option value="">Select Sport</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Soccer">Soccer</option>
                <option value="Weightlifting">Weightlifting</option>
              </select>
            </div>
            {/* City Textbox */}
            <div className="w-1/2 flex gap-4">
              <h2 className="text-2xl font-semibold">City: </h2>
              <textarea
                name="eventCity"
                value={event.city}
                onChange={(e) => setEvent({ ...event, city: e.target.value })}
                className="w-full rounded-lg pt-1 h-8 pl-2 outline-0 border resize-none border-blue-100 hover:border-blue-200 active:border-blue-200"
              />
            </div>
          </div>
          {/* ITEM: Third Row */}
          <div className="pb-16">
            <h2 className="text-2xl font-semibold pb-2">Description:</h2>
            <textarea
              name="eventDesc"
              value={event.desc}
              onChange={(e) => setEvent({ ...event, desc: e.target.value })}
              className="w-full rounded-lg h-96 pl-2 outline-0 border resize-none border-blue-100 hover:border-blue-200 active:border-blue-200"
            />
          </div>
          {/* ITEM: Row Four */}
          <div className="flex gap-4 w-full pb-8">
            <button className="bg-blue-500 text-white w-1/2 py-2 rounded-xl">Save</button>
            <button
              className="text-black w-1/2 py-2 rounded-xl border border-black"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ITEM: Right Bar*/}
        <div className="w-1/3 border border-gray-300 rounded-xl h-128 shadow-lg">
          <div className="py-10 px-8">
            <h1 className="text-2xl font-semibold pb-8">Participants</h1>
            <div classname="">
              {event.participants.map((event, index) => (
                <p className="text-sm border-l border-gray-400 px-2 relative">{event}</p>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
