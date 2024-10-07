"use client";

import React, { useState, useEffect } from "react";

import ClientDetails from "./clientDetails";
import TypeVisit from "./visit";
import Area from "./area";
import UseChemicals from "./useeChemical";
import Extra from "./extra";
import Remarks from "./remarks";

import APICall from "@/networkUtil/APICall";

import Swal from "sweetalert2";

import { job } from "../../networkUtil/Constants";
import { Button } from "@mui/material";

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

  const [fetchingData, setFetchingData] = useState(false);
  const [serviceReportList, setQuoteList] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [formData, setFormData] = useState({
    used_products: "",
    addresses: "",
    recommendations_and_remarks: "",
    pest_found_ids: "",
    tm_ids: "",
    type_of_visit: "",
    job_id: null,
  });

  const [id, setId] = useState("");  

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
    setFormData(prev => ({...prev, job_id: urlId}))
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllJobs(id);
    }
  }, [id]);

  const getAllJobs = async () => {
    setFetchingData(true);

    try {
      const response = await api.getDataWithToken(`${job}/${id}`);
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false); // Set loadingDetails to false after fetching
    }
  };

  const handleSubmit = async () => {
    try {
      const endpoint = `${job}/service_report/create`;

      const response = await api.postDataWithTokn(endpoint, formData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Data has been ${id ? "updated" : "added"} successfully!`,
        });
        router.push("/viewQuote");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit data. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred.",
      });
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div>
      <ClientDetails
        formData={formData}
        setFormData={setFormData}
        serviceReportList={serviceReportList}
      />
      <TypeVisit formData={formData} setFormData={setFormData} />
      <Area formData={formData} setFormData={setFormData} />
      <UseChemicals formData={formData} setFormData={setFormData} />
      <Extra formData={formData} setFormData={setFormData} />
      <Remarks formData={formData} setFormData={setFormData} />

      <Button onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default Page;
