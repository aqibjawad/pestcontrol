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
    quoteTitle: "",
    user_id: "",
    clientAddressId: null,
    subject: "",
    tm_ids: [],
    description: "",
    trn: "",
    tag: "",
    durationInMonths: "",
    isFoodWatchAccount: false,
    billing_method: "",
    services: [],
  });

  const handleSubmit = async () => {
    const payload = {
      manage_type: "create",
      user_id: formData.user_id, // Replace with dynamic user ID if necessary
      quote_title: formData.quoteTitle,
      client_address_id: formData.clientAddressId,
      subject: formData.subject,
      tm_ids: formData.tm_ids,
      description: formData.description,
      trn: formData.trn,
      tag: formData.tag,
      duration_in_months: formData.durationInMonths,
      is_food_watch_account: formData.isFoodWatchAccount ? 1 : 0,
      billing_method: formData.billing_method,
      services: formData.services, // Ensure this is structured as needed
    };

    try {
      const response = await api.postFormDataWithToken(
        `${quotation}/manage`,
        payload
      );
      console.log("Response:", response);
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
      <ServiceAgreement setFormData={setFormData} />
      <TreatmentMethod setFormData={setFormData} />
      <Invoice setFormData={setFormData} />
      <ContractSummery />
      <Scope />
      <TermConditions />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Page;
