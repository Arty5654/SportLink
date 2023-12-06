"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";

const ParticipantCard = ({ username }) => {
  const searchParams = useSearchParams();
  const eventID = searchParams.get("id");

  // Handle removing a participant from the participants list
  const handleDeleteParticipant = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/remove_participant", { eventID, username });
      alert("You have successfully removed a participant");
      window.location.reload();
    } catch (error) {
      console.log("Error removing participant from event: ", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm border-l border-gray-400 px-2 relative">{username}</p>
      <p className="text-red-500 cursor-pointer" onClick={handleDeleteParticipant}>
        x
      </p>
    </div>
  );
};

const EditEvent = () => {
  const [user, setUser] = useState(new User());
  const [endState, setEndState] = useState(false);
  const [summary, setSummary] = useState("");
  const [event, setEvent] = useState({
    title: "",
    desc: "",
    address: "",
    lat: 0,
    lng: 0,
    sport: "",
    level: "",
    open: false,
    currentParticipants: 0,
    maxParticipants: 0,
    participants: [],
    eventOwner: "",
    town: "",
    end: false,
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
            address: data.address,
            lat: data.lat,
            lng: data.lng,
            sport: data.sport,
            level: data.level,
            open: data.open,
            currentParticipants: data.currentParticipants,
            maxParticipants: data.maxParticipants,
            participants: data.participants,
            eventOwner: data.eventOwner,
            town: data.town,
          });
          console.log("Response Data: ", response.data);
        });
      } catch (error) {
        console.log("Get Event Details Error: ", error);
      }
    };
    getEventDetails();
  }, [eventID]);

  // Handle saving edits, send new event data to the backend
  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = { ...event, eventID }; // Include eventID in the payload
      await axios.post("http://localhost:5000/edit_event_details", updatedEvent);
      router.push(`/events?id=${eventID}`);
    } catch (error) {
      console.log("Handle Save Error: ", error);
    }
  };

  // Handle deleting an event, post request to backend
  const handleDeleteEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/delete_event_details", { eventID });
    } catch (error) {
      console.log("Handle Delete Error: ", error);
    }
    router.push("/");
  };

  // Handle first end event click, set end state to true and switch to confirm state
  const handleEndEvent = async (e) => {
    e.preventDefault();
    setEndState(true);
  };

  // Handle typing in the summary box
  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  // Handle confirming to end event, send summary to backend to update description
  const handleEndConfirm = async (e) => {
    e.preventDefault();
    try {
      const confirmEndData = { summary, eventID };
      await axios.post("http://localhost:5000/end_event", confirmEndData);
    } catch (error) {
      console.log("Error with ending the event");
    }
    router.push("/");
  };

  const handleCancelClick = async (e) => {
    e.preventDefault();
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
              className="w-full rounded-lg h-8 px-2 py-1 text-xl outline-0 border resize-none border-blue-100 hover:border-blue-200 active:border-blue-200"
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
            {/* Town Textbox */}
            <div className="w-1/2 flex gap-4">
              <h2 className="text-2xl font-semibold">Town: </h2>
              <textarea
                name="eventTown"
                value={event.town}
                onChange={(e) => setEvent({ ...event, town: e.target.value })}
                className="w-full rounded-lg pt-1 h-8 px-2 outline-0 border resize-none border-blue-100 hover:border-blue-200 active:border-blue-200"
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
              className="w-full rounded-lg h-96 px-2 py-2 outline-0 border resize-none border-blue-100 hover:border-blue-200 active:border-blue-200"
            />
          </div>
          {/* ITEM: Row Four */}
          <div className="flex gap-4 w-full pb-8">
            <button
              className="bg-blue-500 text-white w-1/2 py-2 rounded-xl"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <button
              className="text-black w-1/2 py-2 rounded-xl border border-gray-300"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ITEM: Right Bar*/}
        {endState ? (
          <div className="w-1/3 border border-gray-300 rounded-xl h-128 shadow-lg relative">
            <div className="py-10 px-8">
              <h1 className="text-2xl font-semibold pb-8">Summary</h1>
              <textarea
                placeholder="Enter the event summary here."
                className="w-full h-60 text-sm"
                value={summary}
                onChange={handleSummaryChange}
              />
            </div>
            <div className="absolute bottom-0 py-10 px-8 w-full">
              <button
                className="w-full border border-gray-300 rounded-lg text-black py-2 mb-2"
                onClick={(e) => {
                  e.preventDefault();
                  setEndState(false);
                }}
              >
                Cancel
              </button>
              <button
                className="w-full rounded-lg bg-green-500 text-white py-2"
                onClick={handleEndConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="w-1/3 border border-gray-300 rounded-xl h-128 shadow-lg relative">
  <div className="py-10 px-8">
    <h1 className="text-2xl font-semibold pb-8">Participants</h1>
    <div className="">
      {event.participants.map((participant, index) => (
        <ParticipantCard key={index} username={participant.username} />
      ))}
    </div>
  </div>
            <div className="absolute bottom-0 py-10 px-8 w-full">
              <button
                className="w-full border border-gray-300 rounded-lg text-black py-2 mb-2"
                onClick={handleEndEvent}
              >
                End Event
              </button>
              <button
                className="w-full rounded-lg bg-red-500 text-white py-2"
                onClick={handleDeleteEvent}
              >
                Delete Event
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditEvent;
