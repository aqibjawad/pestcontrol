import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";
import ContractSummary from "./contract";
import { Button } from "@mui/material";

const ServiceAgreement = ({ setFormData, formData, duration_in_months }) => {
  const api = new APICall();
  const [allServices, setAllServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.getDataWithToken(services);
      // Initialize services with isChecked false
      const servicesWithChecked = response.data.map((service) => ({
        ...service,
        isChecked: false,
      }));
      setAllServices(servicesWithChecked);

      // After setting initial services, update checkbox states based on quote_services
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

  // Watch for changes in formData.quote_services
  useEffect(() => {
    if (
      formData.quote_services &&
      Array.isArray(formData.quote_services) &&
      allServices.length > 0
    ) {
      // Update checkbox states whenever quote_services changes
      const updatedServices = allServices.map((service) => ({
        ...service,
        isChecked: formData.quote_services.some(
          (quoteService) => quoteService.service_id === service.id
        ),
      }));
      setAllServices(updatedServices);

      // Transform quote_services data
      const transformedServices = formData.quote_services.map(
        (quoteService) => ({
          service_id: quoteService.service_id,
          service_name: quoteService.service.pest_name,
          detail: [
            {
              job_type: quoteService.job_type,
              rate: quoteService.rate,
              dates: quoteService.quote_service_dates.map(
                (date) => date.service_date
              ),
            },
          ],
          subTotal: parseFloat(quoteService.sub_total),
          no_of_services: quoteService.no_of_services,
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
      console.error("No services selected.");
      return;
    }

    const newJob = {
      service_id: selectedServices[0].id,
      service_name: selectedServices[0].pest_name,
      detail: [
        {
          job_type: "",
          rate: "",
          dates: [],
          no_of_services: 0,
        },
      ],
      subTotal: 0,
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
        detail: [
          {
            job_type: updatedJob.jobType,
            rate: updatedJob.rate,
            dates: updatedJob.dates,
            no_of_services: updatedJob.no_of_services,
          },
        ],
      };
      return { ...prev, services: newServices };
    });
  };

  const grandTotal = (formData.services || []).reduce(
    (total, job) => total + job.subTotal,
    0
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Debug logging
  console.log("Current allServices state:", allServices);
  console.log("Current quote_services:", formData.quote_services);

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
              allServices={allServices}
              updateJobList={(updatedJob) => updateJobList(index, updatedJob)}
              duration_in_months={formData.duration_in_months}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => removeJobList(index)}
              className="ml-4"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outlined" onClick={addJobList}>
          Add
        </Button>
      </div>

      <ContractSummary setFormData={setFormData} grandTotal={grandTotal} />
    </div>
  );
};

export default ServiceAgreement;
