"use client";

import React, { useEffect, useState } from "react";
import { treatmentMethod } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";

const Method = ({ setFormData }) => {
  const api = new APICall();
  const [service, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myServices, setMyServices] = useState([]);

  const getAllServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDataWithToken(treatmentMethod);
      if (response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  useEffect(() => {
    if (service.length > 0) {
      makeServicesList();
    }
  }, [service]);

  const makeServicesList = () => {
    const servicesWithCheck = service.map((item) => ({
      id: item.id,
      name: item.name,
      isChecked: false,
    }));
    setMyServices(servicesWithCheck);
  };

  const handleCheckboxChange = (index) => {
    setMyServices((prevServices) => {
      const updatedServices = prevServices.map((service, i) =>
        i === index ? { ...service, isChecked: !service.isChecked } : service
      );

      // Get the IDs of the checked services
      const selectedIds = updatedServices
        .filter((service) => service.isChecked)
        .map((service) => service.id);

      // Update the form data with the selected IDs
      setFormData((prevData) => ({
        ...prevData,
        tm_ids: selectedIds,
      }));

      return updatedServices;
    });
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
        Treatment Method
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {myServices.length > 0 ? (
          myServices.map((agreement, index) => (
            <div
              key={agreement.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={agreement.isChecked}
                onChange={() => handleCheckboxChange(index)}
              />
              <label style={{ marginLeft: "0.5rem" }}>{agreement.name}</label>
            </div>
          ))
        ) : (
          <div>No services available</div>
        )}
      </div>
    </div>
  );
};

export default Method;
