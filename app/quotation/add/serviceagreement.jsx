// ServiceAgreement.jsx
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
  const [jobLists, setJobLists] = useState([]);

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

  useEffect(() => {
    const selectedServices = allServices.filter((service) => service.isChecked);
    setJobLists(
      selectedServices.map((service) => ({
        serviceId: service.id,
        serviceName: service.pest_name,
        jobType: "",
        rate: "100",
        dates: [],
        subTotal: 0,
      }))
    );
  }, [allServices]);

  const updateJobList = (index, updatedJob) => {
    setJobLists((prevJobLists) => {
      const newJobLists = [...prevJobLists];
      newJobLists[index] = { ...newJobLists[index], ...updatedJob };
      setFormData(prev => ({ ...prev, services: newJobLists}));
      return newJobLists;
    });
  };

  const grandTotal = jobLists.reduce((total, job) => total + job.subTotal, 0);

  const handleSubmit = () => {
    const formattedServices = jobLists.map((job) => ({
      service_id: job.serviceId,
      pest_name: job.serviceName,
      isChecked: true,
      detail: [
        {
          job_type: job.jobType,
          rate: job.rate,
          dates: job.dates,
        },
      ],
    }));

    setFormData((prev) => ({ ...prev, services: formattedServices }));
  };

  const addJobList =()=>{
   
   setFormData(prev => ({ ...prev, services:  [...prev.services, {}] })
   )
  }

  console.log('formData.services', formData.services)

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
        {formData.services.map((job, index) => (
          <JobsList
            key={job.serviceId}
            jobData={job}
            allServices={allServices}
            updateJobList={(updatedJob) => updateJobList(index, updatedJob)}
            duration_in_months={formData.duration_in_months}
          />
        ))}
      </div>
      <Button onClick={addJobList}>
        Add
      </Button>
      <ContractSummary grandTotal={grandTotal} />
    </div>
  );
};

export default ServiceAgreement;
