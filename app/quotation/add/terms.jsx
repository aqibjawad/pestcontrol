"use client";

import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { termsCond } from "../../../networkUtil/Constants";
import Dropdown2 from "@/components/generic/Dropdown2";

const TermsConditions = ({ formData, setFormData }) => {

  // console.log("form darta",formData);
  
  const api = new APICall();
  const [brands, setBrandList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();  

  useEffect(() => {
    getAllClients();
  }, []);

  useEffect(() => {
    console.log("jslkdfjk", formData.term_and_condition_id)
    if (brands.length > 0 && formData.term_and_condition_id) {
      const matchingBrand = brands.find(
        (brand) => brand.value === formData.term_and_condition_id
      );

      if (matchingBrand) {
        setSelectedBrand(matchingBrand);
      }
    }
  }, [brands.length, formData.term_and_condition_id]);

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

  const handleBrandChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedBrand(selectedOption);
      setFormData((prev) => ({
        ...prev,
        term_and_condition_id: String(selectedOption.value),
      }));
    }
  };

  return (
    <div className="mt-10">
      <Dropdown2
        title={"Select Terms and Conditions"}
        options={brands}
        onChange={handleBrandChange}
        value={selectedBrand}
      />
    </div>
  );
};

export default TermsConditions;
