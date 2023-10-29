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
  const [loading, setLoading] = useState(true);
  const [reportOptionsVisible, setReportOptionsVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    // Get the email query parameter from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const userEmail = queryParams.get("email");

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
            <p className="text-gray-500 pb-8">{userProfile.username}</p>
          </div>
          <div className="flex gap-8 pb-8 border-b border-gray-200">
            {/* You can add the Friends and Messages links here */}
          </div>
          <div className="flex gap-8 pb-8 border-b border-gray-200">
          <Link
            href="http://localhost:3000/profile/friends"
            className="border border-black bg-black text-white px-8 py-2 rounded-xl"
          >
            Send Friend Request
          </Link>
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
              <p className="items-end">
                Address: <span className="text-sm text-blue-500">{userProfile.city}</span>
              </p>
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
              <p className="items-end">
                Age: <span className="text-sm text-blue-500">{userProfile.age}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;