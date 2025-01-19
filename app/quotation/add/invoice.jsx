"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { FormGroup, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const Invoice = ({ setFormData, formData }) => {  

  const [billingFrequency, setBillingFrequency] = useState(0);

  // Check if any service has the "Quarterly" job type
  const hasQuarterlyService = formData.services?.some((service) =>
    service.detail?.some((detail) => detail.job_type === "custom")
  );

  const [selectedBillingMethod, setSelectedBillingMethod] = useState(
    formData.billing_method || ""
  );

  useEffect(() => {
    // Update selectedBillingMethod whenever formData.billing_method changes
    setSelectedBillingMethod(formData.billing_method || "");
  }, [formData.billing_method]);

  const handleBillingFrequencyChange = (value) => {
    setBillingFrequency(value);
    setSelectedBillingMethod("");
    setFormData((prev) => ({
      ...prev,
      no_of_installments: value,
      billing_method: "installments",
    }));
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;

    setBillingFrequency("");
    setSelectedBillingMethod(value);

    setFormData((prev) => ({
      ...prev,
      no_of_installments: 0,
      billing_method: value,
    }));
  };

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <div className="mt-5 border border-gray-300">
        <div className="flex gap-4 pl-4 pb-4">
          <div className="w-1/2">
            <div className="text-lg font-semibold mb-4 p-2.5">
              Billing Methods
            </div>
            <RadioGroup
              row
              value={selectedBillingMethod}
              onChange={handleRadioChange}
            >
              {hasQuarterlyService ? (
                ""
              ) : (
                <FormControlLabel
                  control={<Radio />}
                  label="Monthly"
                  value="monthly"
                />
              )}
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
