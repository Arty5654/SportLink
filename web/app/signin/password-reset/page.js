/* 
Author Alex Younkers
10/11/2023
This is the log in form component of the login/signup page
*/

"use client"

import React, { useEffect } from 'react';
import  { useState } from 'react';
import User from '../../User';
import axios from 'axios';

export default function PasswordReset() {

    const [email, setEmail] = useState('');

    const updateEmail = (e) => {
        const newEmail = e.target.value;
            setEmail(newEmail);
            setReadyToSubmit(email);
            return newEmail;
    }

    const [error, setError] = useState('');
    const [readyToSubmit, setReadyToSubmit] = useState(false);


    const checkEmail = (email) => {

        /* regex for email validation cited from w3resource.com form validation page */
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regex.test(email)) {
            setError("Please use a valid email!");
            return false;
        }

        return true;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkEmail(email)) {
            return;
        }

        try {

            console.log("sending request");

            const reqUser = {email: email};       
            const r = await axios.post('http://localhost:5000/reset_password', reqUser);

            if (r.status == 200) {

                console.log("email sent");

                // navigate back to signin page
                window.location.href = '/signin';
            }

        } catch (error) {

            if (error.response && error.response.status == 401) {
                setError(error.response.data.error);
            }
            return;
        }

    }

    
return (

    <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg shadow-black max-w-lg w-full mx-auto">
            
            <div className="mb-2.5">
                <label for="email" className='block mb-1.5 text-gray-800 text-left'>Email:</label>
                <input            
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={updateEmail}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
            </div>

            <div className="mb-6 mt-8">
                {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            </div>

            <button 
            disabled={!readyToSubmit}
            className={`block mx-auto mt-18 py-2 px-5 rounded hover:bg-blue-700 hover:text-white
            ${readyToSubmit ? 
                'bg-green-500 text-white' : 
                'bg-gray-200 text-black cursor-not-allowed' 
            }`} type="submit">
            Get Reset Email!
            </button>

        </form>

);


}