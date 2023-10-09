/* 
Author: Arteom Avetissian
Created: 10/09/23
@aavetiss, Purdue University
This will serve as the location where users can edit their privacy settings 
*/

"use client";

import { useState } from "react";
import Sidebar from "@components/profileSidebar";
import "@styles/global.css";

export default function EditPrivacy() {
    //store profile data
    const [profileData, setProfileData] = useState({
      displayPhoneNumber: false,
      isAccountPublic: true,
    });

    const handleDisplayPhoneNumberChange = (e) => {
        const displayPhoneNumber = e.target.checked;
    
        setProfileData((prev) => ({
          ...prev,
          displayPhoneNumber,
        }));
      };

   //account status: public/private
   const toggleAccountStatus = () => {
     setProfileData((prev) => ({
       ...prev,
       isAccountPublic: !prev.isAccountPublic,
     }));
   };
    
   return (
    <div className="w-full flex pb-64">
      <div className="w-1/4">
        <Sidebar active="privacy" />
      </div>
      </div>
   );
    
}
{
}

