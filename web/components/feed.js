import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import User from "@app/User";

const HistoryCard = ({ event }) => {
  const [user, setUser] = useState(new User());
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  const handleEventClick = () => {
    router.push(`/events?id=${event._id}`);
  };

  const deleteEventHistory = () => {
    axios
      .post("http://localhost:5000/delete_event_history", {
        user: user.username,
        event: event._id,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("You have deleted an event from histoy");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error joining event: ", error);
      });
  };

  return (
    <div className="border-l border-gray-500 pl-2 flex justify-between items-center">
      <p className="text-sm cursor-pointer py-1" onClick={handleEventClick}>
        {event.title}
      </p>
      <p className="text-sm text-red-500 cursor-pointer" onClick={deleteEventHistory}>
        x
      </p>
    </div>
  );
};

const HistoryBar = () => {
  const [user, setUser] = useState(new User());
  const [eventHistory, setEventHistory] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);

    // Fetch event history for the user
    if (currentUser) {
      axios
        .get(`http://localhost:5000/get_event_history?username=${currentUser.username}`)
        .then((response) => {
          console.log("History - Response Data: ", response.data);
          setEventHistory(response.data);
        });
    }
  }, []);

  return (
    <div className="border border-gray-400 rounded-xl px-4 pt-6 pb-96 shadow-lg">
      <h1 className="font-base text-xl pb-8">Event History</h1>
      <div>
        {eventHistory.length === 0 ? (
          <p className="text-sm text-gray-600">You have no events in your history.</p>
        ) : (
          eventHistory.map((event, index) => (
            <HistoryCard key={index} event={event} {...event} />
          ))
        )}
      </div>
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
    <div className="relative border border-gray-400 rounded-xl px-4 py-6 mb-4 h-64 shadow-lg">
      <h1 className="font-semibold cursor-pointer" onClick={handleEventClick}>
        {event.title}
      </h1>
      <p className="text-sm text-gray-500 pb-4 cursor-pointer" onClick={handleEventClick}>
        {event.sport} in {event.town} - <span className="text-blue-500">{event.level}</span>
      </p>
      <p className="text-sm pb-4 cursor-pointer" onClick={handleEventClick}>
        {event.desc}
      </p>

      <p className="text-sm absolute bottom-6">
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

const Feed = () => {
  const [events, setEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All"); // Initialize with "All" as the default option

  useEffect(() => {
    axios.get("http://localhost:5000/get_events").then((response) => {
      console.log("Feed - Response Data: ", response.data);
      setEvents(response.data);
    });
  }, []);

  return (
    <div className="w-full">
      <h1 className="font-semibold text-3xl pb-8">Events</h1>
      <div className="flex gap-8">
        <div className="w-4/5">
          {/* ITEM: Filter */}
          <div className="border border-gray-400 rounded-xl px-2 py-2 mb-6 flex gap-6">
            <div>
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
            <div>
              <label htmlFor="levelFilter" className="pr-4">
                Level:
              </label>
              <select
                id="levelFilter"
                name="level"
                onChange={(e) => setSelectedLevel(e.target.value)}
                value={selectedLevel}
              >
                <option value="All">All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* ITEM: Event Cards */}
          <div className="grid grid-cols-3 gap-4">
            {events
              .filter(
                (event) =>
                  (selectedSport === "All" || event.sport === selectedSport) &&
                  (selectedLevel === "All" || event.level === selectedLevel)
              )
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
