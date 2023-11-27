/* Author: Alex Younkers
   Creation: 10/29/23 
   Serves as the component of a google map to 
   view different sports
*/

"use client"

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import React from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { faMapPin, faLocationPin } from "@fortawesome/free-solid-svg-icons";

// HELPERS
const apiKey = "AIzaSyB3DAFbqW_2DHh4yBuvUeIbk5Xp_bQYnXc"
const containerStyle = {
  width: '70vw',
  height: '70vh'
};
const libs = ["places", "geometry"];
  
function GoogleMapComponent({ center, zoom, handleNewCenter, sport, radius, type }) {
  
  /* CONST VARS */
  const [autocomplete, setAutocomplete] = useState(null);
  const onAcLoad = (autoC) => setAutocomplete(autoC);
  const [ac, setAc] = useState('');
  const [markers, setMarkers] = useState([]);
  const [eventMarkers, setEventMarkers] = useState([]);
  const [queryError, setQueryError] = useState(false);

  const [events, setEvents] = useState([]);

  // refs
  const mapRef = useRef();
  const iw = useRef(null);

  /* WHEN A FILTER CHANGES, UPDATE MARKERS */
  useEffect(() => {
    if (mapRef.current && sport !== "Select" && radius >= 5) {

      fetchPlaces(mapRef.current, sport, (radius * 1000));
        
    } else if (sport === "all") {

      fetchPlaces(mapRef.current, sport, 0);

    } else if ((sport === "Select" || radius === "Select") && type === 0) {
      setMarkers([]);
      setEventMarkers([]);
    }

    // close window if filter changes (mess handling)
    if (iw.current != null) {
      iw.current.close();
    }

  }, [sport, radius, type, mapRef.current]);

  useEffect(() => {
    axios.get("http://localhost:5000/get_events").then((response) => {
      console.log("Feed - Response Data: ", response.data);
      setEvents(response.data);
    });
  }, []);


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

    // LOCATION MARKERS
    if (type === 2 || type === 3) {

      // request from google Places API
      const service = new window.google.maps.places.PlacesService(map);

      // location is given by getting the center of useRef map
      // radius filtered by user, sport selected by user and queried
      const request = {
        location: new google.maps.LatLng(center.lat, center.lng),
        radius: radius,
        keyword: sport,
      };
  
      // search nearby (max distance 50km) using the given params
      // set marker array to refresh based on sport
      service.nearbySearch(request, (results, status) => {

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const sportMarkers = results.map(result => ({

            position: result.geometry.location,
            title: `Location: ${result.name}`,
            address: result.vicinity || '',

            icon: {
              path: faLocationPin.icon[4],
              fillColor: "#bb0000",
              fillOpacity: 1,
              anchor: new google.maps.Point(
                faMapPin.icon[0] / 2, // width
                faMapPin.icon[1], // height
              ),
              strokeWeight: 1,
              strokeColor: "#000000",
              scale: 0.075,
            },

          }));

          setMarkers(sportMarkers);
        } else {
          // something went wrong, make user refresh
          setMarkers([]);
        }
      });
    } else if (type == 1 || type == 0) {
      setMarkers([]);
    }

    // EVENT MARKERS
    if (type === 1 || type === 3) {

      const eventMarkers = events.filter(event => {

        // get distance from center to event
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(center.lat, center.lng),
          new window.google.maps.LatLng(event.lat, event.lng)
        );

          
        // only return events which match the criteria for sport and distance
        if (sport === "Basketball Court") {
          if (radius === 0) {
            return event.sport === "Basketball"
          }
          return event.sport === "Basketball" && distance <= radius;

        } else if (sport === "Tennis Court") {
          if (radius === 0) {
            return event.sport === "Tennis"
          }
          return event.sport === "Tennis" && distance <= radius;

        } else if (sport === "Soccer Field") {
          if (radius === 0) {
            return event.sport === "Soccer"
          }
          return event.sport === "Soccer" && distance <= radius;

        } else if (sport === "Weightlifting") {
          if (radius === 0) {
            return event.sport === "Weightlifting"
          }
          return event.sport === "Weightlifting" && distance <= radius;

        }  else {
          // sport is select
          if (sport === "all") {
            // if no parameters set, just return all events
            return true;
          }
        }

      }).map(event => ({

        position: { lat: event.lat, lng: event.lng },
        title: `Event Title: ${event.title}`,
        address: `Address: ${event.address}`,
        
        icon: {
          path: faMapPin.icon[4],
          fillColor: "#000000",
          fillOpacity: 1,
          anchor: new google.maps.Point(
            faMapPin.icon[0] / 2, // width
            faMapPin.icon[1], // height
          ),
          strokeWeight: 1,
          strokeColor: "#000000",
          scale: 0.075,
        },

      }));

      setEventMarkers(eventMarkers);

    } else if (type == 2 || type == 0) {
      setEventMarkers([]);
    }

  };

  /* set info window ref to be selection of marker */
  const mSelect = (marker) => {

    const c = `<strong>${marker.title}</strong><h3>${marker.address}</h3>`;

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
          icon={marker.icon}
          onClick={() => mSelect(marker)}  
        /> 
      ))}

      {eventMarkers && eventMarkers.map((marker, index) => (
        <Marker 
          key={index} 
          position={marker.position} 
          title={marker.title}
          icon={marker.icon}
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