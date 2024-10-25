import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import AddressPicker from "../../../components/AddressPicker";

const FirstSection = ({ userId, onAddressChange }) => {
  const [address, setAddress] = useState("");
  const [lang, setLongitude] = useState("");
  const [lat, setLatitude] = useState("");

  useEffect(() => {
    // Update parent component whenever these values change
    onAddressChange({
      address: address,
      lat: lat,
      lang: lang,
    });
  }, [address, lang, lat, onAddressChange]);

  const handlePlaceSelected = (place) => {
    if (place) {
      // Set the formatted address
      const formattedAddress = place.formatted_address || place.name || "";
      setAddress(formattedAddress);

      // Set coordinates if they exist
      if (place.geometry?.location) {
        setLongitude(place.geometry.location.lng().toString());
        setLatitude(place.geometry.location.lat().toString());
      }

      // Log for debugging
      console.log("Selected Place:", {
        address: formattedAddress,
        lat: place.geometry?.location.lat(),
        lng: place.geometry?.location.lng(),
      });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid lg={12} item xs={12} sm={6} md={4}>
        <AddressPicker onPlaceSelected={handlePlaceSelected} />
      </Grid>

      <Grid item lg={12} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Address"
          value={address}
          onChange={(value) => setAddress(value)}
          disabled
        />
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Longitude"
          value={lang}
          onChange={(value) => setLongitude(value)}
          disabled
        />
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Latitude"
          value={lat}
          onChange={(value) => setLatitude(value)}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default FirstSection;
