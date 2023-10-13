/* 
Author: Arteom Avetissian
Created: 10/01/23
@aavetiss, Purdue University
This will serve as the location where users can edit their profile settings 
*/

"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import User from "@app/User";
import Image from "next/image";
import ProfileImage from "@public/assets/default-profile.webp";
import "@styles/global.css";

export default function EditProfile() {
  const [user, setUser] = useState(new User());
  const [profileImage, setProfileImage] = useState(ProfileImage);
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  //store profile data
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    address: user.address,
    state: user.state,
    country: user.country,
    zipCode: user.zipCode,
    city: user.city,
    gender: user.gender,
    birthday: user.birthday,
  });

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);

    // Initialize profileData with user data from currentUser, if undefined set ""
    setProfileData({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      username: currentUser.username || "",
      phoneNumber: currentUser.phoneNumber || "",
      state: currentUser.state || "",
      country: currentUser.country || "",
      zipCode: currentUser.zipCode || "",
      address: currentUser.address || "",
      city: currentUser.city || "",
      gender: currentUser.gender || "",
      birthday: currentUser.birthday || "",
    });
  }, []);

  useEffect(() => {
    // This effect will trigger when either user or profileData changes
    console.log("Current user state:", profileData);
  }, [user, profileData]);

  const countries = ["", "Prefer not to answer", "United States of America"];
  const states = [
    "",
    "Prefer not to answer",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  const genders = ["", "Prefer not to answer", "Male", "Female"];

  const handleSaveProfile = () => {
    // Create a copy of the user object with updated profileData
    const updatedUser = {
      ...user,
      ...profileData,
    };

    setUser(updatedUser);
    console.log("Updated user state:", user);

    axios
      .post("http://localhost:5000/update_profile", user)
      .then((response) => {
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log("Profile updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating profile", error);
      });
  };

  const handleFirstName = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      firstName: value,
    }));
  };

  const handleLastName = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      lastName: value,
    }));
  };

  const handleUsername = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  const handlePhoneNumber = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      phoneNumber: e.target.value,
    }));
  };

  const handleAddress = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      address: e.target.value,
    }));
  };

  const handleCity = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleState = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      state: e.target.value,
    }));
  };

  const handleCountry = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      country: e.target.value,
    }));
  };

  const handleZipCode = (e) => {
    //remove non numbers
    let zipCode = e.target.value.replace(/\D/g, "");
    setProfileData((prev) => ({
      ...prev,
      zipCode,
    }));
  };

  const handleGender = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleBirthday = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      birthday: e.target.value,
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxFileSize) {
        alert(
          "Selected file exceeds the maximum allowed size (5MB). Please choose a smaller file."
        );
        event.target.value = null; // Clear the input field
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
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
              <div className="w-1/5 pr-16">
                <img
                  src={profileImage}
                  alt="Profile Image"
                  style={{ width: "100px", height: "100px" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="pr-8"
                />
              </div>
              {/* ITEM: Edit Info */}
              <div className="w-4/5">
                <div className="flex justify-between pb-6">
                  <div className="">
                    <p className="font-semibold text-sm">First Name</p>
                    <textarea
                      name="firstName"
                      onChange={handleFirstName}
                      value={profileData.firstName}
                      className="w-72 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                    />
                  </div>
                  <div className="">
                    <p className="font-semibold text-sm">Last Name</p>
                    <textarea
                      name="lastName"
                      className="w-72 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                      value={profileData.lastName}
                      onChange={handleLastName}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">Username</p>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    className="w-full rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                    onChange={handleUsername}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ITEM: Personal Info */}
        <div className="px-8 py-10 border rounded-2xl border-gray-300 mb-8">
          <form className="w-full">
            <h1 className="text-xl font-base pb-6">Personal Information</h1>

            {/* ITEM: Name  */}
            <div className="pb-8">
              <p className="font-semibold text-sm">Name</p>
              <p>
                {user.firstName} {user.lastName}
              </p>
            </div>

            {/* ITEM: Phone Number  */}
            <div className="pb-6">
              <label className="font-semibold text-sm">Phone Number</label>
              <br />
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handlePhoneNumber}
                required
                className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
              />
            </div>

            {/* ITEM: Full Address */}
            <div className="pb-8">
              <div className="flex gap-8 pb-6">
                <div>
                  <p className="font-semibold text-sm">Country</p>
                  <select
                    value={profileData.country}
                    name="country"
                    onChange={handleCountry}
                    className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="font-semibold text-sm">State</p>
                  <select
                    value={profileData.state}
                    name="state"
                    onChange={handleState}
                    className="w-48 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  >
                    {states.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col pb-6">
                <p className="font-semibold text-sm">Address</p>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleAddress}
                  className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none mb-1"
                />
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="font-semibold text-sm">City</p>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleCity}
                    className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="font-semibold text-sm">
                    Zip Code
                  </label>
                  <br />
                  <input
                    name="zipCode"
                    value={profileData.zipCode}
                    maxLength={5}
                    onChange={handleZipCode}
                    className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ITEM: Other Info */}
        <div className="px-8 py-10 border rounded-2xl border-gray-300">
          <form className="w-full">
            <h1 className="text-xl font-base pb-6">Other Information</h1>

            <div className="pb-8">
              <div className="flex gap-8 pb-6">
                <div>
                  <p className="font-semibold text-sm">Birthday</p>
                  <input
                    type="text"
                    name="birthday"
                    value={profileData.birthday}
                    onChange={handleBirthday}
                    className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">Gender</p>
                  <select
                    value={profileData.gender}
                    name="gender"
                    onChange={handleGender}
                    className="w-48 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  >
                    {genders.map((gender, index) => (
                      <option key={index} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Save Button */}
        <div className="pb-6 flex justify-center">
          <button
            onClick={handleSaveProfile}
            className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-bold text-white outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 bg-blue-500 resize-none"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

{
}
