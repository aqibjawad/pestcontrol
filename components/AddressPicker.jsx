import React from "react";
import Autocomplete from "react-google-autocomplete";

const AddressPicker = ({ onPlaceSelected }) => {
  const extractAreaFromAddress = (place) => {
    // Extract area using different methods
    let area = "";

    // Method 1: Try to get from address_components
    if (place.address_components) {
      const sublocality = place.address_components.find(
        (component) =>
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_1") ||
          component.types.includes("neighborhood")
      );

      if (sublocality) {
        area = sublocality.long_name;
      }
    }

    // Method 2: Try to extract from formatted address
    if (!area && place.formatted_address) {
      // Split the address by commas and look for the part containing "Area"
      const parts = place.formatted_address
        .split("-")
        .map((part) => part.trim());
      const areaPattern = /\b\w+(\s+\w+)*\s+Area\b/i;

      for (const part of parts) {
        const match = part.match(areaPattern);
        if (match) {
          area = match[0];
          break;
        }
      }
    }

    return area;
  };

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
            const area = extractAreaFromAddress(place);
            onPlaceSelected({
              ...place,
              formatted_address: place.formatted_address || place.name || "",
              area: area, // Add the extracted area to the place object
            });
          }
        }}
        options={{
          fields: [
            "formatted_address",
            "address_components",
            "geometry",
            "name",
            "place_id",
          ],
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
