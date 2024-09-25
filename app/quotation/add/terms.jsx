"use client";

import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { termsCond } from "../../../networkUtil/Constants";
import Dropdown from "@/components/generic/Dropdown";

const TermsConditions = ({ setFormData }) => {
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

  const handleBrandChange = (value) => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        term_and_condition_id: String(value),
      }));
    }
  };

  return (
    <div className="mt-10">
      <Dropdown
        title={"Select Terms and Conditions"}
        options={brands}
        onChange={handleBrandChange}
      />
    </div>
  );
};

export default TermsConditions;
