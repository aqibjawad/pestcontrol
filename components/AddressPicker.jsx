import React from "react";
import Autocomplete from "react-google-autocomplete";

import styles from "../styles/addresses.module.css";

const AddressPicker = ({ onPlaceSelected }) => {
  return (
    <div className={styles}>
      <Autocomplete
        style={{border:"1px solid #b7b7b7", height:"50px", borderRadius:"10px", width:"100%", paddingLeft:"10px", paddingRight:"10px"}}
        apiKey="AIzaSyBBHNqsXFQqg_-f6BkI5UH7X7nXK2KQzk8"
        onPlaceSelected={(place) => {
          if (onPlaceSelected) {
            onPlaceSelected(place);
          }
        }}
        options={{
          types: ["address"],
          componentRestrictions: { country: "ae" },
        }}
        defaultValue=""
        placeholder="Enter an address"
      />
    </div>
  );
};

export default AddressPicker;
