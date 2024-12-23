"use client";

import React, { useState, useEffect } from "react";
import BasicQuote from "./add/basicQuote";
import ServiceAgreement from "./add/serviceagreement";
import Method from "./add/method";
import Invoice from "./add/invoice";
import TermConditions from "./add/terms";
import APICall from "@/networkUtil/APICall";
import { quotation } from "../../networkUtil/Constants";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import GreenButton from "@/components/generic/GreenButton";
import CircularProgress from "@mui/material/CircularProgress";
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
  const [id, setId] = useState(null);

  // Initial form state
  const [formData, setFormData] = useState({
    manage_type: id ? "update" : "create",
    quote_id: id || null,
    quote_title: "",
    user_id: "",
    client_address_id: null,
    subject: "",
    tm_ids: [],
    description: "",
    trn: "",
    tag: "",
    duration_in_months: "",
    is_food_watch_account: false,
    billing_method: "",
    services: [],
    processedQuoteServices: false, // Flag to track if quote services have been processed
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Safe state update function
  const safeSetFormData = (updates) => {
    setFormData((prev) => {
      // If updates is a function, call it with prev
      if (typeof updates === "function") {
        const newState = updates(prev);
        // console.log("New Form State:", newState); // Debug log
        return newState;
      }

      // If updates is an object, merge it with prev
      const newState = {
        ...prev,
        ...updates,
        // Ensure services array is properly merged
        services: Array.isArray(updates.services)
          ? [...(prev.services || []), ...updates.services]
          : prev.services,
      };

      // console.log("New Form State:", newState); // Debug log
      return newState;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = `${quotation}/manage`;
      const submissionData = {
        ...formData,
        manage_type: id ? "update" : "create",
        quote_id: id || null,
      };

      const response = await api.postDataWithTokn(endpoint, submissionData);
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
      setLoading(false);
    }
  };

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      if (id !== null) {
        const response = await api.getDataWithToken(`${quotation}/${id}`);
        safeSetFormData({
          ...response.data,
          manage_type: "update",
          quote_id: id,
        });
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllQuotes(urlId);
    }
  }, [id]);

  if (fetchingData) return <div>Loading...</div>;

  return (
    <div>
      <div className="quote-main-head pageTitle">Create Quote</div>

      <BasicQuote setFormData={safeSetFormData} formData={formData} />
      <ServiceAgreement
        duration_in_months={formData.duration_in_months}
        setFormData={safeSetFormData}
        formData={formData}
      />
      <Method setFormData={safeSetFormData} formData={formData} />
      <Invoice setFormData={safeSetFormData} formData={formData} />
      <TermConditions setFormData={safeSetFormData} formData={formData} />

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : id ? (
              "Update"
            ) : (
              "Submit"
            )
          }
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);
