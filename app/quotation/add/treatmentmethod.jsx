"use client";

import React, { useEffect, useState } from "react";
import { treatmentMethods } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";

const TreatmentMethod = ({ setFormData }) => {

  const api = new APICall();
  const [service, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myServices, setMyServices] = useState([]);

  const getAllServices = async () => {
    setIsLoading(true);
    const response = await api.getDataWithToken(treatmentMethods);
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

  const makeServicesList = () => {
    const servicesWithCheck = service.map((item) => ({
      id: item.id,
      pest_name: item.pest_name,
      service_title: item.service_title,
      term_and_conditions: item.term_and_conditions,
      isChecked: false,
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
        {myServices.map((agreement, index) => (
          <div
            key={agreement.id}
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
        <JobsList
          checkedServices={myServices.filter((service) => service.isChecked)}
        />
      </div>
    </div>
  );
};

export default TreatmentMethod;
