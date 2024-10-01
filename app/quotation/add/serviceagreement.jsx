import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";
import ContractSummary from "./contract";
import { Button } from "@mui/material";

const ServiceAgreement = ({ setFormData, formData }) => {
  const api = new APICall();
  const [allServices, setAllServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.getDataWithToken(services);
      const servicesWithChecked = response.data.map((service) => ({
        ...service,
        isChecked: false,
      }));
      setAllServices(servicesWithChecked);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  const handleCheckboxChange = (serviceId) => {
    setAllServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId
          ? { ...service, isChecked: !service.isChecked }
          : service
      )
    );
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return dateString;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Change format to YYYY-MM-DD
  };

  useEffect(() => {
    const selectedServices = allServices.filter((service) => service.isChecked);
    const newServices = selectedServices.map((service) => ({
      service_id: service.id,
      service_name: service.pest_name,
      detail: [
        {
          job_type: "", // Changed from "ontime" to "one_time"
          rate: "",
          dates: [convertDate(new Date())], // Changed date format
        },
      ],
      subTotal: 100, // Initialize subTotal
    }));
    setFormData((prev) => ({ ...prev, services: newServices }));
  }, [allServices]);

  const updateJobList = (index, updatedJob) => {
    setFormData((prev) => {
      const newServices = [...prev.services];
      newServices[index] = {
        ...newServices[index],
        ...updatedJob,
        detail: [
          {
            job_type: updatedJob.jobType,
            rate: updatedJob.rate,
            dates: updatedJob.dates,
          },
        ],
      };
      return { ...prev, services: newServices };
    });
  };

  const addJobList = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          service_id: null,
          service_name: "",
          detail: [
            {
              job_type: "",
              rate: "",
              dates: [convertDate(new Date())],
            },
          ],
          subTotal: 100,
        },
      ],
    }));
  };

  const removeJobList = (index) => {
    setFormData((prev) => {
      const newServices = prev.services.filter((_, i) => i !== index);
      return { ...prev, services: newServices };
    });
  };

  useEffect(() => {
    if (!formData.services) {
      setFormData((prev) => ({ ...prev, services: [] }));
    }
  }, [formData, setFormData]);

  const grandTotal = (formData.services || []).reduce(
    (total, job) => total + job.subTotal,
    0
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="mt-10"
      style={{ border: "1px solid #D0D5DD", padding: "20px" }}
    >
      <div className="mt-5" style={{ fontSize: "20px", fontWeight: "600" }}>
        Service Agreement
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {allServices.map((service) => (
          <div
            key={service.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={service.isChecked}
              onChange={() => handleCheckboxChange(service.id)}
            />
            <label style={{ marginLeft: "0.5rem" }}>{service.pest_name}</label>
          </div>
        ))}
      </div>
      <div className="mt-10 mb-10">
        {(formData.services || []).map((job, index) => (
          <JobsList
            key={job.service_id || index}
            jobData={job}
            allServices={allServices}
            updateJobList={(updatedJob) => updateJobList(index, updatedJob)}
            onRemove={() => removeJobList(index)}
            duration_in_months={formData.duration_in_months}
          />
        ))}
      </div>
      <Button variant="outlined" onClick={addJobList}>
        Add
      </Button>
      <ContractSummary grandTotal={grandTotal} />
    </div>
  );
};

export default ServiceAgreement;
