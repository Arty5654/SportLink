/* 
Author: Arteom Avetissian
Created: 10/09/23
@aavetiss, Purdue University
This will serve as the location where users can edit their privacy settings 
*/

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
  /*
  const [displayPhoneNumber, setPhoneNumberPrivacy] = useState(() => {
    const storedDisplayPhoneNumber = isSessionStorageAvailable ? sessionStorage.getItem("displayPhoneNumber") : null;
    return storedDisplayPhoneNumber ? JSON.parse(storedDisplayPhoneNumber) : true;
  });
  */

  const [displayPhoneNumber, setPhoneNumberPrivacy] = useState('private');

  useEffect(() => {
    const storedAccountPrivacy = sessionStorage.getItem('accountPrivacy');
    setAccountPrivacy(storedAccountPrivacy ? JSON.parse(storedAccountPrivacy) : true);

    // Initialize other states based on accountPrivacy
    setDisplayAge(!accountPrivacy);
    setDisplayLocation(!accountPrivacy);
  }, []);

  const handleAccountPrivacyToggle = (checked) => {
    setAccountPrivacy(checked);

    if (checked) {
      setDisplayAge(true);
      setDisplayLocation(true);
    }
  };

  const handleInstagram = () => {
    const appId = "677121907689569";
    const redirectURI = encodeURIComponent("https://SportLink.com/");
    const scope = "user_profile,user_media";
    const responseType = "code";

    //insta auth url
    const instaAuthURL = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
    //redirect user to insta auth url
    window.location.href = instaAuthURL;
  };

  const handleSaveProfile = () => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    let updatedUserData = {
      email: currentUser.email,
      displayPhoneNumber,
      displayAge: accountPrivacy === 'private' ? 'private' : displayAge,
      displayLocation: accountPrivacy === 'private' ? 'private' : displayLocation,
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
        alert('Changes Saved!');
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
            checked={accountPrivacy ? true : displayAge}
            onChange={(checked) => {
              if (!accountPrivacy) setDisplayAge(checked);
            }}
            />
        </div>

        {/* Toggle location visibility */}
        <div className="pb-4">
          <p>Toggle Location Visibility:</p>
          <Switch
            checked={accountPrivacy ? true : displayLocation}
            onChange={(checked) => {
              if (!accountPrivacy) setDisplayLocation(checked);
            }}
          />
        </div>

        {/* Toggle account privacy */}
        <div className="pb-4">
          <p>Toggle Account Privacy:</p>
          <Switch
            checked={accountPrivacy}
            onChange={(checked) => handleAccountPrivacyToggle(checked)}
          />
        </div>

        {/* Toggle Phone Number */}
        <div className="pb-4">
          <p className="mb-3"> Toggle Phone Number Visibility:</p>
            <select
            value={displayPhoneNumber}
            onChange={(e) => setPhoneNumberPrivacy(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="private">Private</option>
            <option value="friends">Share with Friends</option>
            <option value="public">Public</option>
          </select>
        </div>
        <button
          onClick={handleInstagram}
          className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-bold text-white outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 bg-pink-500 resize-none mb-2"
          >
            Connect Instagram
          </button>
        <div className="mt-2">
        <button
              onClick={handleSaveProfile}
              className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-bold text-white outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 bg-blue-500 resize-none"
              >
                Save Privacy Settings
              </button>
              </div>

        {/* ... Existing code ... */}
      </div>
    </div>
  );
}

export default UserProfile;
