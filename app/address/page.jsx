"use client";

import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import FirstSection from "./add/firstSection";
import SecondSection from "./add/secondSection";
import styles from "../../styles/addresses.module.css";
import APICall from "@/networkUtil/APICall";

const getIdFromUrl = (url) => {
  const parts = url.split('?');
  if (parts.length > 1) {
    const queryParams = parts[1].split('&');
    for (const param of queryParams) {
      const [key, value] = param.split('=');
      if (key === 'id') {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sections, setSections] = useState([1]);
  const [addressData, setAddressData] = useState({
    address: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    setName("");
    setPhoneNumber("");

    if (urlId) {
      fetchAddressData(urlId);
    }
  }, []);

  const fetchAddressData = async (addressId) => {
    try {
      const response = await api.getDataWithToken(`/api/address/${addressId}`);
      setAddressData({
        address: response.address,
        latitude: response.latitude,
        longitude: response.longitude
      });
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  const handleAddSection = () => {
    setSections((prevSections) => [...prevSections, prevSections.length + 1]);
  };

  const handleAddressChange = (newAddressData) => {
    setAddressData(newAddressData);
  };

  return (
    <>
      <div className={styles.leftSection}>{name}</div>
      <div className={styles.leftSection1}>{phoneNumber}</div>

      <Grid className="mt-10" container spacing={3}>
        <Grid lg={6} item xs={12} sm={6} md={4}>
          {sections.map((sectionId) => (
            <div key={sectionId} className="mt-5">
              <FirstSection
                addressData={addressData}
                onAddressChange={handleAddressChange}
              />
            </div>
          ))}
        </Grid>
        <Grid lg={6} item xs={12} sm={6} md={4}>
          <SecondSection onClick={handleAddSection} />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;