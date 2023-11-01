/* 
Author Alex Younkers
10/11/2023
This is the password reset forms
*/

"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";

export default function LogoutButton() {
  const handleLogout = () => {
    // takes user out of session
    sessionStorage.removeItem("user");

    window.location.href = "/signin";
  };

  return (
    <div>
      <button
        className="bg-black text-white rounded-full px-4 py-1 transition-colors duration-300 ease-in-out hover:bg-red-500 hover:text-white"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}
