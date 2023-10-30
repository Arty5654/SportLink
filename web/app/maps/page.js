"use client"

import React from "react";
import { useState, useEffect } from "react";
import GoogleMapComponent from "./GoogleMapComponent";

const MapsPage = () => {
  
  const [filter, setFilter] = useState('');
  const [radius, setRadius] = useState(10); // initialize radius to 10 miles
  const [center, setCenter] = useState({lat: 0, lng: 0/* GET USER LOCATION */});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        // Handle error or set a default location
      }
    );
  }, []);
  
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };
  
  
  return (
    
    <div className="flex flex-col items-center my-4 -mt-10">
      <div className="flex items-center mb-4">
        <span className="text-3xl font-bold text-blue-500">
          Sport
        </span>
        <span className="text-3xl font-bold text-green-500 ml-2">
          Maps
        </span>
      </div>
      
      <div className="border-2 border-grey-600 p-4 rounded-md flex items-center mb-4 shadow-lg">
        <div className="flex items-center mr-4">
          <label className="mr-2 font-bold">Sport:</label>
          <select value={filter} onChange={handleFilterChange} className="border rounded-md p-2">
            <option value="basketball">Basketball</option>
            <option value="tennis">Tennis</option>
            <option value="weightlifting">Weightlifting</option>
            <option value="soccer">Soccer</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="mr-2 mx-5 font-bold">Radius (km):</label>
          <input 
            type="number" 
            value={radius} 
            onChange={handleRadiusChange} 
            className="border rounded-md p-2"
          />
        </div>
      </div>

      <GoogleMapComponent 
        center={center}
        zoom={13} 
       />
    </div>
  );

};

export default MapsPage;
