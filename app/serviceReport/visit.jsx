"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";

const visitTypes = [
  "Regular Treatment (Contract)",
  "Inspection Visit (Contract)",
  "Complain Visit (Contract)",
  "One-Off Treatment",
  "Complain Visit (One-Off)",
];

const TypeVisit = ({ formData, setFormData }) => {
  const handleVisitTypeChange = (event) => {
    const { value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      type_of_visit: value,
    }));
  };

  return (
    <div>
      <div style={{ textAlign: "center" }} className={styles.visitHead}>
        Type Of Visit
      </div>
      <div className={styles.checkboxesContainer}>
        {visitTypes.map((type) => (
          <label key={type} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="visitType"
              value={type}
              checked={formData.type_of_visit === type}
              onChange={handleVisitTypeChange}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TypeVisit;
