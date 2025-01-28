import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import AddressPicker from "../../../components/AddressPicker";

const FirstSection = ({ userId, onAddressChange }) => {
  const [address, setAddress] = useState("");
  const [lang, setLongitude] = useState("");
  const [lat, setLatitude] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    // Update parent component whenever these values change
    onAddressChange({
      address: address,
      lat: lat,
      lang: lang,
      area: area,
    });
  }, [address, lang, lat, area, onAddressChange]);

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

      // Extract and set area information
      let areaInfo = "";
      if (place.address_components) {
        // Look for sublocality or neighborhood first
        const sublocalityComponent = place.address_components.find(
          (component) =>
            component.types.includes("sublocality") ||
            component.types.includes("neighborhood")
        );

        // If not found, look for locality
        const localityComponent = place.address_components.find((component) =>
          component.types.includes("locality")
        );

        areaInfo =
          sublocalityComponent?.long_name || localityComponent?.long_name || "";
      }
      setArea(areaInfo);

      // Log for debugging
      console.log("Selected Place:", {
        address: formattedAddress,
        lat: place.geometry?.location.lat(),
        lng: place.geometry?.location.lng(),
        area: areaInfo,
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
        />
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Longitude"
          value={lang}
          onChange={(value) => setLongitude(value)}
        />
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Latitude"
          value={lat}
          onChange={(value) => setLatitude(value)}
        />
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={3}>
        <InputWithTitle
          title="Area"
          value={area}
          onChange={(value) => setArea(value)}
        />
      </Grid>
    </Grid>
  );
};

export default FirstSection;
