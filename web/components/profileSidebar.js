"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const profileSidebar = ({ active }) => {
  return (
    <div className="text-left">
      <div className="flex flex-col gap-4">
        <Link href="/profile">
          <p
            className={`cursor-pointer ${
              active === "info" ? "border-l-4 border-blue-500 pl-1" : ""
            }`}
          >
            My Info
          </p>
        </Link>
        <Link href="/profile/edit">
          <p
            className={`cursor-pointer ${
              active === "edit" ? "border-l-4 border-blue-500 pl-1" : ""
            }`}
          >
            Edit Profile
          </p>
        </Link>
        <p>Notification Settings</p>
        <p>Privacy</p>
        <p>Password & Security</p>
        <p>Settings</p>
      </div>
    </div>
  );
};

export default profileSidebar;
