"use client";

import React, { useState, useEffect } from "react";
import BasicQuote from "./add/basicQuote";
import ServiceAgreement from "./add/serviceagreement";
import Method from "./add/method";
import Invoice from "./add/invoice";
// import Scope from "./add/scope";
import TermConditions from "./add/terms";
import APICall from "@/networkUtil/APICall";
import { quotation } from "../../networkUtil/Constants";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import GreenButton from "@/components/generic/GreenButton";

import CircularProgress from "@mui/material/CircularProgress";

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

  const [formData, setFormData] = useState({
    manage_type: id ? "update" : "create",
    quote_id: id || null, // Initialize quote_id with id if it exists
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
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = `${quotation}/manage`;
      // Ensure manage_type and quote_id are correct before submission
      const submissionData = {
        ...formData,
        manage_type: id ? "update" : "create",
        quote_id: id || null, // Ensure quote_id is included for edit operations
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

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllQuotes(urlId);
    }
  }, [id]);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${quotation}/${id}`);
      // Ensure manage_type and quote_id are set when setting fetched data
      setFormData({
        ...response.data,
        manage_type: "update",
        quote_id: id,
      });
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  if (fetchingData) return <div>Loading...</div>;

  return (
    <div>
      <div className="quote-main-head">Quotes</div>
      <div className="quote-main-decrp">
        Us to meet your needs. We look forward to serving you with excellence.
      </div>

      <BasicQuote setFormData={setFormData} formData={formData} />
      <ServiceAgreement
        duration_in_months={formData.duration_in_months}
        setFormData={setFormData}
        formData={formData}
      />
      <Method setFormData={setFormData} formData={formData} />
      <Invoice setFormData={setFormData} formData={formData} />
      {/* <Scope setFormData={setFormData} formData={formData} /> */}
      <TermConditions setFormData={setFormData} formData={formData} />
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

export default Page;
