import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
const _API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const _BASE_URL = 'http://localhost:3000'
const searchDistance = 1500; 

const containerStyle = {
  width: "600px",
  height: "600px",
  border: "2px solid green",
};

const center = {
  lat: 40.7,
  lng: 74.644,
};

const MapComponent = () => {
  // state for the map center location
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedPlace, setSelectedPlace] = useState("Pursuit HQ");
  const [places, setPlaces] = useState([]);

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  // specified autocomplete options for google autocomplete maps service
  const options = {
    componentRestrictions: { country: "US" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"],
  };

  useEffect(() => {
    if (window.google) {
      // First, create the Autocomplete instance and assign it to autoCompleteRef.current
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // Then, add the listener to the Autocomplete instance
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current.getPlace();
        console.log(place);

        if (place.geometry) {
          setMapCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });

          setSelectedPlace({
            name: place.name,
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          // Optionally set a marker at the user's location
          setSelectedPlace({
            name: "Search for some food",
            position: userLocation,
          });
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearchButtonClick =  () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLong = position.coords.longitude;
  
          const requestBody = {
            query: inputRef.current.value,
            location: `${userLat},${userLong}`,
            distance: searchDistance,
            key: _API_KEY
          };
     
          let res = await axios.post(`${_BASE_URL}`, requestBody)
          setPlaces(res.data.results);
          setMapCenter(res.data.results[0].location);
          // Here, you can set the places state with the response data if necessary
        })
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>{selectedPlace ? selectedPlace.name : null}</h1>
      <label>Food Finder</label>
      { places.map((place) => (<h5 key={place.index}> { place.name }</h5> ) )}
      <input ref={inputRef} />
      <button onClick={handleSearchButtonClick}>Search</button>

      <LoadScript
        googleMapsApiKey={_API_KEY}
        libraries={["places"]}
        loading={"async"}
        onLoad={() => console.log("loaded!")}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={15}
        >
          {places.map((place, index) => (
            <Marker
              key={index}
              position={place.geometry.location}
              title={place.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default React.memo(MapComponent);
