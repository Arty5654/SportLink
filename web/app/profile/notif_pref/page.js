"use client";

import User from "@app/User";
import axios from 'axios';
import { useEffect, useState } from "react";
import Sidebar from "@components/profileSidebar";
import "@styles/global.css";
import Switch from "react-switch";
import { userAgent } from 'next/server';

const UserProfile = () => {
    const [user, setUser] = useState(new User());
    const [sendEmails, setSendEmails] = useState(true);
    const [showInApp, setShowInApp] = useState(true);

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);

    const fetchData = async () => {
        try {
            var curr_email = user1.email;
            const response = await axios.get(`http://localhost:5000/get_user_notifs_settings?email=${curr_email}`);

            if (response.data) {
                console.log("request responded with: ", response.data);
                setSendEmails(response.data.sendEmail);
                setShowInApp(response.data.showInApp);
            }
        } catch (error) {
            console.error('Error getting user notifs settings', error);
        }
    };

    fetchData(); // Call the async function here
    console.log("sendEmails: " + sendEmails);
    console.log("showInApp: " + showInApp);
  }, []);

  const handleSaveProfile = () => {
    // console.log("sendEmails: " + sendEmails);
    // console.log("showInApp: " + showInApp);

    // send axios request to update user notifs settings
    try {
        const r = axios.post("http://localhost:5000/set_user_notifs_settings", {
            'email': user.email,
            'sendEmail': sendEmails,
            'showInApp': showInApp
        });

        r.then(() => {
            console.log("request responded");
            setSendEmails(sendEmails);
            setShowInApp(showInApp);
            alert("Successfully updated notifs settings!")
        });
    } catch (error) {
        console.error('Error setting user notifs settings', error);
    }
  }

  return (
    <div className="w-full flex pb-64">
        <div className="w-1/4">
            <Sidebar active="notif_pref" />
        </div>
        <div className="w-3/4 pl-8">
            <div className="pb-4 flex items-center">
            <span>Receive Email Notifications:</span>
            <Switch
                className="ml-8"
                checked={sendEmails}
                onChange={(checked) => {
                    console.log("changed sendEmails to: " + !sendEmails); // Log the updated state
                    setSendEmails(!sendEmails); // Update the state
                }}
                />
            </div>

            <div className="pb-4 flex items-center">
            <span>Receive In-App Notifications:</span>
            <Switch
                className="ml-8"
                checked={showInApp}
                onChange={(checked) => {
                    console.log("changed showInApp to: " + !showInApp); // Log the updated state
                    setShowInApp(!showInApp); // Update the state
                }}
                />
            </div>

            <div className="mt-2">
                <button
                onClick={handleSaveProfile}
                className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-bold text-white outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 bg-blue-500 resize-none"
                >
                Save Privacy Settings
                </button>
            </div>
        </div>
    </div>
  );
}

export default UserProfile;
