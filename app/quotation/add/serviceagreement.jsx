"use client";

import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";

const ServiceAgreement = () => {
  const api = new APICall();
  const [service, setServices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const getAllServices = async () => {
    setIsLoading(true);
    const response = await api.getDataWithToken(services);
    setServices(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllServices();
  }, []);

  const handleCheckboxChange = (id) => {
    setAgreements((prevAgreements) =>
      prevAgreements.map((agreement) =>
        agreement.id === id
          ? { ...agreement, checked: !agreement.checked }
          : agreement
      )
    );
  };

  return (
    <div>
      <h1 className="mt-5">Service Agreement</h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {service.map((agreement) => (
          <div
            key={agreement.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={agreement.checked}
              onChange={() => handleCheckboxChange(agreement.id)}
            />
            <label style={{ marginLeft: "0.5rem" }}>{agreement.pest_name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceAgreement;
