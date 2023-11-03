/*
Author: Yash Mehta and Arteom Avetissian
Created: 10/10/2023
@ymehta10, Purdue University
This component represents the friends page, an extension of the profile page.
*/

"use client";

import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { UserContext } from "@app/UserContext";
import User from "@app/User";

const NotifsPage = () => {
    const [user, setUser] = useState(new User());
    const [friendRequests, setFriendRequests] = useState([]);
    const [reportNotifications, setReportNotifications] = useState([]);

    useEffect(() => {
        const user1 = JSON.parse(sessionStorage.getItem("user"));
        setUser(user1);

        const fetchData = async () => {
          try {
            var curr_email = user1.email;
            console.log("Getting friend requests for user:", curr_email)
            const response = await axios.get(`http://localhost:5000/get_friend_requests?email=${curr_email}`);

            // only set friend requests if the data array is not empty
            if (response.data.length > 0) {
              setFriendRequests(response.data);
              console.log("Friend requests response:", response.data)
            }
          } catch (error) {
            console.error('Error getting friend requests', error);
          }
        };

        fetchData(); // Call the async function here
    }, []);

    useEffect(() => {
      const user1 = JSON.parse(sessionStorage.getItem("user"));
      setUser(user1);

      const fetchData = async () => {
        try {
          var curr_email = user1.email;
          //console.log("Getting friend requests for user:", curr_email)
          const response = await axios.get(`http://localhost:5000/get_reports?email=${curr_email}`);



          // only set friend requests if the data array is not empty
          if (response.data.length > 0) {
            setReportNotifications(response.data);
            console.log("Report response:", response.data)
          }
        } catch (error) {
          console.error('Error getting potential reports', error);
        }
      };

      fetchData(); // Call the async function here
  }, []);

  const getFormattedDate = (timestamp) => {
    if (typeof timestamp === 'string' && timestamp.includes('T')) {
      const [dateString] = timestamp.split('T');
      return dateString; // Return only the date part
    }

    const date = new Date(timestamp);

    if (Object.prototype.toString.call(date)) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }

    return 'Invalid Date';
  };


    // infinite scroll, loading 5 more friends at a time
    const handleScroll = () => {
        const friendsList = friendsListRef.current;
        const scrollPosition = friendsList.scrollTop;
        const visibleHeight = friendsList.clientHeight;

        if (scrollPosition + visibleHeight >= friendsList.scrollHeight) {
        // Check if all friends have been shown
        if (friendsToShow < friends.length) {
            console.log("Loading 5 more friends");
            setFriendsToShow(friendsToShow + 5);
        }
        }
    };

    const handleAcceptFriendRequest = (requester) => {
        // accepting friend request
        var curr_email = user.email;
        var friend_email = requester;
        console.log("Accepting friend request from " + friend_email + ", using POST");
        const response = axios.post("http://localhost:5000/accept_friend_request", {
            "email": curr_email,
            "friend_email": friend_email
        })
        .then((response) => {
          console.log("Friend request accepted");
          // remove friend request from list
          var updatedFriendRequests = friendRequests.filter((request) => {
            return request.user !== friend_email;
          });

          // add an entry of the format "You accepted a request from friend_email"
          var newFriendRequest = {
            user: friend_email,
            status: "friends"
          }

          updatedFriendRequests.push(newFriendRequest);

          setFriendRequests(updatedFriendRequests);
        });
    }

    const handleDenyFriendRequest = (requester) => {
        // denying friend request
        var curr_email = user.email;
        var friend_email = requester;
        console.log("Denying friend request from " + friend_email + ", using POST");
        const response = axios.post("http://localhost:5000/deny_friend_request", {
            "email": curr_email,
            "friend_email": friend_email,
        })
        .then((response) => {
          console.log("Friend request denied");
          // remove friend request from list
          var updatedFriendRequests = friendRequests.filter((request) => {
            return request.user !== friend_email;
          });

          setFriendRequests(updatedFriendRequests);
        });
    }

    return (
        <div>
          <div className="pb-4 flex justify-between items-center">
            {" "}
            {/* Use flex to align "Your Friends" and "Add Friends" */}
            <h1 className="font-base text-3xl">Notifications</h1>
          </div>
          {reportNotifications && reportNotifications.length > 0 && (
                <ul>
                    {reportNotifications.map((report, index) => (
                        <li key={index}>
                            <p>{`You have been reported for: ${report.report_reason}`}</p>
                            <p>{`Date: ${(report.timestamp)}`}</p>
                        </li>
                    ))}
                </ul>
            )}
            {!reportNotifications || reportNotifications.length === 0 && (
                <p>You have no reported notifications.</p>
            )}
          {friendRequests && friendRequests.length > 0 && (
            <ul>
              {friendRequests.reverse()
                .map((request, index) => (
                  <li key={index} className="font-bold bg-gray-100 p-2 rounded-md mb-3 flex justify-between items-center">
                      {request.status === "friends"
                        ? <>
                          <div>
                            You're now friends with {request.user}
                          </div>
                          <div className="flex space-x-2">
                            <Link href={`/profile/userProfilePage?email=${request.user}`}>
                              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">View Profile</button>
                            </Link>
                          </div>
                        </>
                        : <>
                          <div>
                            {request.user} wants to be friends with you!
                          </div>
                          <div className="flex space-x-2">
                            <Link href={`/profile/userProfilePage?email=${request.user}`}>
                              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">View Profile</button>
                            </Link>
                            <button className="mx-2 bg-green-500 text-white px-4 py-2 rounded-lg" onClick={() => handleAcceptFriendRequest(request.user)}>Accept</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleDenyFriendRequest(request.user)}>Deny</button>
                          </div>
                        </>
                      }
                  </li>
                )
              )}
            </ul>
          )}
          {!friendRequests || friendRequests.length === 0 && (
            <p>You have no friend requests.</p>
          )}
        </div>
      );
};

export default NotifsPage;
