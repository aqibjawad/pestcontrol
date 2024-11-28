"use client";

import React, { useState, useEffect } from "react";
import CustomerDetails from "./customerDetails";
import PriorityJob from "./priorityJob";
// import ServiceAgreement from "./serviceagreement";
import TermsConditions from "./terms";
import Method from "./method";
// import JobsList from "./JobsList"; // Import the JobsList component

import APICall from "@/networkUtil/APICall";
import { job } from "../../networkUtil/Constants";

import GreenButton from "@/components/generic/GreenButton";

import Swal from "sweetalert2";

import withAuth from "@/utils/withAuth";

const Page = () => {
  const api = new APICall();

  const [formData, setFormData] = useState({
    user_id: "",
    job_title: "",
    client_address_id: null,
    subject: "",
    tm_ids: [],
    description: "",
    trn: "",
    tag: "",
    dis_per: "",
    vat_per: "",
    term_and_condition_id: "",
    priority: "high",
    is_food_watch_account: false,
    service_ids: [],
    service_rates: [],
    job_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [allServices, setAllServices] = useState([]); // State to store all services

  useEffect(() => {
    // Fetch all services when component mounts
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      const response = await api.getDataWithToken('services/all'); // Adjust the API endpoint as needed
      setAllServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const updateJobList = (jobs) => {
    setFormData(prevData => ({
      ...prevData,
      service_ids: jobs.map(job => job.serviceId),
      service_rates: jobs.map(job => job.rate)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.postDataWithTokn(`${job}/create`, formData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        router.push("/viewQuote");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit data. Please try again.",
        });
      }
      console.log("Response:", response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${error.message}`,
      });
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pageTitle"> Create Job </div>

      <CustomerDetails setFormData={setFormData} formData={formData} />
      <PriorityJob setFormData={setFormData} />
      {/* <ServiceAgreement setFormData={setFormData} /> */}
      {/* <JobsList allServices={allServices} updateJobList={updateJobList} /> */}
      <Method setFormData={setFormData} />
      <TermsConditions setFormData={setFormData} />

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={loading ? "Submitting..." : "Submit"}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);