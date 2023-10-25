"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "@styles/global.css";
import Sidebar from "@components/profileSidebar";
import User from "@app/User";
import Image from "next/image";
import ProfileImage from "@public/assets/default-profile.webp";
import { userAgent } from 'next/server';
import Link from 'next/link';

function UserProfile() {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract the username from the URL path
    const pathArray = window.location.pathname.split('/');
    const username = pathArray[pathArray.length - 1];

    axios.get(`http://localhost:5000/user_lookup?searchTerm=${username}`)
      .then((response) => {
        setUserProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user profile', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
      <h1 className="font-base text-3xl">
        {userProfile.firstName} {userProfile.lastName}
      </h1>
      <p className="text-gray-500 pb-8">{userProfile.username}</p>
      {userProfile.email && ( // Check if userProfile.email exists
        <p className="items-end">
          Email:
          <span className="text-blue-500 text-sm"> {userProfile.email}</span>
        </p>
      )}
    </div>
  );
}

export default UserProfile;
