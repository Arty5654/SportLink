/* 
Author: Arteom Avetissian
Created: 10/01/23
@aavetiss, Purdue University
This will serve as the location where users can edit their profile settings 
*/

"use client"

import  { useState } from 'react';
import User from '../User';
import "@styles/global.css"


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
    <div className="w-full text-left max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <div className="mb-4">
        <label className="text-blue-500 block">Phone Number:</label>
    <input
      type="tel"
      id="phoneNumber"
      name="phoneNumber"
      value={profileData.phoneNumber}
      onChange={handlePhoneNumberChange}
      maxLength={10}
      required
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="mb-4">
    <label className="block">
      Display Phone Number to Friends:
      <input
        type="checkbox"
        id="displayPhoneNumber"
        name="displayPhoneNumber"
        checked={profileData.displayPhoneNumber}
           onChange={handleDisplayPhoneNumberChange}
        className="ml-2"
      />
    </label>
  </div>
  <div className="mb-4">
    <label className="block">Account Status:</label>
    <span>{profileData.isAccountPublic ? 'Public' : 'Private'}</span>
    <button
      onClick={toggleAccountStatus}
      className="ml-2 py-1 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
    >
      Toggle Account Status
    </button>
  </div>
  <button
    onClick={handleSaveProfile}
    className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
  >
    Save Profile
  </button>
</div>
    );

}
