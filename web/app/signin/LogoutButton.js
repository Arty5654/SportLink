/* 
Author Alex Younkers
10/11/2023
This is the password reset forms
*/

"use client"

import React from 'react';
import  { useState } from 'react';
import axios from 'axios';




export default function LogoutButton() {

    const handleLogout = () => {

        // takes user out of session
        sessionStorage.removeItem('user');

        window.location.href = '/signin';
    }


    return (

        <div>
            
            <button className="bg-red-500 text-black rounded-full px-4 py-2 transition-colors duration-300 hover:animate-pulse ease-in-out hover:bg-black hover:text-white"
            onClick={handleLogout}>
                Log Out
            </button>

        </div>
    );

}