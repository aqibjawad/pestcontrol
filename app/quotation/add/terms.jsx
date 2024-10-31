"use client";
import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { termsCond } from "../../../networkUtil/Constants";

const TermsConditions = ({ setFormData, formData }) => {
  const api = new APICall();
  const [brands, setBrandList] = useState([]);

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    try {
      const response = await api.getDataWithToken(termsCond);
      const brandNames = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setBrandList(brandNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      term_and_condition_id: value,
    }));
  };

  return (
    <div className="mt-10">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Terms and Conditions
      </label>
      <select
        className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        onChange={handleChange}
        value={formData?.term_and_condition?.id || ""}
      >
        <option value="">Select an option</option>
        {brands.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TermsConditions;
