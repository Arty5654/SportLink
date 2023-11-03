/* Author: Alex Younkers
   Creation: 10/29/23 
   Serves as the component of a google map to 
   view different sports
*/

"use client"

import { useState, useEffect, useRef } from "react";
import React from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete, useLoadScript, InfoWindow } from '@react-google-maps/api';


// HELPERS
const apiKey = "AIzaSyB3DAFbqW_2DHh4yBuvUeIbk5Xp_bQYnXc"
const containerStyle = {
  width: '70vw',
  height: '70vh'
};
const libs = ["places"];
  
function GoogleMapComponent({ center, zoom, handleNewCenter, sport, radius}) {
  
  /* CONST VARS */
  const [autocomplete, setAutocomplete] = useState(null);
  const onAcLoad = (autoC) => setAutocomplete(autoC);
  const [ac, setAc] = useState('');
  const [markers, setMarkers] = useState([]);
  const [queryError, setQueryError] = useState(false);

  // refs
  const mapRef = useRef();
  const iw = useRef(null);

  /* WHEN A FILTER CHANGES, UPDATE MARKERS */
  useEffect(() => {
    if (mapRef.current && sport !== "Select" && radius !== "Select") {
      fetchPlaces(mapRef.current, sport, (radius * 1000));
    } else if (sport === "Select" || radius === "Select") {
      setMarkers([]);
    }

    // close window if filter changes (mess handling)
    if (iw.current != null) {
      iw.current.close();
    }

  }, [sport, radius, mapRef]);


  /* INITIAL LOADING FUNCS */
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libs,
  });

  // load in infoWindow reference
  useEffect(() => {
    if (isLoaded) {
      iw.current = new window.google.maps.InfoWindow({
        content: ''
      });
    }
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading map! Please refresh.</div>;
  }
  if (!isLoaded) {
    return <div className="font-bold font-xl animate-ping">Loading Map...</div>;
  }
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  if (queryError) {
    return <div>Error searching for results! Please refresh</div>
  }


  /* HANDLE CENTERPOINT AUTOCOMPLETE FORM SUBMISSION */
  const changeCenter = (e) => {
    e.preventDefault();

    if (autocomplete) {
      const loc = autocomplete.getPlace();
      if (loc && loc.geometry.location) {
        handleNewCenter({
          lat: loc.geometry.location.lat(),
          lng: loc.geometry.location.lng()
        }, false);
      }
    }
    setAc('');
  };

  /* GRAB AND UPDATE MARKERS DYNAMICALLY */
  const fetchPlaces = (map, sport, radius) => {
    // request from google Places API
    const service = new window.google.maps.places.PlacesService(map);

    // location is given by getting the center of useRef map
    // radius filtered by user, sport selected by user and queried
    const request = {
      location: map.getCenter(),
      radius: radius,
      keyword: sport,
    };

    // search nearby (max distance 50km) using the given params
    // set marker array to refresh based on sport
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const sportMarkers = results
        .map(result => ({
          position: result.geometry.location,
          title: result.name,
          address: result.vicinity || '',
        }));
        setMarkers(sportMarkers);
      } else {
        // something went wrong, make user refresh
        setQueryError(true);
      }
    });
  };

  /* set info window ref to be selection of marker */
  const mSelect = (marker) => {

    const c = `<h1>${marker.title}</h1><h3>${marker.address}</h3>`

    iw.current.setContent(c);
    iw.current.setPosition(marker.position);
    iw.current.open(mapRef.current);
  }


  return (
    <div >

      <div className="shadow-2xl border-8 border-gray-500 rounded-xl overflow-hidden">
      
        {/* DISPLAY GOOGLE MAP COMPONENT */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
        >   
      
      {/* DYNAMIC MAP MARKERS */}
      {markers.map((marker, index) => (
        <Marker 
          key={index} 
          position={marker.position} 
          title={marker.title}
          onClick={() => mSelect(marker)}  
        /> 
      ))}

      </GoogleMap>
      </div>

      {/* ALLOW USER TO CHANGE THE CENTERPOINT */}
      <form onSubmit={changeCenter} className="border-2 border-gray-200 shadow-lg mt-10 p-2 bg-white rounded-lg flex flex-col items-center justify-center">
        <label className="font-semibold mb-2">Set New Center Point:</label>
        <Autocomplete onLoad={onAcLoad}>
            <input
              type="text"
              placeholder="ex. West Lafayette, IN"
              className="p-2 border-2 border-gray-7400 rounded-md flex-grow"
              value={ac}
              onChange={(e) => setAc(e.target.value)}
            />
        </Autocomplete>
        <button className="flex items-center mt-5 p-2 text-white bg-blue-500 hover:bg-green-500 rounded-md" type="submit">Enter</button>
      </form>

    </div>
  );
}
export default React.memo(GoogleMapComponent);