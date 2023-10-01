import React from "react";

const ProfilePage = () => {
  return (
    <div className="w-full flex">
      {/* ITEM: SideBar */}
      <div className="w-1/3 text-left border-r-1 border-black">
        <div className="flex flex-col gap-2">
          <p>My Info</p>
          <p>Edit Profile</p>
          <p>Settings</p>
        </div>
      </div>

      {/* ITEM: Main Info*/}
      <div className="w-2/3 text-left font-base text-3xl">
        <h1>Allen Chang</h1>
      </div>
    </div>
  );
};

export default ProfilePage;
