"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import "@styles/global.css";
import Image from "next/image";
import ProfileImage from "@public/assets/default-profile.webp";
import Link from 'next/link';

function UserLookupPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visitedProfiles, setVisitedProfiles] = useState([]);

  // Load visited profiles history from localStorage on component mount
  useEffect(() => {
    const savedVisitedProfiles = localStorage.getItem('visitedProfiles');
    if (savedVisitedProfiles) {
      setVisitedProfiles(JSON.parse(savedVisitedProfiles));
    }
  }, []);

  // Save visited profile to history
  const saveVisitedProfileToHistory = (user) => {
    const updatedVisitedProfiles = [user, ...visitedProfiles];
    setVisitedProfiles(updatedVisitedProfiles);

    // Save the updated history to localStorage
    localStorage.setItem('visitedProfiles', JSON.stringify(updatedVisitedProfiles));
  };

  const handleSearchTermChange = async (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    try {
      setLoading(true);
      //clear search results when empty
      if (input.trim() === '') {
        setSearchResults([]);
      } else {
        const response = await axios.get(`http://localhost:5000/user_lookup?searchTerm=${input}`);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching for users', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar active="search" />

      <div className="w-3/4 p-8">
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
          {searchResults.map((user) => (
            <div key={user.id} className="bg-white shadow rounded-lg p-4">
              <Link href={`/profile/userProfilePage?email=${user.email}`} onClick={() => saveVisitedProfileToHistory(user)}>
                <img
                  src={ProfileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-600">Name: {`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-gray-600">Username: {user.username}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                </div>
              </Link>
            </div>
          ))}
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
