/* 
Author: Arteom Avetissian
Created: 10/01/23
@aavetiss, Purdue University
This will serve as the location where users can edit their profile settings 
*/

import  { useState } from 'react';
import User from '../app/User';
import '../styles/editProfileStyle.css';


export default function EditProfile() {

    //store profile data
    const [profileData, setProfileData] = useState( {
        phoneNumber: '',
        displayPhoneNumber: false,
        isAccountPublic: true,
    });

    const handlePhoneNumberChange = (e) => {
        const phoneNumber = e.target.value;

        //check if its 10 digits
        if (/^\d{10}$/.test(phoneNumber)) {
            setProfileData(prev => ({
                ...prev,
                phoneNumber
            }));
        }
    }

    const handleDisplayPhoneNumberChange = (e) => {
        const displayPhoneNumber = e.target.checked;

        setProfileData(prev => ({
            ...prev,
            displayPhoneNumber
        }));
    }

    //account status: public/private
    const toggleAccountStatus = () => {
        setProfileData((prev) => ({
            ...prev,
            isAccountPublic: !prev.isAccountPublic,
        }));
    };


    const handleSaveProfile = () => {
        //TODO: update user info in backend
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            <div>
                <label className='phone'>Phone Number:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                    required
                />
            </div>
            <div>
                <label>
                    Display Phone Number to Friends:
                    <input
                        type="checkbox"
                        id="displayPhoneNumber"
                        name="displayPhoneNumber"
                        checked={profileData.displayPhoneNumber}
                        onChange={handleDisplayPhoneNumberChange}
                    />
                </label>
            </div>
            <div>
                <label>Account Status:</label>
                <span>{profileData.isAccountPublic ? 'Public' : 'Private'}</span>
                <button onClick={toggleAccountStatus}>Toggle Account Status</button>
            </div>
            <button onClick={handleSaveProfile}>Save Profile</button>
        </div>
    );
}
