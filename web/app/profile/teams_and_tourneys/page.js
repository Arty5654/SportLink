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

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem("user"));
    setUser(user1);
  }, []);

  return (
    <div className="w-full flex pb-64">
        <div className="w-1/4">
            <Sidebar active="teams_and_tourneys"/>
        </div>
        <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
            here are my teams ... and tourneys
        </div>
    </div>
  );
}

export default UserProfile;