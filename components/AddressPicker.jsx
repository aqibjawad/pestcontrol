import React from "react";
import Autocomplete from "react-google-autocomplete";

const AddressPicker = ({ onPlaceSelected }) => {
  return (
    <div>
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
          if (onPlaceSelected && place) {
            // Include the formatted_address in the place object
            onPlaceSelected({
              ...place,
              formatted_address: place.formatted_address || place.name || "",
            });
          }
        }}
        options={{
          fields: ["formatted_address", "address_components", "geometry", "name", "place_id"],
          types: [],
          componentRestrictions: { country: "ae" },
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