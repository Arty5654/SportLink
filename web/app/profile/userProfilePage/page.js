"use client"
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import "@styles/global.css";
import User from "@app/User";
import Image from "next/image";
import ProfileImage from "@public/assets/default-profile.webp";
import { userAgent } from 'next/server';
import Link from 'next/link';

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = JSON.parse(sessionStorage.getItem("email"));

    axios
      .get(`http://localhost:5000/get_user_info?email=${email}`)
      .then((response) => {
        setUserProfile(response.data); // Update state with fetched user profile
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user profile', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex">
      <Sidebar active="search" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="items-end">
            Email:
            {userProfile ? (
              <span className="text-blue-500 text-sm"> {userProfile.email}</span>
            ) : (
              <span>Loading...</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
