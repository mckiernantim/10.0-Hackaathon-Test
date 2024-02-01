# Grub Finder

## Overview
Grub Finder is an interactive web application designed for a hackathon. It leverages the power of React and Express, integrating the Google Maps API to help users discover food venues in their vicinity. This project is an excellent example for those looking to deepen their understanding of API integration, browser geolocation, and advanced React patterns.

## Technologies Used
- **React**: For building the user interface.
- **Express**: Backend framework proxy server that accepts requests from the frontend, comunicates with GoogleMaps API and returns the response 
- **Google Maps API**: For displaying maps and location data.
- **Geolocation API**: To determine the user's current location.
- **@React-Google-Maps**: Component Library to integrate React project and Google Maps

## Key Features
- Interactive map with food venue locations.
- Search functionality for finding specific types of food venues.
- Real-time geolocation tracking.
- Optimized React components using advanced concepts like `useMemo` and `useRef`.

## Folder Structure Looks... Different

You may notice this project structured a bit differently from our previous projects.  As projects grow in complexity, as Capstone will, it is important we consider when to reuse code, and how to keep our files easily maintainable.

Consider the following:

- **Small Component Size**: Look at `FormControlGroup` – it's solely dedicated to rendering buttons and firing a function onClick. This compact focus makes components easier to maintain.

- **Abstraction**: `FormControlGroup` abstracts the button rendering process, reducing code repetition and enhancing maintainability.  This can be used anywhere a group of buttons have the same functionality on click.

- **DRY Principle**: Our `shared` directory is repsonsible for rendering components that could be utilized across multiple other components. 

- **Single Responsibility Principle**: The `Form` component, focusing exclusively on form rendering, exemplifies this principle, leading to easier maintenance and testing.  Currently our `Form` component is pretty specific in its design - tightly coupled to the needs of our GoogleMap comonent.  However, if our app grew we would want to consider how to abstract our `Form` so one component could be used across _all instances_ where a form is needed.

- **Hooks for Logic**: `useUserLocation` illustrates the effective use of hooks for managing state and logic, particularly for user location, which results in a cleaner and more focused component structure.  This hook could be invoked on any future component that requires a user's location.

- **Utility Functions for Common Logic**: Utility functions like `getGoogleMapsData` and `getUserLocation`, stored in utility files, centralize shared logic. Rather than declare this logic in the components they are being used, the `utils` directory holds any logic that could be useful among many components.

This structure, while it may appear different at first glance, forces us to consider how our project will grow.  Additionally, adhering to a defined structure will help ensure that all code is organized and all developers are comfortable with the codebase.


## @react-google-maps API

The `@react-google-maps/api` package simplifies the integration of Google Maps into our React application. We use specific components from this package to render our map and its features:

- **LoadScript**: This component is responsible for loading the Google Maps JavaScript API. It's a wrapper around the entire map rendering logic.
```jsx
 <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={["places"]}
        loading="async"
        onLoad={() => console.log("loaded!")}
        loadingElement={<div>Sit tight - setting maps up and stuff</div>}
      >
```
  - `googleMapsApiKey`: The API key for using Google Maps services.
  - `libraries`: Additional libraries (like "places") we need from Google Maps.
  - `loadingElement`: A JSX element displayed while the script is loading.
  - `onLoad`: A callback function that runs when the script is successfully loaded.



- **GoogleMap**: The core component that renders the map.
```jsx
     <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
        >
```

  - `mapContainerStyle`: Defines the styling for the map container.
  - `center`: Specifies the initial center of the map.
  - `zoom`: Sets the initial zoom level of the map.

- **Marker**: We use this component to place markers on the map at specific locations.

  - Each `Marker` corresponds to a place, with its position and title that is returned from our server.

### Whats with that export? 

```jsx
export const MemoGoogleMap = React.memo(MapComponent);
```

- **React.memo**: We wrap our MapComponent with `React.memo` for performance optimization. React.memo is a higher order component (a component that accepts another component) _that memorizes the output of a component and only re-renders it if the props have changed_. This is particularly useful in our case because:

     - The map component can be heavy in terms of rendering performance.
    - We want to avoid unnecessary re-renders when the parent components change but the map-related props remain the same.
    - It ensures that the map only updates when there are actual changes to its relevant props (like center or zoom), thus making our application more efficient.  Just like with our other components, we are considering how our app will grow when we approach our code writing.  

## Fetching Data and Express Proxy Server 
In our Grub Finder project, we employ a combination of React hooks and utility functions to fetch data, and an Express proxy server to handle requests to external APIs, such as the Google Maps API.

Why We Need an Express Proxy Server for CORS

**CORS Issues:** 

Directly making requests to external APIs (like Google Maps) from the client-side can lead to Cross-Origin Resource Sharing (CORS) issues. This is a security feature in browsers that restricts web applications from making requests to a different domain than the one that served the web application.

**Proxy Server Solution:** 

By setting up an Express server and making it act as a proxy, we can forward requests from our client-side application through this server. This way, the server makes API requests to Google Maps and returns the data to the client, effectively bypassing CORS restrictions.
Hooks and Utility Functions for Data Fetching

