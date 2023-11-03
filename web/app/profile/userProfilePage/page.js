"use client"
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import "@styles/global.css";
import User from "@app/User";
import ProfileImage from "@public/assets/default-profile.webp";
import Link from 'next/link';

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(new User());
  const [loading, setLoading] = useState(true);
  const [reportOptionsVisible, setReportOptionsVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    // Get the email query parameter from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const userEmail = queryParams.get("email");

    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setLoggedInUser(user1);

    axios
      .get(`http://localhost:5000/get_user_info?email=${userEmail}`)
      .then((response) => {
        setUserProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user profile', error);
        setLoading(false);
      });
  }, []);

  const handleReportClick = () => {
    setReportOptionsVisible(true);
  };

  const handleReportSubmit = () => {
    // Perform report submission action
    axios.post('http://localhost:5000/submit_report', {
      email: userProfile.email,
      reportReason: reportReason,
    })
    .then(response => {
      setReportOptionsVisible(false);
      alert('User reported successfully!');
    })
    .catch(error => {
      console.error('Error submitting report', error);
    });
  };

  const handleSendFriendRequest = () => {
    try {
      console.log("sending friend request to " + userProfile.email + ", using POST");
        const r = axios.post("http://localhost:5000/send_friend_request", {
          email: loggedInUser.email,
          friend_email: userProfile.email,
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
      console.log("Error adding friend", error);
    }
  };

  const handleBlockUser = async (userEmail) => {
    try {
      const response = await axios.post("http://localhost:5000/block_user", {
        blocker: loggedInUser.email, // Blocker's email
        blocked_users: userProfile.email, // Email of the user to be blocked
        blocked: true
      });
  
      if (response.status === 200) {
        alert("User successfully blocked");
      }
    } catch (error) {
      console.error("Error blocking user", error);
    }
  };
  

  return (
    <div className="w-full flex">
      <Sidebar active="search" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
          <div className="pb-8">
            <h1 className="font-base text-3xl">
              {userProfile.firstName} {userProfile.lastName}
            </h1>
            <p className="text-gray-500 pb-8 text-1xl">Username: {userProfile.username}</p>
            <img
                    src={`data:image/png;base64,${userProfile.imageData}`}
                    alt="Profile Image"
                    style={{ width: "100px", height: "100px" }}
                    />
            
          </div>
          <div className="flex gap-8 pb-8 border-b border-gray-200">
            {/* You can add the Friends and Messages links here */}
          </div>
          <div className="flex gap-8 pb-8 border-b border-gray-200">
          <button
            className="border border-black bg-black text-white px-8 py-2 rounded-xl"
            onClick={handleSendFriendRequest}
          >
            Send Friend Request
          </button>
          </div>
          <div className="flex gap-8 pb-8 border-b border-gray-200">
            <button
            className="border border-black bg-black text-white px-8 py-2 rounded-xl"
            onClick={handleReportClick}
            > Report User
            </button>
          </div>
          {reportOptionsVisible && (
          <div>
            <p>Select a reason for reporting:</p>
            <input
              type="text"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter reason"
            />
            <button onClick={handleReportSubmit}>Submit Report</button>
          </div>
        )}
          <div className="flex gap-8 pb-8 border-b border-gray-200">
            <button
            className="border border-black bg-black text-white px-8 py-2 rounded-xl"
            onClick={handleBlockUser}
            > Block User
            </button>
          </div>
          <div className="text-base pb-4">
            <p className="pt-8 pb-4 text-xs text-gray-500">Contact Information</p>
            <div className="flex flex-col gap-4">
             {userProfile.displayPhoneNumber !== "public" && (
                <p className="items-end">
                  Phone Number:{" "}
                  <span className="text-blue-500 text-sm">
                    {userProfile.phoneNumber}
                  </span>
                </p>
              )}
              <p className="items-end">
                Email: <span className="text-blue-500 text-sm"> {userProfile.email}</span>
              </p>
              {userProfile.displayLocation !== "true" && (
                <p className="items-end">
                  Location:{" "}
                  <span className="text-blue-500 text-sm">
                    {userProfile.city}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="pt-8 pb-4 text-xs text-gray-500">Basic Information</p>
            <div className="flex flex-col gap-4">
              <p className="items-end">
                Birthday: <span className="text-sm text-blue-500">{userProfile.birthday}</span>
              </p>
              <p className="items-end">
                Gender: <span className="text-sm text-blue-500">{userProfile.gender}</span>
              </p>
              {userProfile.displayAge !== "true" && (
                <p className="items-end">
                  Age:{" "}
                  <span className="text-blue-500 text-sm">
                    {userProfile.age}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
