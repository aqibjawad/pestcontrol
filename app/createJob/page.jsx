"use client";

import React, {useState, useEffect} from "react";

import CustomerDetails from "./customerDetails";
import PriorityJob from "./priorityJob";
import ServiceProduct from "./serviceProduct";
import TermsConditions from "./terms";

import APICall from "@/networkUtil/APICall";
import { job } from "../../networkUtil/Constants";

const Page = () => {
  const api = new APICall();

  const [formData, setFormData] = useState({
    user_id: "",
    job_title: "",
    user_id: "",
    client_address_id: null,
    subject: "",
    tm_ids: [],
    description: "",
    trn: "",
    tag: "",
    dis_per:"",
    vat_per:"",
    duration_in_months: "",
    term_and_condition_id:"",
    priority:"",
    is_food_watch_account: false,
    billing_method: "",
    service_ids: [],
    service_rates: [],
    job_date:""
  });

  const handleSubmit = async () => {
    try {
      const response = await api.postDataWithTokn(
        `${job}/create`,
        formData
      );
      console.log("Response:", formData);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div>
      <div className="pageTitle"> Create Job </div>

      <CustomerDetails />
      <PriorityJob />
      <ServiceProduct />
      <TermsConditions />
    </div>
  );
};

export default Page;
