/* Author: Alex Younkers
   Creation: 10/29/23 
   Serves as the component of a google map to 
   view different sports
*/

"use client"

import { useState } from "react";
import React from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


// google map API key
const apiKey = "AIzaSyB3DAFbqW_2DHh4yBuvUeIbk5Xp_bQYnXc"

const containerStyle = {
    width: '70vw',
    height: '70vh'
  };
  
  function GoogleMapComponent({ center, zoom }) {
    return (
      <div className="shadow-2xl border-8 border-gray-500 rounded-xl overflow-hidden">
      <LoadScript
        googleMapsApiKey={apiKey}// Replace with your API key
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
        >
          {/* You can add markers, info windows etc. here */}
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      </div>
    );
  }
export default React.memo(GoogleMapComponent);