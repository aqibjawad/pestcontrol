"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";
import MultilineInput from "@/components/generic/MultilineInput";

const Remarks = ({ formData, setFormData }) => {
  const handleRemarksChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      recommendations_and_remarks: value
    }));
  };

  return (
    <div className="mt-10" style={{ width: "100%" }}>
      <MultilineInput
        title={"Recommendations and remarks"}
        type={"text"}
        placeholder={"Enter description"}
        value={formData.recommendations_and_remarks || ""}
        onChange={handleRemarksChange}
      />
    </div>
  );
};

export default Remarks;