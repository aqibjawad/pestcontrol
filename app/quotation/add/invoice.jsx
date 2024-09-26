"use client";

import React, { useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { FormGroup, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const Invoice = ({ setFormData, formData }) => {
  const [billingFrequency, setBillingFrequency] = useState("");
  const [selectedBillingMethod, setSelectedBillingMethod] = useState(""); // Track selected billing method

  const handleBillingFrequencyChange = (value) => {
    // Clear radio selection if the user types in the input field
    setBillingFrequency(value);
    setSelectedBillingMethod(""); // Clear selected radio option

    setFormData((prev) => ({
      ...prev,
      no_of_installments: value,
      billing_method: "installments", // Set billing method to "installment" when billing frequency is entered
    }));
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;

    // Clear input field when a radio button is selected
    setBillingFrequency("");
    setSelectedBillingMethod(value);

    setFormData((prev) => ({
      ...prev,
      no_of_installments: "", // Clear the billing frequency when a radio button is selected
      billing_method: value, // Set selected billing method
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
            <RadioGroup
              row // Add this prop to display radio buttons in a row
              value={selectedBillingMethod}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                control={<Radio />}
                label="Monthly"
                value="monthly"
              />
              <FormControlLabel
                control={<Radio />}
                label="Service"
                value="service"
              />
              <FormControlLabel
                control={<Radio />}
                label="Yearly"
                value="yearly"
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
