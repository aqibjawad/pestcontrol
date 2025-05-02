"use client";

import React, { useState, useEffect } from "react";
import ClientDetails from "./clientDetails";
import TypeVisit from "./visit";
import Area from "./area";
import UseChemicals from "./useeChemical";
import Extra from "./extra";
import Remarks from "./remarks";
import Feedback from "./feedback";
import ServiceJobs from "./serviceJobs";
import APICall from "@/networkUtil/APICall";
import Swal from "sweetalert2";
import { job, getAllEmpoyesUrl } from "../../networkUtil/Constants";
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

  const [employeeList, setEmployeeList] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false);

  // Ensure we get the captain ID as a number for proper comparison
  const CAPTAIN_ID = serviceReportList?.captain_id ? Number(serviceReportList.captain_id) : null;

  const [formData, setFormData] = useState({
    used_products: "",
    addresses: "",
    recommendations_and_remarks: "",
    pest_found_ids: "",
    tm_ids: "",
    type_of_visit: "",
    job_id: null,
    for_office_use: "", // Added missing field for office feedback
  });

  const [id, setId] = useState("");

  // Load user ID from localStorage
  useEffect(() => {
    // Get user ID from local storage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const userId = Number(userData.userId); // Convert to number to ensure proper comparison
        setCurrentUserId(userId);
        console.log("User ID retrieved from localStorage:", userId, "Type:", typeof userId);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found in localStorage");
    }

    // Get job ID from URL
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    if (urlId) {
      setId(urlId);
      setFormData((prev) => ({ ...prev, job_id: urlId }));
    } else {
      console.error("No job ID found in URL");
    }
  }, []);

  // Load job data once we have the ID
  useEffect(() => {
    if (id) {
      getAllJobs(id);
    }
  }, [id]);

  // Check if user is captain whenever relevant data changes
  useEffect(() => {
    if (currentUserId !== null && CAPTAIN_ID !== null) {
      const isUserCaptain = currentUserId === CAPTAIN_ID;
      setIsCaptain(isUserCaptain);
    }
  }, [currentUserId, CAPTAIN_ID]);

  // Load employee data for the current user
  useEffect(() => {
    if (currentUserId) {
      getEmployeeStock(currentUserId);
    }
  }, [currentUserId]);

  const getAllJobs = async (jobId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/${jobId}`);
      if (response && response.data) {
        setQuoteList(response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load job details. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load job details. Please try again.",
      });
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const getEmployeeStock = async (userId) => {
    setFetchingData(true);
    try {
      const url = `${getAllEmpoyesUrl}/${userId}`;
      const response = await api.getDataWithToken(url);
      if (response && response.data) {
        setEmployeeList(response.data);
      } else {
        console.error("Invalid response format when loading employee data:", response);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const validateFormData = () => {
    // Required fields check - adjust as needed based on your form requirements
    const requiredFields = ["job_id", "type_of_visit"];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: `Please fill in all required fields: ${missingFields.join(", ")}`,
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    // Validate form data before submission
    if (!validateFormData()) {
      return;
    }
    
    setLoading(true);
    try {      
      // First API call to create service report
      const serviceReportEndpoint = `${job}/service_report/create`;
      const serviceReportResponse = await api.postDataWithTokn(
        serviceReportEndpoint,
        formData
      );
      if (serviceReportResponse && serviceReportResponse.status === "success") {
        const serviceReportId = serviceReportResponse.data.id;

        // Second API call with service report ID in the body
        const feedbackEndpoint = `${job}/service_report/feedback/create`;
        const feedbackData = {
          for_office_use: formData.for_office_use || "", // Ensure this is never undefined
          job_service_report_id: serviceReportId,
        };
        const feedbackResponse = await api.postDataWithTokn(
          feedbackEndpoint,
          feedbackData
        );
        if (feedbackResponse && feedbackResponse.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Report submitted successfully!",
          });
          router.push(`/serviceReportPdf?id=${serviceReportId}`);
        } else {
          throw new Error(
            feedbackResponse?.error?.message || "Failed to submit feedback"
          );
        }
      } else {
        throw new Error(
          serviceReportResponse?.error?.message ||
            "Failed to create service report"
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while submitting the report.",
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
      <ServiceJobs 
        serviceReportList={serviceReportList} 
        formData={formData} 
        setFormData={setFormData} 
      />
      <Area formData={formData} setFormData={setFormData} />
      <UseChemicals
        formData={formData}
        setFormData={setFormData}
        employeeList={employeeList}
        isCaptain={isCaptain}
      />
      <Extra formData={formData} setFormData={setFormData} />
      <Remarks formData={formData} setFormData={setFormData} />
      <Feedback formData={formData} setFormData={setFormData} />

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={
            loading ? <CircularProgress size={20} color="inherit" /> : "Submit"
          }
          disabled={loading || fetchingData}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);