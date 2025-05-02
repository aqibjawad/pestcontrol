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

  const CAPTAIN_ID = serviceReportList?.captain_id;

  useEffect(() => {
    // Add detailed logging for ID comparison
    console.log("Current User ID:", currentUserId, "Type:", typeof currentUserId);
    console.log("Captain ID:", CAPTAIN_ID, "Type:", typeof CAPTAIN_ID);
    
    if (currentUserId === CAPTAIN_ID) {
      setIsCaptain(true);
      console.log("User IS a captain! IDs match:", currentUserId, "===", CAPTAIN_ID);
    } else {
      setIsCaptain(false);
      console.log("User is NOT a captain. IDs don't match:", currentUserId, "!==", CAPTAIN_ID);
    }
  }, [currentUserId, CAPTAIN_ID]); // Added CAPTAIN_ID to dependencies

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
    setId(urlId);
    setFormData((prev) => ({ ...prev, job_id: urlId }));
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null && id !== "") {
      getAllJobs(id);
    }
  }, [id]);

  const getAllJobs = async (jobId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/${jobId}`);
      setQuoteList(response.data);
      console.log("Service report data loaded:", response.data);
      console.log("Captain ID from service report:", response.data.captain_id, "Type:", typeof response.data.captain_id);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const getEmployeeStock = async (userId) => {
    if (!userId) {
      console.log("Cannot fetch employee stock: userId is not available");
      return;
    }

    setFetchingData(true);
    try {
      const url = `${getAllEmpoyesUrl}/${userId}`;
      const response = await api.getDataWithToken(url);
      setEmployeeList(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      getEmployeeStock(currentUserId);
    }
  }, [currentUserId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First API call to create service report
      const serviceReportEndpoint = `${job}/service_report/create`;
      const serviceReportResponse = await api.postDataWithTokn(
        serviceReportEndpoint,
        formData
      );

      if (serviceReportResponse.status === "success") {
        const serviceReportId = serviceReportResponse.data.id;

        // Second API call with service report ID in the body
        const feedbackEndpoint = `${job}/service_report/feedback/create`;
        const feedbackData = {
          for_office_use: formData.for_office_use,
          job_service_report_id: serviceReportId,
        };

        const feedbackResponse = await api.postDataWithTokn(
          feedbackEndpoint,
          feedbackData
        );

        if (feedbackResponse.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Report submitted successfully!",
          });
          router.push(`/serviceReportPdf?id=${serviceReportId}`);
        } else {
          throw new Error(
            feedbackResponse.error?.message || "Failed to submit feedback"
          );
        }
      } else {
        throw new Error(
          serviceReportResponse.error?.message ||
            "Failed to create service report"
        );
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
      {/* Debug display for captain status */}
      <div className="bg-gray-100 p-2 mb-4 text-sm">
        <p>Debug Info:</p>
        <p>User ID: {currentUserId || 'Not loaded'}</p>
        <p>Captain ID: {CAPTAIN_ID || 'Not loaded'}</p>
        <p>Is Captain: {isCaptain ? 'Yes' : 'No'}</p>
      </div>

      <ClientDetails
        formData={formData}
        setFormData={setFormData}
        serviceReportList={serviceReportList}
      />
      <TypeVisit formData={formData} setFormData={setFormData} />
      <ServiceJobs serviceReportList={serviceReportList} formData={formData} setFormData={setFormData} />
      <Area formData={formData} setFormData={setFormData} />
      <UseChemicals
        formData={formData}
        setFormData={setFormData}
        employeeList={isCaptain ? employeeList : null}
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
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);