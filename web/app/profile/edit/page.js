/* 
Author: Arteom Avetissian
Created: 10/01/23
@aavetiss, Purdue University
This will serve as the location where users can edit their profile settings 
*/

"use client";

import { useState } from "react";
import Sidebar from "@components/profileSidebar";
import "@styles/global.css";

export default function EditProfile() {
  //store profile data
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    displayPhoneNumber: false,
    isAccountPublic: true,
    currentUsername: "",
    newUsername: "",
    state: "",
    country: "",
    zipCode: "",
    address: "",
    first: "",
    last: "",
  });

  const countires = ["", "Prefer not to answer", "United States of America"];
  const states = [
    "", "Prefer not to answer", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  

  const handlePhoneNumberChange = (e) => {
    //remove non numbers
    let phoneNumber = e.target.value.replace(/\D/g, "");
    //dashes every 3
    phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

    setProfileData((prev) => ({
      ...prev,
      phoneNumber,
    }));
  };

  const handleUsernameChange = (e) => {
    setProfileData({
      ...profileData,
      newUsername: e.target.value,
    });
  };

  const handleStateChange = (e) => {
    setProfileData({
      ...profileData,
      state: e.target.value,
    });
  };

  const handleCountryChange = (e) => {
    setProfileData({
      ...profileData,
      country: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    setProfileData({
      ...profileData,
      address: e.target.value,
    });
  };

  const handleZipCode = (e) => {
    //remove non numbers
    let zipCode = e.target.value.replace(/\D/g, "");
    
    setProfileData((prev) => ({
      ...prev,
      phoneNumber,
    }));
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
    if (profileData.newUsername.toLowerCase() == profileData.currentUsername.toLowerCase()) {
      alert("This is your current username");
      return;
    }
    //TODO: update user info in backend
  };

  const handlePasswordChange = () => {
    //TODO: send an email to change password
  };

  return (
    <div className="w-full flex pb-64">
      <div className="w-1/4">
        <Sidebar active="edit" />
      </div>
      <div className="w-3/4 text-left ">
        {/* ITEM: Account */}
        <div className="px-8 py-10 border rounded-2xl border-gray-300 mb-8">
          <form className="w-full">
            <h1 className="text-xl font-base pb-8">Account</h1>
            <div className="flex">
              {/* ITEM: Profile Pic */}
              <div className="w-1/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  class="w-20 h-20"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              {/* ITEM: Edit Info */}
              <div className="w-4/5">
                <div className="flex justify-between pb-6">
                  <div className="">
                    <p className="font-semibold text-sm">First Name</p>
                    <textarea className="w-72 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none" />
                  </div>
                  <div className="">
                    <p className="font-semibold text-sm">Last Name</p>
                    <textarea className="w-72 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">Username</p>
                  <input
                  type="text"
                  id="newUsername"
                  name="newUsername"
                  value={profileData.newUsername}
                  onChange={handleUsernameChange}
                  className="w-full rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ITEM: Personal Info */}
        <div className="px-8 py-10 border rounded-2xl border-gray-300">
          <form className="w-full">
            <h1 className="text-xl font-base pb-6">Personal Information</h1>

            {/* ITEM: Name  */}
            <div className="pb-8">
              <p className="font-semibold text-sm">Name</p>
              <p>First Last</p>
            </div>

            {/* ITEM: Phone Number  */}
            <div className="pb-6">
              <label htmlFor="phoneNumber" className="font-semibold text-sm">
                Phone Number
              </label>
              <br />
              <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={12}
              required
              className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
              />
            </div>

            {/* ITEM: Address */}
            <div className="pb-8">
              <div className="flex gap-8 pb-6">
                <div>
                  <p className="font-semibold text-sm">Country</p>
                  <select
                    value={profileData.country}
                    onChange={handleCountryChange}
                    className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  >
                    {countires.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="font-semibold text-sm">State</p>
                  <textarea className="w-48 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none" />
                </div>
              </div>
              <div className="flex flex-col pb-6">
                <p className="font-semibold text-sm">Address</p>
                <textarea className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none mb-1" />
                <textarea className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none" />
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="font-semibold text-sm">City</p>
                  <textarea className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Zipcode</p>
                  <textarea className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none" />
                </div>
              </div>
            </div>
            <div className="pb-6 flex justify-center">
              <button
              onClick={handleSaveProfile}
              className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-bold text-black-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="w-full text-left max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
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
  <span>{profileData.isAccountPublic ? "Public" : "Private"}</span>
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
<div className="flex flex-row justify-between mb-4">
  <button
    onClick={handleInstagram}
    className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700"
  >
    Connect with Instagram
  </button>
  <button
    onClick={handlePasswordChange}
    className="ml-2 py-1 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
  >
    Change Password
  </button>
</div>
<button
  onClick={handleSaveProfile}
  className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
>
  Save Profile
</button>
</div> */
}
