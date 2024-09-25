"use client";

import React, { useState } from "react";
import BasicQuote from "./add/basicQuote";
import ServiceAgreement from "./add/serviceagreement";
import TreatmentMethod from "./add/treatmentMethod";
import Invoice from "./add/invoice";
import ContractSummery from "./add/contract";
import Scope from "./add/scope";
import TermConditions from "./add/terms";
import APICall from "@/networkUtil/APICall";
import { quotation } from "../../networkUtil/Constants";

const Page = () => {
  const api = new APICall();

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
  });

    const handleSubmit = async () => {
      try {
        const response = await api.postDataWithTokn(
          `${quotation}/manage`,
          formData
        );
        console.log("Response:", formData);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };

  return (
    <div>
      <div className="quote-main-head">Quotes</div>
      <div className="quote-main-decrp">
        Us to meet your needs. We look forward to serving you with excellence.
      </div>

      <BasicQuote setFormData={setFormData} />
      <ServiceAgreement setFormData={setFormData} formData={formData} />
      <TreatmentMethod setFormData={setFormData} />
      <Invoice setFormData={setFormData} />
      <ContractSummery />
      <Scope />
      <TermConditions setFormData={setFormData} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Page;
