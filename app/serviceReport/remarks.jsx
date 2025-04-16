"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";
import MultilineInput from "@/components/generic/MultilineInput";

const Remarks = ({ formData, setFormData }) => {
  const handleRemarksChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      recommendations_and_remarks: value,
    }));
  };

  const handleOfficeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      for_office_use: value,
    }));
  };

  const handleDeleteRemarks = () => {
    setFormData((prevData) => ({
      ...prevData,
      recommendations_and_remarks: "",
    }));
  };

  return (
    <div className="mt-10 w-full">
      <div className="relative">
        <MultilineInput
          title={"Recommendations and remarks"}
          type={"text"}
          placeholder={"Enter description"}
          value={formData.recommendations_and_remarks || ""}
          onChange={handleRemarksChange}
        />
      </div>
    </div>
  );
};

export default Remarks;