"use client";

import React, { useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const Invoice = ({ setFormData, formData }) => {
  const [billingFrequency, setBillingFrequency] = useState("");
  const [billing_methods, setBillingMethods] = useState({
    monthly: false,
    service: false,
    yearly: false,
  });

  const handleBillingFrequencyChange = (value) => {
    setBillingFrequency(value);
    setFormData((prev) => ({ ...prev, billing_frequency: value })); // Update billing frequency in formData
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // Update the local state for checkboxes
    setBillingMethods((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Create a string of selected billing methods
    const updatedBillingMethods = {
      monthly: billing_methods.monthly,
      service: billing_methods.service,
      yearly: billing_methods.yearly,
      [name]: checked, // Set the changed value
    };

    // Create a string of selected methods
    const selectedMethods = Object.keys(updatedBillingMethods)
      .filter((method) => updatedBillingMethods[method])
      .join(", "); // Join methods with a comma

    setFormData((prev) => ({
      ...prev,
      billing_method: selectedMethods, // Store selected billing methods as a string
    }));
  };

  return (
    <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
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
                      checked={billing_methods.monthly}
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
                      checked={billing_methods.service}
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
                      checked={billing_methods.yearly}
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
