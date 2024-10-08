"use client";

import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import FirstSection from "./add/firstSection";
import SecondSection from "./add/secondSection";
import styles from "../../styles/addresses.module.css";
import APICall from "@/networkUtil/APICall";

import GreenButton from "@/components/generic/GreenButton";

import Swal from "sweetalert2";

import { clients } from "@/networkUtil/Constants";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState(null);
  const [sections, setSections] = useState([1]);
  const [formData, setFormData] = useState({
    user_id: null,
    address: "",      
    city: "Dubai",         
    lat: "",     
    lang: "",    
    country: "Dubai",      
    state: "Dubai"         
  });

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
    setFormData(prev => ({ ...prev, user_id: urlId }));
  }, []);

  const handleAddSection = () => {
    setSections(prevSections => [...prevSections, prevSections.length + 1]);
  };

  const handleAddressChange = (newAddressData) => {
    setFormData(prev => ({
      ...prev,
      address: newAddressData.address || "",
      lat: newAddressData.lat || "",
      lang: newAddressData.lang || ""
    }));
  };

  const handleSubmit = async () => {
    // setLoading(true);
    try {
      const submissionData = {
        user_id: formData.user_id,
        address: formData.address,
        city: formData.city,
        lat: formData.lat,
        lang: formData.lang,
        country: formData.country,
        state: formData.state
      };

      console.log("Submitting data:", submissionData);

      const response = await api.postDataWithTokn(`${clients}/address/create`, submissionData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Data has been ${id ? "updated" : "added"} successfully!`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred.",
      });
      console.error("Error submitting data:", error);
    } finally {
      // setLoading(false);
      console.log("test");
    }
  };

  return (
    <>
      <Grid className="mt-10" container spacing={3}>
        <Grid lg={6} item xs={12} sm={6} md={4}>
          {sections.map((sectionId, index) => (
            <div key={sectionId} className="mt-5">
              <FirstSection
                userId={formData.user_id}
                onAddressChange={handleAddressChange}
              />
            </div>
          ))}
        </Grid>
        <Grid lg={6} item xs={12} sm={6} md={4}>
          <SecondSection onClick={handleAddSection} />
        </Grid>
      </Grid>

      <div className="mt-5">
        <GreenButton title={"Submit"} onClick={handleSubmit} />
      </div>
    </>
  );
};

export default Page;
