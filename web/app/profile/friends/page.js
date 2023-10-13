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
  const [user, setUser] = useState(new User());
  const [friends, setFriends] = useState([]);
  const [friendsToShow, setFriendsToShow] = useState(5);
  const friendsListRef = useRef(null);
  const [isAddingFriends, setIsAddingFriends] = useState(false); // State to control the input box
  const [newFriendName, setNewFriendName] = useState(""); // State to store the new friend's name

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);
  }, []);

  useEffect(() => {
    // prints user object
    console.log("Current User:", user);
  }, [user]);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setFriends(currentUser.friends);
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

  const handleAddFriendClick = () => {
    setIsAddingFriends(true);
  }

  const handleAddFriend = () => {
    // Handle adding the new friend to your data
    if (newFriendName) {
      // Update the friends list in the database
      try {
        console.log("sending post request to add " + newFriendName + " as a friend");
        const r = axios.post("http://localhost:5000/add_friend", {
          email: user.email,
          friend_email: newFriendName,
        });
        
        r.then(() => {
          console.log("request successfully responded");
          const updatedFriends = [...friends, newFriendName];
          const updatedUser = { ...user, friends: updatedFriends };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          setFriends(updatedFriends); // Update the state variable
        });
      } catch (error) {
        console.log("Error adding friend");
        console.log(error);
      }
    }
    setIsAddingFriends(false); // Hide the input box
    setNewFriendName(""); // Clear the input field
  };

//   const handleRemoveFriend = (friend) => {
//   // Handle removing the friend from your data
//   // Update the friends list in the database
//   try {
//     console.log("sending post request to remove " + friend.email + " as a friend");
//     const r = axios.post("http://localhost:5000/remove_friend", {
//       email: user.email,
//       friend_email: friend.email,
//     });
    
//     r.then(() => {
//       console.log("request successfully responded");
//       const updatedFriends = friends.filter((f) => f.email !== friend.email);
//       const updatedUser = { ...user, friends: updatedFriends };
//       sessionStorage.setItem("user", JSON.stringify(updatedUser));
//       setFriends(updatedFriends); // Update the state variable
//     });
//   } catch (error) {
//     console.log("Error removing friend");
//     console.log(error);
//   }
// };

  return (
    <div className="w-full flex">
      {/* ITEM: Main Info*/}
      <div className="w-3/4 mx-auto text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
        {/* ITEM: General Info*/}
        <div className="pb-4 flex justify-between items-center">
          {" "}
          {/* Use flex to align "Your Friends" and "Add Friends" */}
          <h1 className="font-base text-3xl">Your Friends</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleAddFriendClick}>
            Add Friends
          </button>
        </div>

        {isAddingFriends && (
        <div className="my-4">
          <input
            type="text"
            placeholder="Enter friend's email"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
            onClick={handleAddFriend}
          >
            Add
          </button>
        </div>
        )}

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
              // key={friend.id}
              className="bg-white rounded-lg shadow-md mb-4 flex"
            >
              <img
                src={"https://randomuser.me/api/portraits/men/2.jpg"}
                className="w-1/5 rounded-t-lg"
              />
              <div className="p-4 w-3/5">
                <h2 className="text-lg font-medium">{friend}</h2>
                <p className="text-gray-500">@{friend}</p>
              </div>
              <div className="w-2/5 flex flex-col justify-center items-center">
                <button className="bg-black text-white px-4 py-2 rounded-lg mb-2 w-3/5">
                  View Profile
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg w-3/5" /*onClick={handleRemoveFriend}*/>
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

