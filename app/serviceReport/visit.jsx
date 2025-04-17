"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";

const TypeVisit = ({ formData, setFormData }) => {
  const handleVisitTypeChange = (event) => {
    const { value, checked } = event.target;

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
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Regular Treatment (Contract)"
            checked={formData.type_of_visit === "Regular Treatment (Contract)"}
            onChange={handleVisitTypeChange}
          />
          Regular Treatment (Contract)
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Inspection Visit (Contract)"
            checked={formData.type_of_visit === "Inspection Visit (Contract)"}
            onChange={handleVisitTypeChange}
          />
          Inspection Visit (Contract)
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Complain Visit (Contract)"
            checked={formData.type_of_visit === "Complain Visit (Contract)"}
            onChange={handleVisitTypeChange}
          />
          Complain Visit (Contract)
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="One-Off Treatment"
            checked={formData.type_of_visit === "One-Off Treatment"}
            onChange={handleVisitTypeChange}
          />
          One-Off Treatment
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Complain Visit (One-Off)"
            checked={formData.type_of_visit === "Complain Visit (One-Off)"}
            onChange={handleVisitTypeChange}
          />
          Complain Visit (One-Off)
        </label>
      </div>
    </div>
  );
};

export default TypeVisit;
