import React, { useState } from "react";
import { Grid } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import AddressPicker from "../../../components/AddressPicker";

const FirstSection = ({ userId, addressData, onAddressChange }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const handlePlaceSelected = (place) => {
    console.log("Selected place:", JSON.stringify(place));
    if (place) {
      setAddress(place.formatted_address || "");
      setCity(
        place.address_components.find((c) => c.types.includes("locality"))
          ?.long_name || ""
      );
      setLongitude(place.geometry?.location.lng().toString() || "");
      setLatitude(place.geometry?.location.lat().toString() || "");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onAddressChange({ ...addressData, [name]: value });
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
          value={longitude}
          onChange={(value) => setLongitude(value)}
          disabled
        />
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Latitude"
          value={latitude}
          onChange={(value) => setLatitude(value)}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default FirstSection;
