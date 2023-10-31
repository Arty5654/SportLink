/* Author: Alex Younkers
   Creation: 10/29/23 
   Serves as the component of a google map to 
   view different sports
*/

"use client"

import { useState } from "react";
import React from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';


// google map API key
const apiKey = "AIzaSyB3DAFbqW_2DHh4yBuvUeIbk5Xp_bQYnXc"

const containerStyle = {
  width: '70vw',
  height: '70vh'
};

const libs = ["places"];
  
function GoogleMapComponent({ center, zoom, handleNewCenter }) {

  const [autocomplete, setAutocomplete] = useState(null);
  const onLoad = (autoC) => setAutocomplete(autoC);



  const changeCenter = (e) => {
    e.preventDefault();

    if (autocomplete) {
      const loc = autocomplete.getPlace();
      if (loc && loc.geometry.location) {
        console.log("hi)");
        handleNewCenter({
          lat: loc.geometry.location.lat(),
          lng: loc.geometry.location.lng()
        });
      }
    }
  };


  return (
    <div >

    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libs}
    >
      <div className="shadow-2xl border-8 border-gray-500 rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
      >

      </GoogleMap>
      </div>

      <form onSubmit={changeCenter} className="shadow-lg mt-10 p-4 bg-white rounded-lg flex flex-col items-center justify-center">
        <label className="font-semibold mb-2">Set New Center Point:</label>
        <Autocomplete onLoad={onLoad}>
            <input
              type="text"
              placeholder="ex. West Lafayette, IN"
              className="p-2 border-2 border-gray-400 rounded-md flex-grow"
            />
        </Autocomplete>
        <button className="flex items-center mt-5 p-2 text-white bg-blue-500 hover:bg-green-500 rounded-md" type="submit">Enter</button>
      </form>

    </LoadScript>

    </div>
  );
}
export default React.memo(GoogleMapComponent);