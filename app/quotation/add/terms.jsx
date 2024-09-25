"use client";

import React, { useState, useEffect } from "react";

import styles from "../../../styles/quotes.module.css";

import APICall from "@/networkUtil/APICall";
import { termsCond } from "../../../networkUtil/Constants";

import Dropdown from "@/components/generic/Dropdown";

const TermsConditions = () => {
  const api = new APICall();

  const [allCond, setAllCond] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brands, setBrandList] = useState([]);

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    try {
      const response = await api.getDataWithToken(termsCond);
      setAllCond(response.data);
      const brandNames = response.data.map((item) => ({ label: item.name, value: item.id }));
      setBrandList(brandNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleBrandChange = (value) => {
    setSelectedBrandId(value);
  };

  return (
    <div className="mt-10">
      <Dropdown
        title={"Select terms and Conditions"}
        options={brands}
        onChange={handleBrandChange}
      />
    </div>
  );
};

export default TermsConditions;