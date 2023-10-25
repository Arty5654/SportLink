import { useState, useEffect } from "react";

const HistoryBar = () => {
  // REMINDER: Change padding for outline component
  return (
    <div className="border border-gray-400 rounded-xl px-4 pt-6 pb-96">
      <h1 className="font-base text-xl pb-8">Event History</h1>
      <p>none</p>
    </div>
  );
};

const EventCard = ({
  title,
  sport,
  city,
  desc,
  open,
  currentParticipants,
  maxParticpants,
}) => {
  const status = open ? "Open" : "Closed";

  return (
    <div className="relative border border-gray-400 rounded-xl px-4 py-6 mb-4 h-64">
      <h1 className="font-semibold">{title}</h1>
      <p className="text-sm text-gray-500 pb-4">
        {sport} in {city} - <span className="text-blue-500">{status}</span>
      </p>
      <p className="text-sm pb-4">{desc}</p>
      <p className="text-sm text-blue-500 ">
        People Registered:{" "}
        <span>
          {currentParticipants} / {maxParticpants}
        </span>
      </p>
    </div>
  );
};

const Feed = () => {
  const [events, setEvents] = useState([
    {
      title: "5 v 5 Pickup Basketball",
      sport: "Basketball",
      city: "West Lafayette",
      desc: "Come play 5 v 5 pickup basketball at the Purdue Corec. Winner stays on, games to 15 and win by 2.",
      open: true,
      currentParticipants: 6,
      maxParticpants: 10,
    },
    {
      title: "Casual Soccer Match",
      sport: "Soccer",
      city: "New York City",
      desc: "Join us for a casual soccer match at Central Park. All skill levels welcome. We'll divide into teams and have a friendly game.",
      open: false,
      currentParticipants: 6,
      maxParticpants: 10,
    },
    {
      title: "Weekend Tennis Tournament",
      sport: "Tennis",
      city: "Los Angeles",
      desc: "Participate in our weekend tennis tournament at the local tennis courts. Singles and doubles matches available. Prizes for the winners!",
      open: true,
      currentParticipants: 6,
      maxParticpants: 10,
    },
    {
      title: "Flag Football Fun Day",
      sport: "Flag Football",
      city: "Chicago",
      desc: "Come out and enjoy a day of flag football at Grant Park. We'll organize teams and play a series of friendly flag football games.",
      open: true,
      currentParticipants: 6,
      maxParticpants: 10,
    },
  ]);

  return (
    <div className="w-full">
      <h1 className="font-semibold text-3xl pb-8">Events</h1>
      <div className="flex gap-8">
        <div className="w-4/5">
          <div className="grid grid-cols-3 gap-4">
            {/* Map through the events array and render two events in one column */}
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
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
