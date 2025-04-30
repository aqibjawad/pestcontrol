"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css";

const ServiceJobs = ({ formData, setFormData }) => {
  const handleVisitTypeChange = (event) => {
    const { value, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      type_of_visit: value,
    }));
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop:"2rem" }} className={styles.visitHead}>
        Service Jobs
      </div>
      <div className={styles.checkboxesContainer}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Service 1"
            checked={formData.type_of_visit === "Service 1"}
            onChange={handleVisitTypeChange}
          />
          Service 1
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Service 2"
            checked={formData.type_of_visit === "Service 2"}
            onChange={handleVisitTypeChange}
          />
          Service 2
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visitType"
            value="Service 3"
            checked={formData.type_of_visit === "Service 3"}
            onChange={handleVisitTypeChange}
          />
          Service 3
        </label>
      </div>
    </div>
  );
};

export default ServiceJobs;
