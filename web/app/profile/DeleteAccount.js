/* 
Author Alex Younkers
10/11/2023
This is the password reset forms
*/

"use client"

import React from 'react';
import  { useState } from 'react';
import axios from 'axios';




export default function DeleteAccount(email) {

    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {


        // API call to take user out of database

        try {

            console.log("sending request");
       
            const e = email;
            console.log(typeof(e));
            const r = await axios.post('http://localhost:5000/delete_account', email, {
                        headers: {
                        'Content-Type': 'text/plain',
                        },
                    }); 

            console.log("Account went bye bye");

            // takes user out of session and sets them back to sign in page
            sessionStorage.removeItem('user');
            window.location.href = '/signin';

        } catch (error) {
            setError("Issue deleting account");
            return;
        }

    }


    return (

        <div className='flex flex-col items-center justfy-center py-6 border my-5 rounded-md'>
            
            <button className="bg-red-500 text-white rounded-full px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-green-500 hover:text-black"
            onClick={() => setDeleting(true)}>
                Delete Account
            </button>

            {deleting && 
            <div className="flex flex-col items-center justify-center py-5">
                <h3 className='text-xl font-bold my-4'>Are you sure you want to delete your account?</h3>
                <div className="flex space-x-4">
                    <button 
                        className="bg-red-500 text-white rounded-full px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-green-500 hover:text-black"
                        onClick={handleDelete}>
                        Confirm
                    </button>
                    <button 
                        className="bg-red-500 text-white rounded-full px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-green-500 hover:text-black"
                        onClick={() => setDeleting(false)}>
                        Go back
                    </button>
                    {error && <p className="text-center text-red-500 mb-4">{error}</p>}
                </div>
            </div>
            }

        </div>
    );

}