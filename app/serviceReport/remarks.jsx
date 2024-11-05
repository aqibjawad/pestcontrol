"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";
import MultilineInput from "@/components/generic/MultilineInput";
import { FaTrashAlt } from "react-icons/fa";

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
        
        {formData.recommendations_and_remarks && (
          <button
            onClick={handleDeleteRemarks}
            className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete remarks"
          >
            <FaTrashAlt size={20} />
          </button>
        )}
      </div>

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