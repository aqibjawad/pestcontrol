"use client";

import React, { useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";
import APICall from "../../../networkUtil/APICall";

const Invoice = ({ setFormData }) => {
  
  const [billingFrequency, setBillingFrequency] = useState("");
  const [billingMethods, setBillingMethods] = useState({
    monthly: false,
    service: false,
    yearly: false,
  });

  const handleBillingFrequencyChange = (value) => {
    setBillingFrequency(value);
    setFormData((prev) => ({ ...prev, billingMethod: value })); // Update billing method in formData
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setBillingMethods((prev) => ({
      ...prev,
      [name]: checked,
    }));
    setFormData((prev) => ({
      ...prev,
      services: { ...prev.services, [name]: checked }, // Store selected billing methods
    }));
  };

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <div className="mt-5 border border-gray-300">
        <div className="p-2.5 font-semibold text-lg">Invoice</div>

        <div className="flex gap-4 pl-4 pb-4">
          <div className="w-1/2">
            <InputWithTitle
              title={"Billing Frequency"}
              value={billingFrequency}
              onChange={handleBillingFrequencyChange}
            />
          </div>

          <div className="w-1/2 ms-20">
            <div className="text-lg font-semibold mb-4">Billing Methods</div>
            <div className="flex space-x-4">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={billingMethods.monthly}
                      onChange={handleCheckboxChange}
                      name="monthly"
                    />
                  }
                  label="Monthly"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={billingMethods.service}
                      onChange={handleCheckboxChange}
                      name="service"
                    />
                  }
                  label="Service"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={billingMethods.yearly}
                      onChange={handleCheckboxChange}
                      name="yearly"
                    />
                  }
                  label="Yearly"
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
