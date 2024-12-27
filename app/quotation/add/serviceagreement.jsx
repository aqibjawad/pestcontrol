import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";
import ContractSummary from "./contract";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";

import Scope from "./scope";

import Invoice from "./invoice";

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

      if (formData.quote_services && Array.isArray(formData.quote_services)) {
        const updatedServices = servicesWithChecked.map((service) => ({
          ...service,
          isChecked: formData.quote_services.some(
            (quoteService) => quoteService.service_id === service.id
          ),
        }));
        setAllServices(updatedServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueServiceDates = (quoteServiceDates) => {
    if (!quoteServiceDates || !Array.isArray(quoteServiceDates)) {
      return [];
    }

    const uniqueDays = new Set();
    const uniqueDates = [];

    quoteServiceDates.forEach((dateObj) => {
      if (!dateObj?.service_date) return;

      const date = new Date(dateObj.service_date);

      if (isNaN(date.getTime())) return;

      const day = date.getDate();

      if (!uniqueDays.has(day)) {
        uniqueDays.add(day);

        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        uniqueDates.push(formattedDate);
      }
    });

    return uniqueDates;
  };

  useEffect(() => {
    if (
      formData.quote_services &&
      Array.isArray(formData.quote_services) &&
      allServices.length > 0
    ) {
      // Update checkbox states
      const updatedServices = allServices.map((service) => ({
        ...service,
        isChecked: formData.quote_services.some(
          (quoteService) => quoteService.service_id === service.id
        ),
      }));
      setAllServices(updatedServices);

      // Transform quote_services to JobsList format
      const transformedServices = formData.quote_services.map(
        (quoteService) => ({
          service_id: quoteService.service_id,
          service_name: quoteService.service.pest_name,
          jobType: quoteService.job_type,
          rate: parseFloat(quoteService.rate),
          no_of_jobs: quoteService.no_of_jobs,
          subTotal: parseFloat(quoteService.sub_total),
          detail: [
            {
              job_type: quoteService.job_type,
              rate: parseFloat(quoteService.rate),
              no_of_jobs: quoteService.no_of_jobs,
            },
          ],
        })
      );

      setFormData((prev) => ({
        ...prev,
        services: transformedServices,
      }));
    }
  }, [formData.quote_services, allServices.length]);

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

  const addJobList = () => {
    const selectedServices = allServices.filter((service) => service.isChecked);

    if (selectedServices.length === 0) {
      alert("Please select at least one service before adding"); // Simple JavaScript alert
      return;
    }

    const newJob = {
      service_id: selectedServices[0].id,
      service_name: selectedServices[0].pest_name,
      jobType: "",
      rate: "",
      dates: [],
      no_of_jobs: 0,
      subTotal: 0,
      detail: [
        {
          job_type: "",
          rate: "",
          dates: [],
          no_of_jobs: 0,
        },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      services: [...(prev.services || []), newJob],
    }));
  };

  const removeJobList = (index) => {
    setFormData((prev) => {
      const newServices = prev.services.filter((_, i) => i !== index);
      return { ...prev, services: newServices };
    });

    // Update checkbox states when removing a job
    const removedService = formData.services[index];
    if (removedService) {
      setAllServices((prevServices) =>
        prevServices.map((service) => ({
          ...service,
          isChecked:
            service.id === removedService.service_id
              ? false
              : service.isChecked,
        }))
      );
    }
  };

  const updateJobList = (index, updatedJob) => {
    setFormData((prev) => {
      const newServices = [...prev.services];
      newServices[index] = {
        ...newServices[index],
        ...updatedJob,
        subTotal: updatedJob.no_of_jobs * updatedJob.rate, // Ensure subtotal is calculated correctly
        detail: [
          {
            job_type: updatedJob.jobType,
            rate: updatedJob.rate,
            dates: updatedJob.dates,
            no_of_jobs: updatedJob.no_of_jobs,
          },
        ],
      };
      return { ...prev, services: newServices };
    });
  };

  const grandTotal = (formData.services || []).reduce(
    (total, job) => total + (job.subTotal || 0),
    0
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const selectedServices = allServices.filter((service) => service.isChecked);

  return (
    <div className="mt-10 p-5 border border-[#D0D5DD]">
      <div className="text-xl font-semibold mt-5">Service Agreement</div>

      <div className="flex flex-wrap gap-4 mt-4">
        {allServices.map((service) => (
          <div key={service.id} className="flex items-center">
            <input
              type="checkbox"
              checked={service.isChecked}
              onChange={() => handleCheckboxChange(service.id)}
              className="mr-2"
            />
            <label>{service.pest_name}</label>
          </div>
        ))}
      </div>

      <div className="mt-10 mb-10 space-y-4">
        {(formData.services || []).map((job, index) => (
          <div
            key={`${job.service_id}-${index}`}
            className="flex items-center justify-between"
          >
            <JobsList
              jobData={job}
              numberOfJobs={
                getUniqueServiceDates(
                  formData?.quote_services?.[index]?.quote_service_dates
                ).length
              }
              allServices={allServices}
              updateJobList={(updatedJob) => updateJobList(index, updatedJob)}
              duration_in_months={formData.duration_in_months}
              formData={formData}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => removeJobList(index)}
              className="ml-4"
            >
              Remove Service
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outlined" onClick={addJobList}>
          Add Service
        </Button>
      </div>

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <ContractSummary setFormData={setFormData} grandTotal={grandTotal} />
        </Grid>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <Invoice formData={formData} setFormData={setFormData} />
        </Grid>
      </Grid>

      <Scope selectedServices={selectedServices} />
    </div>
  );
};

export default ServiceAgreement;
