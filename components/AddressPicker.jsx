import React from "react";
import Autocomplete from "react-google-autocomplete";

import styles from "../styles/addresses.module.css";

const AddressPicker = () => {
  return (
    <div className={styles}>
      <Autocomplete
        className={styles.inputField}
        apiKey="AIzaSyBBHNqsXFQqg_-f6BkI5UH7X7nXK2KQzk8"
        onPlaceSelected={(place) => {
          console.log(place);
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
