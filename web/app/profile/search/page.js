"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import "@styles/global.css";
import Image from "next/image";
import ProfileImage from "@public/assets/default-profile.webp";
import Link from 'next/link';
import User from "@app/User";
import def_image from '../../badgeImages/def_image.png';

function UserLookupPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(new User());
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visitedProfiles, setVisitedProfiles] = useState([]);

  useEffect(() => {
    // Fetch the logged-in user on component mount
    const userFromSession = JSON.parse(sessionStorage.getItem("user"));
    setLoggedInUser(userFromSession);

    // Fetch the visited profiles history for the logged-in user
    const savedVisitedProfiles = localStorage.getItem(`visitedProfiles_${userFromSession.email}`);
    if (savedVisitedProfiles) {
      setVisitedProfiles(JSON.parse(savedVisitedProfiles));
    }
  }, []);

  const saveVisitedProfileToHistory = (user) => {
    const updatedVisitedProfiles = [user, ...visitedProfiles];
    const trimmedVisitedProfiles = updatedVisitedProfiles.slice(0, 10); // Limit the history to 10 entries

    setVisitedProfiles(trimmedVisitedProfiles);
    localStorage.setItem(`visitedProfiles_${loggedInUser.email}`, JSON.stringify(trimmedVisitedProfiles));
  };

  const handleSearchTermChange = async (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    try {
      setLoading(true);
      if (input.trim() === '') {
        setSearchResults([]);
      } else {
        const response = await axios.get(`http://localhost:5000/user_lookup?searchTerm=${input}`);
        //sessionStorage.removeItem("user");
        //sessionStorage.setItem("user", JSON.stringify(user));
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching for users', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex pb-64">
      <div className="w-1/4">
      <Sidebar active="search" />
      </div>

      <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
        <h1 className="text-2xl font-semibold mb-4">User Lookup</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter username, email, or phone number"
            value={searchTerm}
            onInput={handleSearchTermChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {searchResults.length === 0 && !loading && (
          <p className="mt-4 text-gray-600">No results found.</p>
        )}

        <div className="mt-4 space-y-4">
          {searchResults.length > 0 && (
            searchResults.map((user) => (
              <div key={user.id} className="bg-white shadow rounded-lg p-4">
                <Link href={`/profile/userProfilePage?email=${user.email}`} onClick={() => saveVisitedProfileToHistory(user)}>
                    {user.imageData === null ? (
                      <img
                        src={def_image.src}
                        alt="Profile Image"
                        style={{ width: "100px", height: "100px", paddingRight: "10px" }}
                      />
                    ) : (
                      <img
                      src={`data:image/png;base64,${user.imageData}`}
                      alt="Profile Image"
                      style={{ width: "100px", height: "100px", paddingRight: "10px" }}
                      />
                    )}
                  <div>
                    <p className="text-gray-600">Name: {`${user.firstName} ${user.lastName}`}</p>
                    <p className="text-gray-600">Username: {user.username}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Visited Profiles</h2>
          <ul>
            {visitedProfiles.map((user, index) => (
              <li key={index}>{user.firstName} {user.lastName}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserLookupPage;
