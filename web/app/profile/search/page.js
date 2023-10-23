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

function UserLookupPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user_lookup?searchTerm=${searchTerm}`);
      setSearchResults(response.data); // Assuming the response contains the matching user data
    } catch (error) {
      console.error('Error searching for users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, you can automatically trigger the search when the component mounts
    // handleSearch();
  }, []);

  return (
    <div className="w-full flex pb-64">
      <div className="w-1/4">
        <Sidebar active="search" />
      </div>
      <div className="w-3/4">
        <h1>User Lookup</h1>
        <input
          type="text"
          placeholder="Enter username, email, or phone number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>

        {loading && <p>Loading...</p>}

        <div>
          {searchResults.length === 0 && !loading && <p>No results found.</p>}
          {searchResults.map((user) => (
            <div key={user.id}>
              <p>Name: {user.name}</p>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserLookupPage;
