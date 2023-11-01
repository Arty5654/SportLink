/*
Author: Yash Mehta
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
            email: curr_email,
            friend_email: friend_email
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
            user: friend_email,
            friend: curr_email,
            status: "friends"
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
          {friendRequests && friendRequests.length > 0 && (
            <ul>
              {friendRequests
                .reverse()
                .map((request, index) => (
                <li key={index}>
                  {request.status === "friends"
                    ? `You accepted a request from ${request.user}`
                    : `${request.user} wants to be friends with you!`}
                  {request.status !== "friends" &&
                    <>
                      <Link href={`/profile/userProfilePage?email=${request.user}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">View Profile</button>
                      </Link>
                      <button className="mx-2 bg-green-500 text-white px-4 py-2 rounded-lg" onClick={() => handleAcceptFriendRequest(request.user)}>Accept</button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleDenyFriendRequest(request.user)}>Deny</button>
                    </>
                  }
                </li>
              ))}
            </ul>
          )}
          {!friendRequests || friendRequests.length === 0 && (
            <p>You have no friend requests.</p>
          )}
        </div>
      );
};

export default NotifsPage;
