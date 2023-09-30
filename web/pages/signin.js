/* 
Author: Alex Younkers
Created: 9/30/23
@ayounkers, Purdue University
This will serve as the sign up and log in page for SportLink 
*/

import  { useState } from 'react';
import User from '../app/User';
import '../styles/signinStyle.css';

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

    const handleInput = (e) => {
        const { field, val } = e.target;

        setAccData((prev) => ( { ...prev, [field]: val } ));
    }

    
    // creating only for making an account first, 
    //then updating functionality for logging in 

    // jsx code to return
    return (

        <div>
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>


            <div>
                <label className='email'>Email:</label>
                <input            
                type="email"
                id="email"
                name="email"
                value={accData.email}
                onChange={handleInput}
                required 
                />
            </div>

            <div>
                <label className='password'>Password:</label>
                <input            
                type="password"
                id="password"
                name="password"
                value={accData.password}
                onChange={handleInput}
                required 
                />
            </div>

            <div>
                <label className='password'>Verify Password:</label>
                <input            
                type="password"
                id="verifyPassword"
                name="verifyPassword"
                value={accData.verifyPassword}
                onChange={handleInput}
                required 
                />
            </div>

            </form>

        </div>

    );
}