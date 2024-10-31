"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { FormGroup, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const Invoice = ({ setFormData, formData }) => {
  const [billingFrequency, setBillingFrequency] = useState(0);
  const [selectedBillingMethod, setSelectedBillingMethod] = useState(
    formData.billing_method || ""
  );

  useEffect(() => {
    // Update selectedBillingMethod whenever formData.billing_method changes
    setSelectedBillingMethod(formData.billing_method || "");
  }, [formData.billing_method]);

  const handleBillingFrequencyChange = (value) => {
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

    setBillingFrequency("");
    setSelectedBillingMethod(value);

    setFormData((prev) => ({
      ...prev,
      no_of_installments: 0, // Clear the billing frequency when a radio button is selected
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
              value={formData.no_of_installments}
              onChange={handleBillingFrequencyChange}
            />
          </div>

          <div className="w-1/2 ms-20">
            <div className="text-lg font-semibold mb-4">Billing Methods</div>
            <RadioGroup
              row
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
                value="one_time"
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
