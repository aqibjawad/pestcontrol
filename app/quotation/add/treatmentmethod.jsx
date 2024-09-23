"use client";

import React, { useEffect, useState } from "react";
import { treatmentMethod } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";

const TreatmentMethod = () => {
  const api = new APICall();
  const [mthods, setMethod] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);

  const getAllMethods = async () => {
    setIsLoading(true);
    try {
      const response = await api.getDataWithToken(treatmentMethod);
      setMethod(response.data.map((item) => ({ ...item, checked: false }))); // Add checked property
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllMethods();
  }, []);

  const handleCheckboxChange = (id) => {
    setMethod((prevMethods) =>
      prevMethods.map((method) =>
        method.id === id ? { ...method, checked: !method.checked } : method
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div>
      <h1 className="mt-5">Treatment Method</h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {mthods.map((method) => (
          <div
            key={method.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={method.checked}
              onChange={() => handleCheckboxChange(method.id)}
            />
            <label style={{ marginLeft: "0.5rem" }}>{method.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentMethod;
