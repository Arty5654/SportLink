/* 
Author Alex Younkers
10/12/2023
actually changes the password
*/

"use client"

import React, { useEffect } from 'react';
import  { useState } from 'react';
import User from '../../User';
import axios from 'axios';

export default function ChangePassword({email}) {

    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [error, setError] = useState('');
    const [readyToSubmit, setReadyToSubmit] = useState(false);

    const updatePassword = (e) => {
        const newPassword = e.target.value;
            setPassword(newPassword);
            setReadyToSubmit(password && cpassword);
            return newPassword;
    }

    const updateCpassword = (e) => {
        const newPassword = e.target.value;
            setCpassword(newPassword);
            setReadyToSubmit(password && cpassword);
            return newPassword;
    }

    const checkPassword = (password) => {

        // length check
        if (password.length < 8) {
            setError("Password must be at least 8 characters!");
            return false;
        }

        /*use regexes to look in the string for each type of character */

        var regex = /[a-z]/;

        if (!regex.test(password)) {
            setError("Password must contain a lowercase letter!");
            return false;
        }

        regex = /[A-Z]/;
        if (!regex.test(password)) {
            setError("Password must contain an uppercase letter!");
            return false;
        }

        regex = /\d/;
        if (!regex.test(password)) {
            setError("Password must contain a digit!");
            return false;
        }

        if (password !== cpassword) {
            setError("Passwords do not match!");
            return false;
        }

        setError('');
        return true;

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkPassword(password)) {
            return;        
        }

        try {

            console.log("sending request");

            const newPassword = { email: email, password: password };       
            const r = await axios.post('http://localhost:5000/change_user_password', newPassword);

            if (r.status == 200) {

                console.log("password changed!");

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

    const goBack = () => {
        window.location.href = '/signin';
    }

    
return (
    
    <div>
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg shadow-black max-w-lg w-full mt-20 mx-auto">
            
            <div className="mb-2.5">
                <label for="password" className='block mb-1.5 text-gray-800 text-left'>New Password:</label>
                <input            
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={updatePassword}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
            </div>

            <div className="mb-2.5">
                <label for="cpassword" className='block mb-1.5 text-gray-800 text-left'>Confirm Password:</label>
                <input            
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    value={cpassword}
                    onChange={updateCpassword}
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
            Enter
            </button>

        </form>


    </div>

);

}