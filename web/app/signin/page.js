/* 
Author: Alex Younkers
Created: 9/30/23
@ayounkers, Purdue University
This will serve as the sign up and log in page for SportLink 
*/


"use client"

import React,{ useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';

export default function SignIn() {

    const [login, setLogin] = useState(false);
    const [googleError, setGoogleError] = useState('');


    const handleGoogleSignin = (response) => {


    }

    const handleGoogleError = () => {
        setGoogleError("Error in signing in with google! Please retry.")
    }

    // jsx code to return
    return (

        <div>

            <h1 className="text-6xl text-center mb-12 font-bold" >
                <span className="text-blue-500">Sport</span>
                <span className="text-green-500">Link</span>
            </h1>


            <div className="flex justify-center space-x-4 mb-12">

                <button onClick={() => setLogin(false)} className={`py-2 px-5 rounded hover:bg-blue-700 hover:text-white
                ${login ? 'text-black bg-gray-200' : 'text-white bg-green-500'}`}>
                    Sign Up
                </button>

                <button onClick={() => setLogin(true)} className={`py-2 px-5 rounded hover:bg-blue-700 hover:text-white
                ${login ? 'text-white bg-green-500': 'text-black bg-gray-200'}`}>
                    Log In
                </button>
            </div>

            <div>
               {googleError && <p>{googleError}</p> }
            </div>

            <h1 className="text-3xl text-center">
                {login ? 'Log In' : 'Create Account'}
            </h1>


            <div className='flex justify-center p-t-2.5 min-h-[2em] w-full'>
                {login ? <LogInForm /> : <SignUpForm />}
            </div>

            <div className='flex justify-center p-t-2.5 mt-16 min-h-[2em] w-full'>
                <GoogleOAuthProvider clientId='40919981410-uf408qgn3pcglq9pakp2vrepb7j9otuk.apps.googleusercontent.com'>
                    <GoogleLogin 
                        clientId='40919981410-uf408qgn3pcglq9pakp2vrepb7j9otuk.apps.googleusercontent.com'
                        onSuccess={handleGoogleSignin}
                        onError={handleGoogleError}
                    />
                </GoogleOAuthProvider>
            </div>
      
        </div>

    );
}