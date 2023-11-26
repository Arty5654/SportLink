"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import LogoutButton from "@app/signin/LogoutButton";
import axios from "axios";
import User from "@app/User";

const Nav = () => {
  const [user, setUser] = useState(new User());
  const [pendingRequests, setPendingRequests] = useState(false);

    useEffect(() => {
        const user1 = JSON.parse(sessionStorage.getItem("user"));
        setUser(user1);

        if (user1 == null) {
          console.log("No user logged in");
        } else {
          console.log("User logged in:", user1.email);
          const fetchData = async () => {
            try {
              var curr_email = user1.email;
              const r = await axios.get(`http://localhost:5000/get_user_notifs_settings?email=${curr_email}`);

              if (r.data) {
                if (r.data.showInApp) {
                  try {
                    const response = await axios.get(`http://localhost:5000/get_friend_requests?email=${curr_email}`);

                    // only set friend requests if the data array is not empty
                    if (response.data.length > 0) {
                      for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].status == "pending") {
                          console.log("Pending friend requests found for", curr_email)
                          setPendingRequests(true);
                          break;
                        }
                      }
                    }
                  } catch (error) {
                    console.error('Error getting user notifs settings', error);
                  }
                } else {
                  console.log("User has notifs turned off");
                }
              }
            } catch (error) {
              console.error('Error checking notif prefs', error);
            }
          };

        fetchData(); // Call the async function here
        }
    }, []);

  return (
    <nav className="w-full bg-white text-black h-12 border-b border-grey-500 flex items-center justify-between py-8 mb-24">
      <div className="flex gap-2">
        <div className="relative group">
          <Link href="/maps">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>

            <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
              Maps
            </span>
          </Link>
        </div>

        <div className="relative group">
          <Link href="/teams_and_tourneys">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                troke-linejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>

            <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
              Teams & Tournaments
            </span>
          </Link>
        </div>
      </div>
      <Link href="/">
        <div className="flex gap text-3xl font-semibold">
          <p className="text-green-500">Sport</p>
          <p className="text-blue-500">Link</p>
        </div>
      </Link>

      <div className="flex gap-2 items-center">
        <div className="relative group px-7">
          <LogoutButton />
        </div>
        <div className="relative group">
          <Link href="/notifs">
            {! pendingRequests
            ? <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              : <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.4em"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ff0000"
                  d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
                />
              </svg>
            }

            <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
              Notifications
            </span>
          </Link>
        </div>

        <div className="relative group">
          <Link href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>

            <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
              Your Account
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
