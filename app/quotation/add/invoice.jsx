"use client";

import React, { useState } from "react";

import styles from "../../../styles/loginStyles.module.css";

import Dropdown from "@/components/generic/Dropdown";

import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const Invoice = () => {
  const [contractedList, setContractedList] = useState([]);

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <div className="mt-5" style={{ border: "1px solid #D0D5DD" }}>
        <div style={{ padding: "10px", fontWeight: "600", fontSize: "16px" }}>
          Invoice
        </div>

        <div
          style={{
            border: "1px solid #D0D5DD",
            padding: "30px",
            color: "#1C1C1E",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Billing frequency
        </div>

        <div
          className={styles.userFormContainer}
          style={{ fontSize: "16px", margin: "auto" }}
        >
          <div className="mt-5 border border-gray-300">
            <div className="p-2.5 font-semibold text-lg">Invoice</div>
            <div className="border border-gray-300 p-7.5 text-black font-semibold text-lg" style={{padding:'10px'}}>
              Billing frequency
            </div>

            <div className="flex gap-4 mt-4 pl-4 pb-4">
                
              <div className="w-1/2 mt-10">
                <Dropdown
                  title={"Service Product"}
                  options={contractedList && contractedList}
                />
              </div>

              <div className="w-1/2 mt-10 ms-20">
                <div className="text-lg font-semibold mb-4">Billing method</div>
                <div className="flex space-x-4">
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Monthly" />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Monthly" />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Monthly" />
                  </FormGroup>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
