/* 
Author Alex Younkers
10/3/2023
This is the log in form component of the login/signup page
*/

"use client"
import React, { useEffect } from 'react';
import  { useState } from 'react';
import User from '../User';
import axios from 'axios';


export default function LogInForm() {

    const [accData, setAccData] = useState({
        email: '',
        password: '',
    });

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


        if (!checkEmail(accData.email)) {
            return;
        }

        /* backend will then check for the correct email, password match,
        and if valid send back the correct user object */

        try {

            console.log("sending request");

            const reqUser = { email: accData.email, password: accData.password };       
            const r = await axios.post('http://localhost:5000/login', reqUser);

            if (r.status == 200) {


                console.log("201 baby");
                const newUser = new User(r.data.email, r.data.username);
                sessionStorage.setItem('user', JSON.stringify(newUser));

                console.log(JSON.parse(sessionStorage.getItem('user')));

                //setUser(JSON.parse(sessionStorage.getItem('user')));

                // navigate to new page assuming user has been created
                console.log("right before");
                window.location.href = '/profile';
            }

        } catch (error) {

            if (error.response && error.response.status == 401) {
                setError(error.response.data.error);
            }
            return;
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        /* updates an input field, and tracks if all inputs are non-null */
        setAccData((prev) => {
            const newData = { ...prev, [name]: value };
            setReadyToSubmit(newData.email && newData.password);
            return newData;
        });
    }

    const [error, setError] = useState('');

    const [readyToSubmit, setReadyToSubmit] = useState(false);


    return (

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg shadow-black max-w-lg w-full mx-auto">
            
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
                <input            
                    type="password"
                    id="password"
                    name="password"
                    value={accData.password}
                    onChange={handleInput}
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
            Sign In
            </button>

        </form>


    );


}