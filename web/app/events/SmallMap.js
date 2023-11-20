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
  width: '52vw',
  height: '50vh'
};
const libs = ["places"];
  
export default function SmallMap({ center, zoom, address }) {
  
  /* CONST VARS */
  const [marker, setMarker] = useState({position: "", title: ""});
  const [queryError, setQueryError] = useState(false);
  const [placeDetails, setPlaceDetails] = useState(null);

  // refs
  const mapRef = useRef();
  const iw = useRef(null);


  /* INITIAL LOADING FUNCS */
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libs,
  });


  useEffect(() => {
    if (isLoaded && address && mapRef.current) {
      const service = new window.google.maps.places.PlacesService(mapRef.current);

      const request = {
        query: address,
        location: center,
        radius: '5000',
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const firstResult = results[0];
          setMarker({
            position: firstResult.geometry.location,
            title: firstResult.name,
          });
        } else {
          setQueryError(true);
        }
      });
    }
  }, [isLoaded, address, center]);


  if (loadError) {
    return <div>Error loading map! Please refresh.</div>;
  }
  if (!isLoaded) {
    return <div className="font-bold font-xl animate-ping">Loading Map...</div>;
  }

  const onMapLoad = (map) => {
    mapRef.current = map;
    iw.current = new window.google.maps.InfoWindow({
        content: ''
      });
  };

  if (queryError) {
    return <div>Error Loading Map!</div>
  }

  /* set info window ref to be selection of marker */
  const mSelect = (marker) => {

    const c = `<h1>${marker.title}</h1>`

    iw.current.setContent(c);
    iw.current.setPosition(marker.position);
    iw.current.open(mapRef.current);
  }


  return (

    <div className="rounded-xl">
      
        {/* DISPLAY GOOGLE MAP COMPONENT */}
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onMapLoad}
        >   
      
        {(marker.position && 

            <Marker
                position={marker.position}
                title={marker.title}
                onClick={() => mSelect(marker)}
            />
        )}

      </GoogleMap>

    </div>
  );
}
