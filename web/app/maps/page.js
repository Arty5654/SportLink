"use client"

import React from "react";
import { useState, useEffect } from "react";
import GoogleMapComponent from "./GoogleMapComponent";

const MapsPage = () => {
  
  const [filter, setFilter] = useState('Select');
  const [radius, setRadius] = useState("Select"); // initialize radius to 10 miles
  const [center, setCenter] = useState({lat: 40.4261983,lng: -86.9108354/*west laf default */});
  const [recenter, setRecenter] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        
      },
      (error) => {
        console.log(error)
        // if they decline, set default location to west lafayette
        setCenter({
          lat: 40.4261983,
          lng: -86.9108354
        })
      }
    );
    setRecenter(false); // reset recenter var
  }, [, recenter]);
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  const handleCenterChange = (e) => {
    setCenter(e);
    setFilter("Select");
    setRadius("Select");
  };

  const handleRecenter = () => {
    setRecenter(true);
    setFilter("Select");
    setRadius("Select");
  }
  
  
  return (
    
    <div className="flex flex-col items-center my-4 -mt-20">
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
          <select value={filter} onChange={handleFilterChange} className="border rounded-lg p-2">
            <option value="Select">Select...</option>
            <option value="Basketball Court">Basketball</option>
            <option value="Tennis Court">Tennis</option>
            <option value="Weightlifting">Weightlifting</option>
            <option value="Soccer Field">Soccer</option>
            <option value="Running Track">Running</option>
            <option value="Golf Course">Golf</option>
          </select>
        </div>
        
        <div className="flex items-center mr-4">
          <label className="mr-2 font-bold">Radius(Km):</label>
          <select value={radius} onChange={handleRadiusChange} className="border rounded-lg p-2">
            <option value="Select">Select...</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <GoogleMapComponent 
        center={center}
        zoom={13} 
        handleNewCenter={handleCenterChange}
        sport={filter}
        radius={radius /*in meters; convert to KM*/}
       />

      <div className="flex justify-center items-center">
        <button 
        onClick={handleRecenter}
        className="mt-5 px-10 py-2 text-white bg-orange-500 hover:bg-purple-500 rounded-md hover:animate-pulse transition ease-in-out"
        >
          Re-center at my location!
        </button>
      </div>

    </div>
  );

};

export default MapsPage;
