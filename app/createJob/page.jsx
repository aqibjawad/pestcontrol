"use client";

import React, { useState, useEffect } from "react";
import CustomerDetails from "./customerDetails";
import PriorityJob from "./priorityJob";
import ServiceAgreement from "./serviceAgreement";
import TermsConditions from "./terms";
import Method from "./method";

import APICall from "@/networkUtil/APICall";
import { job } from "../../networkUtil/Constants";

import GreenButton from "@/components/generic/GreenButton";

import Swal from "sweetalert2";

import withAuth from "@/utils/withAuth";

import { useRouter } from "next/navigation";

const Page = () => {

  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    user_id: "",
    job_title: "",
    client_address_id: null,
    subject: "",
    tm_ids: "",
    description: "",
    trn: "",
    tag: "",
    dis_per: "",
    vat_per: "",
    term_and_condition_id: "",
    priority: "high",
    is_food_watch_account: false,
    service_ids: "",
    service_rates: [],
    job_date: "",
  });

  const [loading, setLoading] = useState(false);

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
        router.push("/allJobs");
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
      <ServiceAgreement formData={formData} setFormData={setFormData} />
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