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
import { useRouter } from "next/navigation";
import ProfileImage from "@public/assets/default-profile.webp";
import "@styles/global.css";

export default function EditProfile() {
  const [user, setUser] = useState({
    // ...other user details,
    profileImage: null, // Holds the base64 encoded image string
  });
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  const router = useRouter();

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

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  useEffect(() => {
    console.log(user);
  });

  const handleSaveProfile = () => {
    axios
      .post("http://localhost:5000/update_profile", user)
      .then((response) => {
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(user));

        console.log("Profile updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating profile", error);
      });
    //router.push("/profile");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxFileSize) {
        // Handle large file size error
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUser((prev) => ({
            ...prev,
            profileImage: e.target.result, // Set the base64 string in state
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumber = (e) => {
    // only digits
    const inputPhoneNumber = e.target.value.replace(/\D/g, "");

    // add dashses
    let formattedPhoneNumber = "";
    for (let i = 0; i < inputPhoneNumber.length; i++) {
      if (i === 3 || i === 6) {
        formattedPhoneNumber += "-";
      }
      formattedPhoneNumber += inputPhoneNumber[i];
    }

    setUser((prev) => ({
      ...prev,
      phoneNumber: formattedPhoneNumber,
    }));
  };

  const handleZipCode = (e) => {
    //remove non numbers
    let zipCode = e.target.value.replace(/\D/g, "");
    setUser((prev) => ({
      ...prev,
      zipCode,
    }));
  };

  const handleAge = (e) => {
    let age = e.target.value.replace(/\D/g, "");
    setUser((prev) => ({
      ...prev,
      age,
    }));
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
                  src={user.profileImage || ProfileImage}
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
                      onChange={handleInputChange}
                      value={user.firstName}
                      className="w-72 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                    />
                  </div>
                  <div className="">
                    <p className="font-semibold text-sm">Last Name</p>
                    <textarea
                      name="lastName"
                      className="w-72 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                      value={user.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">Username</p>
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    className="w-full rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                    onChange={handleInputChange}
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
                value={user.phoneNumber}
                maxLength={12}
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
                    value={user.country}
                    name="country"
                    onChange={handleInputChange}
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
                    value={user.state}
                    name="state"
                    onChange={handleInputChange}
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
                  value={user.address}
                  onChange={handleInputChange}
                  className="w-96 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none mb-1"
                />
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="font-semibold text-sm">City</p>
                  <input
                    type="text"
                    name="city"
                    value={user.city}
                    onChange={handleInputChange}
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
                    value={user.zipCode}
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
                    value={user.birthday}
                    onChange={handleInputChange}
                    className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                  />
                </div>
                <div className="pb-8">
                  <div className="flex gap-8 pb-6">
                    <div>
                      <p className="font-semibold text-sm">Age</p>
                      <input
                        type="text"
                        name="birthday"
                        value={user.age}
                        maxLength={2}
                        onChange={handleAge}
                        className="w-64 rounded-lg h-8 mt-2 pl-2 pt-1 text-sm text-gray-500 outline-0 border-2 border-blue-100 hover:border-blue-200 active:border-blue-200 resize-none"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Gender</p>
                      <select
                        value={user.gender}
                        name="gender"
                        onChange={handleInputChange}
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
