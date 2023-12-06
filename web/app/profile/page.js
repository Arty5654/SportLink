"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@components/profileSidebar";
import User from "@app/User";
import DeleteAccount from "./DeleteAccount";
import BadgeDisplay from "./BadgeDisplay";


const ProfilePage = () => {
  const [user, setUser] = useState(new User());
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    if (!currentUser) {
      console.log("user not logged in...");
      router.push("/signin");
      return;
    }

    setUser(currentUser);
  }, [, user.numBasketball, user.numSoccer, user.numTennis, user.numWeights]);

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
            
            
          </div>
        </div>
        <div className="flex gap-8 pb-8 border-b border-gray-200">
          <Link
            href="/profile/friends"
            className="border border-black bg-black text-white px-8 py-2 rounded-xl"
          >
            Friends
          </Link>
          <Link
              href="/profile/messages"
              className="border border-black bg-black text-white px-8 py-2 rounded-xl"
          >
            Messages
          </Link>
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
              Location:
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
            <p className="items-end">
              Age: <span className="text-sm text-blue-500">{user.age}</span>
            </p>
          </div>
        </div>
        {/* ITEM: Badges */}
        <div>
          
          <BadgeDisplay 
            numTennis={user.numTennis} 
            numBasketball={user.numBasketball} 
            numSoccer={user.numSoccer} 
            numWeights={user.numWeights} 
          />

        </div>
        {/* ITEM: Account deletion */}
        <div>
          <DeleteAccount email={user.email} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
