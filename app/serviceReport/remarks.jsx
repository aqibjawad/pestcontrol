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

  return (
    <div className="mt-10" style={{ width: "100%" }}>
      <MultilineInput
        title={"Recommendations and remarks"}
        type={"text"}
        placeholder={"Enter description"}
        value={formData.recommendations_and_remarks || ""}
        onChange={handleRemarksChange}
      />

      {/* <div className="mt-5">
        <MultilineInput
          title={"For Office use"}
          type={"text"}
          placeholder={"Enter description"}
          value={formData.for_office_use || ""}
          onChange={handleOfficeChange}
        />
      </div> */}
    </div>
  );
};

export default Remarks;
