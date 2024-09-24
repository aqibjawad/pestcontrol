"use client";

import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import FirstSection from "./add/firstSection";
import SecondSection from "./add/secondSection";
import { useSearchParams } from "next/navigation";
import styles from "../../styles/addresses.module.css";
import APICall from "@/networkUtil/APICall";

const Page = () => {
  const searchParams = useSearchParams();
  const api = new APICall();

  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const phoneNumber = searchParams.get("phone_number");

  const [sections, setSections] = useState([1]);

  useEffect(() => {
    // Fetch address data when component mounts
    fetchAddressData();
  }, []);

  const fetchAddressData = async () => {
    try {
      const response = await api.getDataWithToken(`/api/address/${id}`);
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