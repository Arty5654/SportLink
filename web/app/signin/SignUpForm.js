/* 
Author: Alex Younkers
Created: 10/2/23
@ayounkers, Purdue University
This is a component for the form of account creation.
Abstracted for more readibility on the code of Sign In page
*/


"use client"
import React from 'react';
import  { useState, useContext } from 'react';
import User from '../User';
import axios from 'axios';
import { GoogleLogin } from "@react-oauth/google";


export default function SignUpForm() {

    const [accData, setAccData] = useState({
        email: '',
        password: '',
        verifyPassword: '',

        // set username to first part of email
        username: '',
        friends: [],
    });

    

    // types of error: general, email, password
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error) {
            return;
        }

        // validate email, sets errors within the function
        if (!checkEmail(accData.email)) {
            return;
        }

        // this handles password/verifyPassword
        if (!checkPassword(accData.password)) {          
            return;
        }
        

        // set the user object in sessionStorage so it persists for the user
        const newUser = { email: accData.email, password: accData.password };

        // store user in database with unique username, then return final username as sign of success
        try {

            console.log("post request sent");
            const r = await axios.post('http://localhost:5000/create_account', newUser);

            if (r.status == 201) {
                console.log("request successfully responded");

                // the response will contain the new user with email, username, password as an object
                const user = new User(accData.email, r.data.username);
                sessionStorage.setItem('user', JSON.stringify(user));

                // navigate to new page assuming user has been created
                window.location.href = '/profile';

            }

        } catch (error) {

            console.log("error caught");

            if (error.response && error.response.status == 401) {
                setEmailError("Email already registered!");
            } else {
                setError("Error creating account!");
            }           
            return;
        }

    };

    const checkEmail = (email) => {

        /* regex for email validation cited from w3resource.com form validation page */
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regex.test(email)) {
            setEmailError("Please use a valid email!");
            return false;
        }

        return true;
    };

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

    };

    const handleInput = (e) => {
        const { name, value } = e.target;

        /* updates an input field, and tracks if all inputs are non-null */
        setAccData((prev) => {
            const newData = { ...prev, [name]: value };
            setReadyToSubmit(newData.email && newData.password && newData.verifyPassword);
            return newData;
        });
    };



    const [readyToSubmit, setReadyToSubmit] = useState(false);


    return (

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg shadow-black max-w-lg w-full mx-auto">
            
            <div className="mb-2.5">
                <label className='block mb-1.5 text-gray-800 text-left'>Email:</label>
                <input            
                    type="email"
                    id="email"
                    name="email"
                    value={accData.email}
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
                {emailError && <p className="text-red-500">{emailError}</p>}
            </div>

            <div className="mb-2.5">
                <label className='block text-gray-800 text-left'>Password:</label>
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
                <label className='block mb-1.5 text-gray-800 text-left'>Verify Password:</label>
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
