"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@components/profileSidebar";
import { Button } from "@mui/material";

const UnblockPage = () => {
  const [user, setUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    // Fetch the user's details
    const userFromSession = JSON.parse(sessionStorage.getItem("user"));
    setUser(userFromSession);

    // Fetch the list of blocked users
    //fetchBlockedUsers(userFromSession.email);
  }, []);

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);

    const fetchData = async () => {
      try {
        var curr_email = user1.email;
        //console.log("Getting friend requests for user:", curr_email)
        const response = await axios.get(`http://localhost:5000/get_blocked_users?email=${curr_email}`);



        // only set friend requests if the data array is not empty
        if (response.data.length > 0) {
          setBlockedUsers(response.data);
          console.log("Blocked Users", response.data)
        }
      } catch (error) {
        console.error('Error getting friend requests', error);
      }
    };

    fetchData(); // Call the async function here
}, []);

  const handleUnblockUser = async (blockedUserEmail) => {
    try {
      // Perform an action to unblock the user
      await axios.post("http://localhost:5000/unblock_user", {
        blocker: user.email,
        blocked_user: blockedUserEmail,
        blocked: false
      });

      setBlockedUsers(blockedUsers.filter((user) => user !== blockedUserEmail));

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
          {blockedUsers.length > 0 ? (
            <ul>
              {blockedUsers.map((block, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-md mb-3">
                  <p>{block}</p>
                  <Button
                    onClick={() => handleUnblockUser(block)}
                    variant="contained"
                    color="primary"
                  >
                    Unblock
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users are currently blocked.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
export default UnblockPage;
