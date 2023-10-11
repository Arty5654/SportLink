/* 
Author: Alex Younkers
Created: 9/30/23
@ayounkers, Purdue University
This will serve as the sign up and log in page for SportLink 
*/


"use client"

import React,{ useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import axios from 'axios';
import User from '@app/User';
import jwtDecode from 'jwt-decode'

export default function SignIn() {

    const [login, setLogin] = useState(false);
    const [googleError, setGoogleError] = useState('');
    const [user, setUser] = useState();

    const handleSuccess = ( (response) => {

        try {

            // decode the credential from google API and send to function
            const decodedCredentials = jwtDecode(response.credential);
            console.log(decodedCredentials);
            handleGoogleSignin(decodedCredentials);

        } catch (error) {
            setGoogleError("Error decoding response token.");
        }
    });

    const handleGoogleSignin = async (user) => {

        const userData = {
            email: user.email,
            name: user.name,
            googleId: user.sub
        };

        // store user in database with unique username, then return final username as sign of success
        try {

            console.log("post request sent");
            const r = await axios.post('http://localhost:5000/google_signin', userData);

            if (r.status == 201) {
                console.log("account created");

                // if the user is creating an account, new user objec
                const newUser = new User(userData.email, r.data.username, userData.name);              
                sessionStorage.setItem('user', JSON.stringify(newUser));

                // navigate to new page assuming user has been created
                window.location.href = '/profile';

            } else if (r.status == 200) {
                console.log("logged back in");

                // logging into an account -> give them their data
                const newUser = new User(userData.email, r.data.username, userData.name, r.data.phoneNumber);              
                sessionStorage.setItem('user', JSON.stringify(newUser));

                console.log(newUser);

                // navigate to new page assuming user has been created
                //window.location.href = '/profile';

            }

        } catch (error) {

            console.log("error caught");

            if (error.response && error.response.status == 401) {
                setGoogleError("Email has already been registered with a non-google account!");
            } else {
                setGoogleError("Error creating account!");
            }           
            return;
        }

    }

    const handleGoogleError = () => {
        setGoogleError("Error in signing in with google! Please retry.")
    }

    // jsx code to return
    return (

        <div>

            <h1 className="text-6xl text-center mb-10 font-bold" >
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
               {googleError && <p className="text-red-500 text-center mb-6">{googleError}</p> }
            </div>

            <h1 className="text-3xl text-center">
                {login ? 'Log In' : 'Create Account'}
            </h1>


            <div className='flex justify-center p-t-2.5 min-h-[2em] w-full'>
                {login ? <LogInForm /> : <SignUpForm />}
            </div>

            <div className='flex justify-center p-t-2.5 mt-12 min-h-[2em] w-full'>
                <GoogleOAuthProvider clientId='40919981410-1r3guugh9277i4het6fes48sna96etir.apps.googleusercontent.com'>
                    <GoogleLogin
                        clientId='40919981410-1r3guugh9277i4het6fes48sna96etir.apps.googleusercontent.com'
                        onSuccess={handleSuccess}
                        onFailure={handleGoogleError}
                    />
                </GoogleOAuthProvider>
            </div>
      
        </div>

    );
}