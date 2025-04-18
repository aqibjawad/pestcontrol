"use client";

import React, { useState, useEffect } from "react";
import ClientDetails from "./clientDetails";
import TypeVisit from "./visit";
import Area from "./area";
import UseChemicals from "./useeChemical";
import Extra from "./extra";
import Remarks from "./remarks";
import Feedback from "./feedback";
import APICall from "@/networkUtil/APICall";
import Swal from "sweetalert2";
import { job } from "../../networkUtil/Constants";
import { useRouter } from "next/navigation";
import GreenButton from "@/components/generic/GreenButton";
import { CircularProgress } from "@mui/material";
import withAuth from "@/utils/withAuth";

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
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [serviceReportList, setQuoteList] = useState(null);
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
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
    setFormData((prev) => ({ ...prev, job_id: urlId }));
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
      setLoadingDetails(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First API call to create service report
      const serviceReportEndpoint = `${job}/service_report/create`;
      const serviceReportResponse = await api.postDataWithTokn(serviceReportEndpoint, formData);
      
      if (serviceReportResponse.status === "success") {
        const serviceReportId = serviceReportResponse.data.id;
        
        // Second API call with service report ID in the body
        const feedbackEndpoint = `${job}/service_report/feedback/create`;
        const feedbackData = {
          for_office_use: formData.for_office_use ,
          job_service_report_id: serviceReportId
        };
        
        const feedbackResponse = await api.postDataWithTokn(feedbackEndpoint, feedbackData);
        
        if (feedbackResponse.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Report submitted successfully!",
          });
          router.push(`/serviceReportPdf?id=${serviceReportId}`);
        } else {
          throw new Error(feedbackResponse.error.message || "Failed to submit feedback");
        }
      } else {
        throw new Error(serviceReportResponse.error.message || "Failed to create service report");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred.",
      });
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
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
      <Feedback formData={formData} setFormData={setFormData} />

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);