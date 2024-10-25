import React from "react";
import Autocomplete from "react-google-autocomplete";

import styles from "../styles/addresses.module.css";

const AddressPicker = ({ onPlaceSelected }) => {
  return (
    <div className={styles}>
      <Autocomplete
        style={{
          border: "1px solid #b7b7b7",
          height: "50px",
          borderRadius: "10px",
          width: "100%",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
        apiKey="AIzaSyBBHNqsXFQqg_-f6BkI5UH7X7nXK2KQzk8"
        onPlaceSelected={(place) => {
          if (onPlaceSelected) {
            onPlaceSelected(place);
          }
        }}
        options={{
          componentRestrictions: { country: "ae" },
          fields: ["address_components", "geometry", "name", "place_id"],
          types: [],
          bounds: {
            east: 55.6518,
            west: 54.8833,
            north: 25.4052,
            south: 24.7136,
          },
          strictBounds: false,
        }}
        defaultValue=""
        placeholder="Enter an address"
      />
    </div>
  );
};

export default AddressPicker;