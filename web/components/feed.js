import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const HistoryBar = () => {
  // REMINDER: Change padding for outline component
  return (
    <div className="border border-gray-400 rounded-xl px-4 pt-6 pb-96">
      <h1 className="font-base text-xl pb-8">Event History</h1>
      <p>none</p>
    </div>
  );
};

const EventCard = ({ event }) => {
  const status = event.currentParticipants < event.maxParticipants ? "Open" : "Closed";
  const router = useRouter();

  const handleEventClick = () => {
    router.push(`/events?id=${event._id}`);
  };

  return (
    <div className="relative border border-gray-400 rounded-xl px-4 py-6 mb-4 h-64">
      <h1 className="font-semibold cursor-pointer" onClick={handleEventClick}>
        {event.title}
      </h1>
      <p className="text-sm text-gray-500 pb-4 cursor-pointer" onClick={handleEventClick}>
        {event.sport} in {event.city} - <span className="text-blue-500">{status}</span>
      </p>
      <p className="text-sm pb-4 cursor-pointer" onClick={handleEventClick}>
        {event.desc}
      </p>

      <p className="text-sm text-blue-500 ">
        People Registered:{" "}
        <span>
          {event.currentParticipants} / {event.maxParticipants}
        </span>
      </p>
    </div>
  );
};

const Feed = () => {
  const [events, setEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState("All"); // Initialize with "All" as the default option

  useEffect(() => {
    // Make an HTTP GET request to fetch events from your Flask backend
    axios.get("http://localhost:5000/get_events").then((response) => {
      setEvents(response.data);
    });
  }, []);

  return (
    <div className="w-full">
      <h1 className="font-semibold text-3xl pb-8">Events</h1>
      <div className="flex gap-8">
        <div className="w-4/5">
          {/* ITEM: Filter */}
          <div className="border border-gray-400 rounded-xl px-2 py-2 mb-6">
            <label htmlFor="sportFilter" className="pr-4">
              Sport:
            </label>
            <select
              id="sportFilter"
              name="sport"
              onChange={(e) => setSelectedSport(e.target.value)}
              value={selectedSport}
            >
              <option value="All">All</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Weightlifting">Weightlifting</option>
              <option value="Soccer">Soccer</option>
            </select>
          </div>
          {/* ITEM: Event Cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* Map through the events array, filter and render event cards based on the selected sport */}
            {events
              .filter((event) => selectedSport === "All" || event.sport === selectedSport)
              .map((event, index) => (
                <EventCard key={index} event={event} {...event} />
              ))}
          </div>
        </div>
        <div className="w-1/5">
          <HistoryBar />
        </div>
      </div>
    </div>
  );
};

export default Feed;
