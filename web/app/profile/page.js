"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Sidebar from "@components/profileSidebar";
import User from "@app/User";

const ProfilePage = () => {
  const [user, setUser] = useState(new User());

  //store profile data
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    email: user.email,
    state: user.state,
    country: user.country,
    zipCode: user.zipcode,
    address: user.address,
    city: user.city,
    birthday: user.birthday,
    gender: user.gender,
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
      gender: currentUser.gedner || "",
      birthday: currentUser.gender || "",
    });
  }, []);

  useEffect(() => {
    // This effect will trigger when either user or profileData changes
    console.log("Current user state:", profileData.email);
  }, [user, profileData]);

  return (
    <div className="w-full flex">
      {/* ITEM: SideBar */}
      <div className="w-1/4">
        <Sidebar active="info" />
      </div>

      {/* ITEM: Main Info*/}
      <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
        {/* ITEM: General Info*/}
        <div className="pb-8">
          <h1 className="font-base text-3xl">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 pb-8">{user && user.username}</p>
          <div className="flex text-gray-200">
            <p className="text-black">User Rating: </p>
            {[...Array(5)].map((star, i) => {
              return (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="0"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              );
            })}
          </div>
        </div>
        <div className="flex gap-8 pb-8 border-b border-gray-200">
          <Link
            href="/profile/friends"
            className="border border-black bg-black text-white px-8 py-2 rounded-xl"
          >
            Friends
          </Link>
          <p className="border border-black bg-black text-white px-8 py-2 rounded-xl">
            Messages
          </p>
        </div>

        {/* ITEM: Contact Info */}
        <div className="text-base pb-4">
          <p className="pt-8 pb-4 text-xs text-gray-500">Contact Information</p>
          <div className="flex flex-col gap-4">
            <p className="items-end">
              Phone: <span className="text-blue-500 text-sm"> {user.phoneNumber}</span>
            </p>
            <p className="items-end">
              Email:
              <span className="text-blue-500 text-sm"> {user.email}</span>
            </p>
            <p className="items-end">
              Address:
              <span className="text-sm text-blue-500">{`${user.address}, ${user.city}, ${user.state} ${user.zipCode}`}</span>
            </p>
          </div>
        </div>
        {/* ITEM: Basic Info */}
        <div>
          <p className="pt-8 pb-4 text-xs text-gray-500">Basic Information</p>
          <div className="flex flex-col gap-4">
            <p className="items-end">
              Birthday: <span className="text-sm text-blue-500">{user.birthday}</span>
            </p>
            <p className="items-end">
              Gender: <span className="text-sm text-blue-500">{user.gender}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
