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
import Sidebar from "@components/profileSidebar";
import { UserContext } from "@app/UserContext";
import User from "@app/User";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [friendsToShow, setFriendsToShow] = useState(5);
  const friendsListRef = useRef(null);

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);
  }, []);

  useEffect(() => {
    // prints user object
    console.log("Current User:", user);
  }, [user]);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    console.log("Current User:", currentUser);

    // axios get request
    

    axios({
      method: 'get', 
      url: 'http://localhost:5000/retrieve_friends',
      params: {
        user_id: currentUser._id,
      }
    })
    .then(response => {
      console.log("Friends list retrieved successfully!");
      console.log(response.data);
      setFriends(response.data);
    })
    .catch(error => {
      console.log(JSON.stringify(error));
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Request Error:", error.request);
      } else {
        console.error("Axios Error:", error.message);
      }
    });
  }, []);  

  // const friends = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     username: "johndoe",
  //     avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     username: "janedoe",
  //     avatar: "https://randomuser.me/api/portraits/lego/8.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Bob Smith",
  //     username: "bobsmith",
  //     avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Jeff Wilson",
  //     username: "jwilson",
  //     avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "John Doe",
  //     username: "johndoe",
  //     avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
  //   },
  // ];

  // infinite scroll, loading 5 more friends at a time
  const handleScroll = () => {
    const friendsList = friendsListRef.current;
    if (
      friendsList.scrollTop + friendsList.clientHeight ===
      friendsList.scrollHeight
    ) {
      setFriendsToShow(friendsToShow + 5);
    }
  };

  return (
    <div className="w-full flex">
      {/* ITEM: Main Info*/}
      <div className="w-3/4 mx-auto text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
        {/* ITEM: General Info*/}
        <div className="pb-4">
          <h1 className="font-base text-3xl">Your Friends</h1>
        </div>

        {/* ITEM: Friends List Block*/}
        <div
          className="h-64 overflow-y-scroll"
          ref={friendsListRef}
          onScroll={handleScroll}
        >
          {/* Check if friends list is empty or not*/}
          {friends.length === 0 && (
            <div className="text-center">
              <p className="text-lg">You have no friends yet!</p>
              <p className="text-lg">Add some friends to get started.</p>
            </div>
          )}

          {/* Display friends if friends list not empty*/}

          {friends.slice(0, friendsToShow).map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-lg shadow-md mb-4 flex"
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-1/5 rounded-t-lg"
              />
              <div className="p-4 w-3/5">
                <h2 className="text-lg font-medium">{friend.name}</h2>
                <p className="text-gray-500">@{friend.username}</p>
              </div>
              <div className="w-2/5 flex flex-col justify-center items-center">
                <button className="bg-black text-white px-4 py-2 rounded-lg mb-2 w-3/5">
                  View Profile
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg w-3/5">
                  Remove Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
