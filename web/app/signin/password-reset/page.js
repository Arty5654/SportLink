/* 
Author Alex Younkers
10/11/2023
This is the password reset forms
*/

"use client"

import React, { useEffect } from 'react';
import  { useState } from 'react';
import User from '../../User';
import axios from 'axios';
import PasswordReset from './PasswordReset';
import InputToken from './InputToken';
import ChangePassword from './ChangePassword';




export default function passwordreset() {

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const handleEmailSent = (email) => {
        setEmailSent(true);
        setEmail(email);
    }

    const handleTokenVerify = () => {
        setConfirmed(true);
    }

    return (

        <div>
            <div>
                { (!emailSent) ? 
                    <PasswordReset onSent={handleEmailSent} /> 
                : 
                    <InputToken tokenVerified={handleTokenVerify} email={email}/>
                }
            </div>

            {confirmed &&
                <div>
                    <ChangePassword email={email}/>
                </div>
            }

        </div>
    );

}