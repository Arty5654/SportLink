/* 
Author: Alex Younkers
Created: 9/30/23
@ayounkers, Purdue University
This will serve as the sign up and log in page for SportLink 
*/


"use client"
import React from 'react';
import  { useState } from 'react';
import User from '../User';


export default function SignIn() {

    // store account form field data here
    const [accData, setAccData] = useState({
        email: '',
        password: '',
        verifyPassword: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();


    }

    // can be called for things like mismatched passwords in verify
    const [error, setError] = useState('');

    const [login, setLogin] = useState(false);

    const handleInput = (e) => {
        const { name, val } = e.target;

        setAccData((prev) => ( { ...prev, [name]: val } ));
    }

    
    // creating only for making an account first, 
    //then updating functionality for logging in 

    // jsx code to return
    return (

        <div>

            <h1 className="text-6xl text-center mb-12 font-sans" >
                <span className="text-blue-500">Sport</span>
                <span className="text-green-500">Link</span>
            </h1>


            <div className="flex justify-center space-x-4 mb-12">
                <button onClick={() => setLogin(false)} className="bg-gray-200 text-black py-2 px-5 rounded cursor-pointer font-sans hover:bg-blue-700 hover:text-white">
                    Create Account
                </button>
                <button onClick={() => setLogin(true)} className="bg-gray-200 text-black py-2 px-5 rounded cursor-pointer font-sans hover:bg-blue-700 hover:text-white">
                    Log In
                </button>
            </div>

            <h1 className="text-3xl text-center font-sans">
                {login ? 'Log In' : 'Create Account'}
            </h1>


            <div className='flex justify-center p-t-2.5 min-h-[2em] w-full'>
                <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg max-w-lg w-full mx-auto">
            
                <div className="mb-2.5">
                    <label className='block mb-1.5 text-gray-800 font-sans text-left'>Email:</label>
                    <input            
                        type="email"
                        id="email"
                        name="email"
                        value={accData.email}
                        onChange={handleInput}
                        className="flex w-9/10 text-lg border rounded border-gray-300 p-1"
                        required 
                    />
                </div>

                <div className="mb-2.5">
                    <label className='block mb-1.5 text-gray-800 font-sans text-left'>Password:</label>
                    <input            
                        type="password"
                        id="password"
                        name="password"
                        value={accData.password}
                        onChange={handleInput}
                        className="flex w-9/10 text-lg border rounded border-gray-300 p-1"
                        required 
                    />
                </div>

                <div className="mb-2.5">
                    <label className='block mb-1.5 text-gray-800 font-sans text-left'>Verify Password:</label>
                    <input            
                        type="password"
                        id="verifyPassword"
                        name="verifyPassword"
                        value={accData.verifyPassword}
                        onChange={handleInput}
                        className="flex w-9/10 text-lg border rounded border-gray-300 p-1"
                        required 
                    />
                </div>

                <div className="mb-16 mt-8">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                </div>

                <button className="block mx-auto mt-18 bg-gray-200 text-black py-2 px-5 rounded cursor-pointer font-sans hover:bg-blue-700 hover:text-white" type="submit">Create Account</button>
                </form>
            </div>
      
        </div>

    );
}