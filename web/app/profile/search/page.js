"use client";

import axios from 'axios';
import { useEffect, useState } from "react";
import Sidebar from "@components/profileSidebar";
import "@styles/global.css";
import User from "@app/User";
import Image from "next/image";
import ProfileImage from "@public/assets/default-profile.webp";
import "@styles/global.css";
import { userAgent } from 'next/server';
import Link from 'next/link';

function UserLookupPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user_lookup?searchTerm=${searchTerm}`);
      setSearchResults(response.data); 
    } catch (error) {
      console.error('Error searching for users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, you can automatically trigger the search when the component mounts
    // handleSearch();
   // sessionStorage.setItem("email", JSON.stringify(user.email));
  }, []);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>

        {searchResults.length === 0 && !loading && (
          <p className="mt-4 text-gray-600">No results found.</p>
        )}

        <div className="mt-4 space-y-4">
          {searchResults.map((user) => (
            <div key={user.id} className="bg-white shadow rounded-lg p-4">
              <Link href={"/profile/userProfilePage"}>
                  <img
                    src={ProfileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-gray-600">Username: {user.username}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Phone: {user.phone}</p>
                  </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserLookupPage;
