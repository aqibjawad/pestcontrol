"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";
import MultilineInput from "@/components/generic/MultilineInput";

const Feedback = ({ formData, setFormData }) => {

  const handleOfficeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      for_office_use: value,
    }));
  };

  return (
    <div className="mt-10" style={{ width: "100%" }}>

      <div className="mt-5">
        <MultilineInput
          title={"For Office use"}
          type={"text"}
          placeholder={"Enter description"}
          value={formData.for_office_use || ""}
          onChange={handleOfficeChange}
        />
      </div>
    </div>
  );
};

export default Feedback;
