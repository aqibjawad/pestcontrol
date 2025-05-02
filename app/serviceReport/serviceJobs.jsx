"use client";

import React, { useEffect } from "react";
import styles from "../../styles/serviceReport.module.css";

const ServiceJobs = ({ formData, setFormData, serviceReportList }) => {
  
  useEffect(() => {
    // Handle the services logic when component mounts or serviceReportList changes
    if (serviceReportList?.job_services) {
      // If there's only one service, automatically select it
      if (serviceReportList.job_services.length === 1) {
        const singleServiceId = serviceReportList.job_services[0].id;
        setFormData(prevData => ({
          ...prevData,
          complete_job_service_id: [singleServiceId]
        }));
        console.log("Auto-selected single service:", singleServiceId);
      } 
      // If there are multiple services, initialize the array but don't auto-select
      else if (serviceReportList.job_services.length > 1) {
        setFormData(prevData => ({
          ...prevData,
          complete_job_service_id: prevData.complete_job_service_id || []
        }));
      }
    }
  }, [serviceReportList, setFormData]);

  const handleServiceChange = (serviceId) => {
    // If there's only one service, don't allow deselection
    if (serviceReportList?.job_services?.length === 1) {
      return; // Don't allow toggling the single service option
    }
    
    setFormData((prevData) => {
      // Ensure we're working with an array
      const currentSelections = Array.isArray(prevData.complete_job_service_id) 
        ? [...prevData.complete_job_service_id] 
        : [];
      
      // If already selected, remove it; otherwise add it
      if (currentSelections.includes(serviceId)) {
        const newSelections = currentSelections.filter(id => id !== serviceId);
        console.log("Removed service:", serviceId, "New selections:", newSelections);
        return {
          ...prevData,
          complete_job_service_id: newSelections
        };
      } else {
        const newSelections = [...currentSelections, serviceId];
        console.log("Added service:", serviceId, "New selections:", newSelections);
        return {
          ...prevData,
          complete_job_service_id: newSelections
        };
      }
    });
  };

  // Check if we have any services to display
  const hasServices = serviceReportList?.job_services && serviceReportList.job_services.length > 0;
  // Determine if we have a single service (for disabling the checkbox)
  const hasSingleService = serviceReportList?.job_services?.length === 1;

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
                  checked={Array.isArray(formData.complete_job_service_id) && 
                          formData.complete_job_service_id.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                  disabled={hasSingleService} // Disable checkbox if it's the only service
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