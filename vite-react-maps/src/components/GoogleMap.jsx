import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import "./googleMap.css"
import { useUserLocation }from "../hooks/useUserLocation"
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

const buttonOptions = ["Desert", "Ice Cream", "Tacos", "Pizza", "Beer"]

const MapComponent = () => {
  // state for the map center location
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]);
//  THIS IS A REACT REF THAT INITIALIZES OUR INSTANCE OF GOOGLE'S AUTO COMPLETE SEARCH
  const googleInputOptions = {
    componentRestrictions: { country: "US" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"],
  };
  const inputRef = useRef();
  const autoCompleteRef = useRef();  
  const { error, location } = useUserLocation();
  // specified autocomplete options for google autocomplete maps service
  const getUserPositionBeforeSubmit = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (err) => {
            reject(err.message);
          }
        );
      }
    });
  }
  const getGoogleMapsData = async (requestBody) => {
    try {
      const res = await axios.post(`${_BASE_URL}`, requestBody);
      return res;
    } catch (err) {
      console.error(err)
    }
  }

  const updateMapPositions = (places) => {
    setSelectedPlace(places[0] || { name: "Search For Some Food", position: places[0] })
    setPlaces(places);
    setMapCenter(center);
  }
   
  useEffect(() => {
    if(error) {
      console.error(error)
    } if(location) {
      const userLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      updateMapPositions([userLocation])
    }
  }, []);

  useEffect(() => {
    if (window.google) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        googleInputOptions
      );

      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current.getPlace();
        
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

  const handleSubmit =  async (event) => {
    console.log(event, " <---- event")
    event.preventDefault();
    try {
      
         const { latitude, longitude } = await getUserPositionBeforeSubmit();
         const requestBody = {
            query: event.target.value || inputRef.current.value,
            location: `${latitude},${longitude}`,
            distance: searchDistance,
          };
          let res = await getGoogleMapsData(requestBody)
          console.log(res.data.results)
          updateMapPositions(res.data.results)
        } catch (err) {
          console.error(err);
        }
      };  

  return (
    <div className="googleMaps-container">
       <h1>{ selectedPlace ? selectedPlace.name : null }</h1>
       <section>
        {buttonOptions.map((option, ind) => <button key={ ind } value = { option } onClick={ (e) => handleSubmit(e) }> { option } </button>)}
        <form onSubmit={ handleSubmit }>
          <br />
          <label>Or find Some Food By Name</label>
          <input ref={ inputRef } />
          <button type="submit">Search</button>
        </form>
       </section>
      { places.length ? <h2>Nearby Grub:</h2> : null}
      <ul className="googleMaps-ul">
        { places.map((place) => (<li className="googleMaps-ul-li" key={ place.index }> { place.name }</li> ) )}
      </ul>



    {/*  LOADSCRIPT IS THE WRAPPER COMPONENT FOR OUR GOOGLE MAPS FUNCTIONALITY */}
      <LoadScript
        googleMapsApiKey={_API_KEY}
        libraries={["places"]}
        loading={"async"}
        onLoad={() => console.log("loaded!")}
      >
        {/* GOOGLE MAP HANDLES THE STATE OF OUR DISPLAYED MAP  */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={15}
        >
          {/* MARKER IS THE FINAL COMPONENT FROM OUR LIBRARY THAT DISPLAYS A MARKER  */}
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
