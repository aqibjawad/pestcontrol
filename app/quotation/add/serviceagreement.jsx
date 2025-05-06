import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";
import ContractSummary from "./contract";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import Scope from "./scope";
// import Invoice from "./invoice";

const ServiceAgreement = ({ setFormData, formData }) => {
  const api = new APICall();
  const [allServices, setAllServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);

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

  // Calculate grand total whenever services change
  useEffect(() => {
    const total = (formData.services || []).reduce(
      (total, job) => total + (job.subTotal || 0),
      0
    );
    setGrandTotal(total);
  }, [formData.services]);

  useEffect(() => {
    if (
      formData.quote_services &&
      Array.isArray(formData.quote_services) &&
      allServices.length > 0 &&
      formData.duration_in_months
    ) {
      const transformedServices = formData.quote_services.map(
        (quoteService) => {
          const monthlyJobs =
            quoteService.no_of_services / formData.duration_in_months;

          return {
            service_id: quoteService.service_id,
            service_name: quoteService.service.pest_name,
            jobType: quoteService.job_type,
            rate: parseFloat(quoteService.rate),
            no_of_jobs: monthlyJobs,
            subTotal: parseFloat(quoteService.sub_total),
            detail: [
              {
                job_type: quoteService.job_type,
                rate: parseFloat(quoteService.rate),
                dates: quoteService.quote_service_dates || [],
                no_of_jobs: monthlyJobs,
              },
            ],
          };
        }
      );

      setFormData((prev) => ({
        ...prev,
        services: transformedServices,
      }));
    }
  }, [
    formData.quote_services,
    allServices.length,
    formData.duration_in_months,
  ]);

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
      alert("Please select at least one service before adding");
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
        subTotal: updatedJob.no_of_jobs * updatedJob.rate,
        detail: [
          {
            job_type: updatedJob.jobType,
            rate: updatedJob.rate,
            dates: updatedJob.dates || [],
            no_of_jobs: updatedJob.no_of_jobs,
          },
        ],
      };
      return { ...prev, services: newServices };
    });
  };

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
              numberOfJobs={job.no_of_jobs}
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
          <ContractSummary
            formData={formData}
            setFormData={setFormData}
            grandTotal={grandTotal}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          {/* <Invoice formData={formData} setFormData={setFormData} /> */}
        </Grid>
      </Grid>

      <Scope
        selectedServices={selectedServices}
        setFormData={setFormData}
        formData={formData}
      />
    </div>
  );
};

export default ServiceAgreement;
