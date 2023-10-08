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
        currentUsername: '',
        newUsername: '',
    });

    const handlePhoneNumberChange = (e) => {
        //remove non numbers
        let phoneNumber = e.target.value.replace(/\D/g, '');
        //dashes every 3
        phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

        setProfileData((prev) => ({
          ...prev,
          phoneNumber,

        }));
      };

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

    const handleUsernameChange = (e) => {
      setProfileData({
        ...profileData,
        newUsername: e.target.value,
      });
    };

    const handleInstagram = () => {
      const appId = '677121907689569';
      const redirectURI = encodeURIComponent('https://SportLink.com/');
      const scope = 'user_profile,user_media';
      const responseType = 'code';

      //insta auth url
      const instaAuthURL = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
      //redirect user to insta auth url
      window.location.href = instaAuthURL;
    }

    const handleSaveProfile = () => {
        if (profileData.newUsername.toLowerCase() == profileData.currentUsername.toLowerCase()) {
          alert("This is your current username");
          return;
        }
        //TODO: update user info in backend
    }

    const handlePasswordChange = () => {
      //TODO: send an email to change password
    }

    return (
    <div className="w-full text-left max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-green-500">Edit Profile</h1>
        <div className="mb-4">
        <label className="text-blue-500 block">Phone Number:</label>
    <input
      type="tel"
      id="phoneNumber"
      name="phoneNumber"
      value={profileData.phoneNumber}
      onChange={handlePhoneNumberChange}
      maxLength={12}
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
    <div className="mb-4">
      <label className="text-blue-500 block">Change Username:</label>
      <input
        type="text"
        id="newUsername"
        name="newUsername"
        value={profileData.newUsername}
        onChange={handleUsernameChange}
        className="w-full p-2 border rounded"
      />
  </div>
  <div className="mb-4">
    <button onClick={handleInstagram} className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700">
    Connect with Instagram
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
