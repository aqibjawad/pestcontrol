"use client";

import React, { useEffect, useMemo, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";

import ContractSummary from "./contract";

const ServiceAgreement = ({ setFormData, formData }) => {
  const api = new APICall();
  const [service, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myServices, setMyServices] = useState([]);

  const getAllServices = async () => {
    setIsLoading(true);
    const response = await api.getDataWithToken(services);
    const agreementsWithChecked = response.data.map((agreement) => ({
      ...agreement,
      checked: false,
    }));
    setServices(agreementsWithChecked);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllServices();
  }, []);

  useEffect(() => {
    if (service !== undefined) {
      makeServicesList();
    }
  }, [service]);

  const [subTotals, setSubTotals] = useState([]);

  // Function to update subtotal for each JobsList component
  const updateSubTotal = (index, subTotal) => {
    setSubTotals((prev) => {
      const updatedSubTotals = [...prev];
      updatedSubTotals[index] = subTotal;
      return updatedSubTotals;
    });
  };

  // Calculate grand total
  const grandTotal = subTotals.reduce((total, sub) => total + sub, 0);

  const makeServicesList = () => {
    const servicesWithCheck = service.map((item) => ({
      service_id: item.id,
      pest_name: item.pest_name, // Make sure this property is included
      isChecked: false,
      detail: [
        {
          job_type: item.job_type || "one_time",
          rate: item.rate || 1,
          dates: item.dates || [],
        },
      ],
    }));

    setMyServices(servicesWithCheck);
  };

  const handleCheckboxChange = (index) => {
    setMyServices((prevServices) =>
      prevServices.map((service, i) =>
        i === index ? { ...service, isChecked: !service.isChecked } : service
      )
    );
  };

  const handleSubmit = () => {
    const checkedServices = myServices.filter((service) => service.isChecked);
    setFormData((prev) => ({ ...prev, services: checkedServices }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="mt-10"
      style={{ border: "1px solid #D0D5DD", padding: "20px" }}
    >
      <div className="mt-5" style={{ fontSize: "20px", fontWeight: "600" }}>
        Service Agreement
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {myServices?.map((agreement, index) => (
          <div
            key={agreement.service_id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={agreement.isChecked}
              onChange={() => handleCheckboxChange(index)}
            />
            <label style={{ marginLeft: "0.5rem" }}>
              {agreement.pest_name}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-10 mb-10">
        {myServices
          .filter((service) => service.isChecked)
          .map((service, index) => (
            <JobsList
              checkedServices={myServices.filter(
                (service) => service.isChecked
              )}
              formData={formData}
              setFormData={setFormData}
              updateSubTotal={(subTotal) => updateSubTotal(index, subTotal)}
            />
          ))}
      </div>

      {/* Pass the grand total to the ContractSummary */}
      <ContractSummary grandTotal={grandTotal} />
    </div>
  );
};

export default ServiceAgreement;
