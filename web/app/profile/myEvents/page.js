import React from "react";
import Sidebar from "@components/profileSidebar";

const page = () => {
  return (
    <div className="flex">
      {/* ITEM: SideBar */}
      <div className="w-1/4">
        <Sidebar active="myEvents" />
      </div>
      <div className="w-3/4">
        <p>My Events</p>
      </div>
    </div>
  );
};

export default page;
