/* 
Author: Alex Younkers
Created: 10/2/23
@ayounkers, Purdue University
This is a component for the form of account creation.
Abstracted for more readibility on the code of Sign In page
*/


"use client"
import React from 'react';
import  { useState } from 'react';
import User from '../User';


export default function SignUpForm() {

    const [accData, setAccData] = useState({
        email: '',
        password: '',
        verifyPassword: '',
    });

    // types of error: general, email, password
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        /* 
        Things to do when submission received:
        1. check if all fields are valid
        2. if invalid, display errors and cancel submit
        3. store email, password in a user object and send to the DB
        4. clear all fields, navigate to (profile) page 
        */

        checkPassword(accData.password);

    }

    // use a regex to verify the complexity of a password
    const checkPassword = (password) => {

        // length check
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters!");
            return false;
        }

        /*use regexes to look in the string for each type of character */

        var regex = /[a-z]/;

        if (!regex.test(password)) {
            setPasswordError("Password must contain a lowercase letter!");
            return false;
        }

        regex = /[A-Z]/;
        if (!regex.test(password)) {
            setPasswordError("Password must contain an uppercase letter!");
            return false;
        }

        regex = /\d/;
        if (!regex.test(password)) {
            setPasswordError("Password must contain a digit!");
            return false;
        }

        if (password !== accData.verifyPassword) {
            setPasswordError("Passwords do not match!");
            return false;
        }

        setPasswordError('');
        return true;

    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        /* updates an input field, and tracks if all inputs are non-null */
        setAccData((prev) => {
            const newData = { ...prev, [name]: value };
            setReadyToSubmit(newData.email && newData.password && newData.verifyPassword);
            return newData;
        });
    }



    const [readyToSubmit, setReadyToSubmit] = useState(false);


    return (

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg max-w-lg w-full mx-auto">
            
            <div className="mb-2.5">
                <label for="email" className='block mb-1.5 text-gray-800 text-left'>Email:</label>
                <input            
                    type="email"
                    id="email"
                    name="email"
                    value={accData.email}
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
            </div>

            <div className="mb-2.5">
                <label for="password" className='block text-gray-800 text-left'>Password:</label>
                <p className="text-sm text-gray-400 text-left">(8+ Characters, must have uppercase, lowercase, and a number)</p>
                <input            
                    type="password"
                    id="password"
                    name="password"
                    value={accData.password}
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
                {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>

            <div className="mb-2.5">
                <label for="verifyPassword" className='block mb-1.5 text-gray-800 text-left'>Verify Password:</label>
                <input            
                    type="password"
                    id="verifyPassword"
                    name="verifyPassword"
                    value={accData.verifyPassword}
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
                
            </div>

            <div className="mb-16 mt-8">
                {error && <div className="text-red-500 mb-4"></div>}
            </div>

            <button 
            disabled={!readyToSubmit}
            className={`block mx-auto mt-18 py-2 px-5 rounded hover:bg-blue-700 hover:text-white
            ${readyToSubmit ? 
                'bg-green-500 text-white' : 
                'bg-gray-200 text-black cursor-not-allowed' 
            }`} type="submit">
            Create Account
            </button>

        </form>


    );


}
