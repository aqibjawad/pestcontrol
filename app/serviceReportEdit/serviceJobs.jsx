"use client";

import React, { useEffect } from "react";
import styles from "../../styles/serviceReport.module.css";

const ServiceJobs = ({ formData, setFormData, serviceReportList }) => {
  
  useEffect(() => {
    // Handle the services logic when component mounts or serviceReportList changes
    if (serviceReportList?.job_services && serviceReportList.job_services.length > 0) {
      // Get all service IDs regardless of count
      const allServiceIds = serviceReportList.job_services.map(service => service.id);
      
      // Set all services as checked by default
      setFormData(prevData => ({
        ...prevData,
        complete_job_service_id: allServiceIds
      }));
      
      console.log("Auto-selected all services:", allServiceIds);
    }
  }, [serviceReportList, setFormData]);

  // We're keeping this function for reference, but it won't be used
  // since all checkboxes will be disabled to prevent unchecking
  const handleServiceChange = (serviceId) => {
    // No changes are allowed - all services must remain checked
    console.log("Service changes are disabled");
  };

  // Check if we have any services to display
  const hasServices = serviceReportList?.job_services && serviceReportList.job_services.length > 0;

  return (
    <div>
      {/* Show service selection UI if there are any services */}
      {hasServices && (
        <>
          <div style={{ textAlign: "center", marginTop: "2rem" }} className={styles.visitHead}>
            Service Jobs
          </div>
          
          <div className={styles.checkboxesContainer}>
            {serviceReportList.job_services.map((service) => (
              <label key={service.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="serviceCheckbox"
                  value={service.id}
                  checked={true} // Always checked
                  disabled={true} // Disable checkbox to prevent unchecking
                  onChange={() => handleServiceChange(service.id)}
                />
                {service.service?.service_title || `Service ${service.id}`}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceJobs;