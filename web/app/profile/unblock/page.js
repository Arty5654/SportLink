"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@components/profileSidebar";

const UnblockPage = () => {
  const [user, setUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    // Fetch the user's details
    const userFromSession = JSON.parse(sessionStorage.getItem("user"));
    setUser(userFromSession);

    // Fetch the list of blocked users
    fetchBlockedUsers(userFromSession.email);
  }, []);

  const fetchBlockedUsers = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_blocked_users?email=${email}`);
      setBlockedUsers(response.data);
    } catch (error) {
      console.error("Error fetching blocked users", error);
    }
  };

  const handleUnblockUser = (blockedUserEmail) => {
    try {
      // Perform an action to unblock the user
      const response = axios.post("http://localhost:5000/unblock_user", {
        blocker: user.email,
        blocked_user: blockedUserEmail,
        blocked: false
      });

      response.then(() => {
        // Update the state to remove the unblocked user
        const updatedBlockedUsers = blockedUsers.filter((email) => email !== blockedUserEmail);
        setBlockedUsers(updatedBlockedUsers);
      });
    } catch (error) {
      console.error("Error unblocking user", error);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <Sidebar active="privacy" />
      <div className="ml-8 w-96">
        <h1 className="text-2xl font-bold mb-4">Blocked Users</h1>
        <ul className="space-y-4">
          {blockedUsers.map((blockedUserEmail) => (
            <li
              key={blockedUserEmail}
              className="flex items-center justify-between bg-white p-4 rounded-md shadow-md"
            >
              <span className="text-lg">{blockedUserEmail}</span>
              <button
                onClick={() => handleUnblockUser(blockedUserEmail)}
                variant="contained"
                color="primary"
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UnblockPage;
