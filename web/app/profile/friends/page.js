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
import ProfileImage from "@public/assets/default-profile.webp";
import { UserContext } from "@app/UserContext";
import User from "@app/User";

const FriendsPage = () => {
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
    const fetchData = async () => {
      try {
        var curr_email = user.email;
        console.log("Getting friends for user:", curr_email)
        const response = await axios.get(`http://localhost:5000/get_friends?email=${curr_email}`);

        // only set friends if the data array is not empty
        if (response.data.length > 0) {
          console.log("response.data:", response.data)
          setFriends(response.data);
        }
      } catch (error) {
        console.error('Error getting friends', error);
      }
    }

    if (user.email) {
      fetchData(); // Call the async function here
    }
  }, [user.email]);

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

  const sendFriendRequest = () => {
    // send a friend request, adding a request to the friends collection
    if (newFriendName) {
      try {
        console.log("sending friend request to " + newFriendName + ", using POST");
        const r = axios.post("http://localhost:5000/send_friend_request", {
          email: user.email,
          friend_email: newFriendName,
        });

        r.then((response) => {
          if (response.status === 200) {
            console.log("Friend request sent");
          } else if (response.status === 204) {
            // pop up saying that the user is already friends with this person
            console.log("There is already a request pending between you and this user!");
          }
        });
      } catch (error) {
        console.log("Error adding friend");
        console.log(error);
      }
    }
    setIsAddingFriends(false); // Hide the input box
    setNewFriendName(""); // Clear the input field
  };

  const handleRemoveFriend = (relationship) => {
    try {
      var email_to_remove = relationship.friend;
      console.log("sending post request to remove " + email_to_remove + " as a friend");
      const r = axios.post("http://localhost:5000/remove_friend", {
        email: user.email,
        friend_email: email_to_remove,
      });

      r.then(() => {
        console.log("request successfully responded");
        const updatedFriends = friends.filter((f) => f !== relationship);
        const updatedUser = { ...user, friends: updatedFriends };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setFriends(updatedFriends); // Update the state variable
      });
    } catch (error) {
      console.log("Error removing friend");
      console.log(error);
    }
  }

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
            onClick={sendFriendRequest}
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
          {friends && friends.length > 0 ? (
            friends.slice(0, friendsToShow).map((relationship) => (
            <div
              key={relationship.friend}
              className="bg-white rounded-lg shadow-md mb-4 flex items-center p-4"
            >
              <img
                src={ProfileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover mr-4r"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-medium">{relationship.friend}</h2>
                <p className="text-gray-500">@{relationship.friend}</p>
              </div>
              <div className="flex flex-col items-stretch ml-4">
                <Link href={`/profile/userProfilePage?email=${relationship.friend}`}>
                  <button className="bg-black text-white px-4 py-2 rounded-lg mb-2 flex justify-center items-center flex-grow">
                    View Profile
                  </button>
                </Link>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2 flex justify-center items-center flex-grow" onClick={() => handleRemoveFriend(relationship)}>
                  Remove Friend
                </button>
              </div>
            </div>
          ))
          ) : (
            <div className="text-center">
              <p className="text-lg">You have no friends yet!</p>
              <p className="text-lg">Add some friends to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;

