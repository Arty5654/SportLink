/* 
Author: Arteom Avetissian
Created: 10/09/23
@aavetiss, Purdue University
This will serve as the location where users can edit their privacy settings 
*/

"use client";

import axios from 'axios';
import { useEffect, useState } from "react";
import Sidebar from "@components/profileSidebar";
import "@styles/global.css";
import Switch from "react-switch";
import { userAgent } from 'next/server';

const UserProfile = () => {

  const isSessionStorageAvailable = typeof sessionStorage !== 'undefined';

  // Initialize toggle states from sessionStorage or default to true
   const [displayAge, setDisplayAge] = useState(() => {
    const storedDisplayAge = isSessionStorageAvailable ? sessionStorage.getItem("displayAge") : null;
    return storedDisplayAge ? JSON.parse(storedDisplayAge) : true;
  });

  const [displayLocation, setDisplayLocation] = useState(() => {
    const storedDisplayLocation = isSessionStorageAvailable ? sessionStorage.getItem("displayLocation") : null;
    return storedDisplayLocation ? JSON.parse(storedDisplayLocation) : true;
  });

  const [accountPrivacy, setAccountPrivacy] = useState(() => {
    const storedAccountPrivacy = isSessionStorageAvailable ? sessionStorage.getItem("accountPrivacy") : null;
    return storedAccountPrivacy ? JSON.parse(storedAccountPrivacy) : true;
  });

  const [displayPhoneNumber, setPhoneNumberPrivacy] = useState(() => {
    const storedDisplayPhoneNumber = isSessionStorageAvailable ? sessionStorage.getItem("displayPhoneNumber") : null;
    return storedDisplayPhoneNumber ? JSON.parse(storedDisplayPhoneNumber) : true;
  });

  useEffect(() => {
    setDisplayAge(JSON.parse(sessionStorage.getItem("displayAge")));
    setDisplayLocation(JSON.parse(sessionStorage.getItem("displayLocation")));
    setAccountPrivacy(JSON.parse(sessionStorage.getItem("accountPrivacy")));
    setPhoneNumberPrivacy(JSON.parse(sessionStorage.getItem("displayPhoneNumber")));
  }, []);



  const handleSaveProfile = () => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const updatedUserData = {
      email: currentUser.email,
      displayPhoneNumber,
      displayAge,
      displayLocation,
      accountPrivacy
    };

    sessionStorage.setItem('displayAge', JSON.stringify(displayAge));
    sessionStorage.setItem('displayLocation', JSON.stringify(displayLocation));
    sessionStorage.setItem('accountPrivacy', JSON.stringify(accountPrivacy));
    sessionStorage.setItem('displayPhoneNumber', JSON.stringify(displayPhoneNumber));

    axios.post('http://localhost:5000/privacy', updatedUserData)
      .then((response)=> {
        console.log('Profile updated successfully:', response.data);
        // Keep saved values
        //setProfileData(response.data);
      })
      .catch(error => {
        console.error('Error updating profile', error);
      });
  };

  return (
    <div className="w-full flex pb-64">
      <div className="w-1/4">
        <Sidebar active="privacy" />
      </div>
      <div className="w-3/4 pl-8">
        {/* Toggle age visibility */}
        <div className="pb-4">
          <p>Toggle Age Visibility:</p>
          <Switch
            checked={displayAge}
            onChange={() => {
            setDisplayAge(!displayAge);
          }}
          />
        </div>

        {/* Toggle location visibility */}
        <div className="pb-4">
          <p>Toggle Location Visibility:</p>
          <Switch
            checked={displayLocation}
            onChange={() => {
            setDisplayLocation(!displayLocation);
          }}
          />
        </div>

        {/* Toggle account privacy */}
        <div className="pb-4">
          <p>Toggle Account Privacy:</p>
          <Switch
            checked={accountPrivacy}
            onChange={() => {
            setAccountPrivacy(!accountPrivacy);
          }}
          />
        </div>

        {/* Toggle Phone Number */}
        <div className="pb-4">
          <p>Phone Number Visibility</p>
          <Switch
            checked={displayPhoneNumber}
            onChange={() => {
              setPhoneNumberPrivacy(!displayPhoneNumber);
          }}
        />
        </div>
        <button
              onClick={handleSaveProfile}
              className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-bold text-white outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 bg-blue-500 resize-none"
              >
                Save Privacy Settings
              </button>

        {/* ... Existing code ... */}
      </div>
    </div>
  );
}

export default UserProfile;