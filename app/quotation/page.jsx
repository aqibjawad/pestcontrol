"use client";

import React, { useState, useEffect } from "react";
import BasicQuote from "./add/basicQuote";
import ServiceAgreement from "./add/serviceagreement";
import Method from "./add/method";
import Invoice from "./add/invoice";
import ContractSummery from "./add/contract";
import Scope from "./add/scope";
import TermConditions from "./add/terms";
import APICall from "@/networkUtil/APICall";
import { quotation } from "../../networkUtil/Constants";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    manage_type: "create",
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
    dates: [],
  });

  const handleSubmit = async () => {
    try {
      const response = await api.postDataWithTokn(
        `${quotation}/manage`,
        formData
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (id) {
      getAllQuotes();
    }
  }, [id]); // Fetch when id changes

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${quotation}/${id}`);
      setFormData(response.data); // Update formData with fetched data
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  if (fetchingData) return <div>Loading...</div>; // Optional loading state

  return (
    <div>
      <div className="quote-main-head">Quotes</div>
      <div className="quote-main-decrp">
        Us to meet your needs. We look forward to serving you with excellence.
      </div>

      <BasicQuote setFormData={setFormData} formData={formData} />
      <ServiceAgreement setFormData={setFormData} formData={formData} />
      <Method setFormData={setFormData} formData={formData} />
      <Invoice setFormData={setFormData} formData={formData} />
      <ContractSummery formData={formData} />
      <Scope formData={formData} />
      <TermConditions setFormData={setFormData} formData={formData} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Page;
