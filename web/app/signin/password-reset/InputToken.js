/* 
Author Alex Younkers
10/11/2023
lets a user put in a token from the password reset email
*/

"use client"

import React, { useEffect } from 'react';
import  { useState } from 'react';
import User from '../../User';
import axios from 'axios';

export default function InputToken({ tokenVerified, email}) {

    const [reqToken, setReqToken] = useState('');
    const [error, setError] = useState('');
    const [readyToSubmit, setReadyToSubmit] = useState(false);

    const updateToken = (e) => {
        const newToken = e.target.value;
            setReqToken(newToken);
            setReadyToSubmit(reqToken);
            return newToken;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            console.log("sending request");

            const tokenVals = { email: email, reqToken: reqToken };       
            const r = await axios.post('http://localhost:5000/input_reset_token', tokenVals);

            if (r.status == 200) {

                console.log("token verified!");
                tokenVerified();

                // navigate back to signin page
                //window.location.href = '/signin';
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

        <div>
            <button className='bg-gray-200 block mx-auto mt-18 py-2 px-5 rounded hover:bg-blue-700 hover:text-white mb-20'
            onClick={goBack}>
                BACK TO LOG IN PAGE
            </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg shadow-black max-w-lg w-full mx-auto">
            
            <div className="mb-2.5">
                <label for="code" className='block mb-1.5 text-gray-800 text-left'>Code:</label>
                <input            
                    type="string"
                    id="code"
                    name="code"
                    value={reqToken}
                    onChange={updateToken}
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