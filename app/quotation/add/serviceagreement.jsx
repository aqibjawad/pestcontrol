import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import JobsList from "./JobsList";
import ContractSummary from "./contract";
import { Button } from "@mui/material";
import Scope from "./scope";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  services: Yup.array().of(
    Yup.object().shape({
      service_id: Yup.string().required("Service is required"),
      service_name: Yup.string().required("Service name is required"),
      detail: Yup.array().of(
        Yup.object().shape({
          job_type: Yup.string().required("Job type is required"),
          rate: Yup.number().required("Rate is required").min(0),
          dates: Yup.array().of(Yup.string().required("Date is required")),
        })
      ),
      subTotal: Yup.number().required("Subtotal is required").min(0),
    })
  ),
});

const ServiceAgreement = ({ setFormData, formData }) => {
  
  const api = new APICall();
  const [allServices, setAllServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(
    new Map()
  );

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

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return dateString;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateGrandTotal = (services) => {
    return (services || []).reduce(
      (total, job) => total + (job.subTotal || 0),
      0
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={{
        services: formData.services || [],
        quote_services: formData.quote_services || [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormData((prev) => ({
          ...prev,
          services: values.services,
        }));
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => {
        const handleCheckboxChange = (serviceId) => {
          setAllServices((prevServices) =>
            prevServices.map((service) => {
              if (service.id === serviceId) {
                const newCheckedState = !service.isChecked;

                setSelectedServiceDetails((prev) => {
                  const updatedMap = new Map(prev);
                  if (newCheckedState) {
                    updatedMap.set(service.id, {
                      service_title: service.service_title,
                      term_and_conditions: service.term_and_conditions,
                      pest_name: service.pest_name,
                    });
                  } else {
                    updatedMap.delete(service.id);
                  }
                  return updatedMap;
                });

                return { ...service, isChecked: newCheckedState };
              }
              return service;
            })
          );
        };

        const addJobList = () => {
          const selectedServices = allServices.filter(
            (service) => service.isChecked
          );

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
                dates: [convertDate(new Date())],
              },
            ],
            subTotal: 100,
          };

          setFieldValue("services", [...values.services, newJob]);

          setAllServices((prevServices) =>
            prevServices.map((service) =>
              service.isChecked ? service : { ...service, isChecked: false }
            )
          );
        };

        const removeJobList = (index) => {
          const newServices = values.services.filter((_, i) => i !== index);
          setFieldValue("services", newServices);
        };

        const updateJobList = (index, updatedJob) => {
          const newServices = [...values.services];
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
          setFieldValue("services", newServices);
        };

        // Update services when quote_services changes
        useEffect(() => {
          if (values.quote_services?.length) {
            setFieldValue("services", [
              ...values.quote_services,
              ...values.services,
            ]);
          }
        }, [values.quote_services]);

        const grandTotal = calculateGrandTotal(values.services);

        return (
          <Form>
            <div
              className="mt-10"
              style={{ border: "1px solid #D0D5DD", padding: "20px" }}
            >
              <div
                className="mt-5"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
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
                    <label style={{ marginLeft: "0.5rem" }}>
                      {service.pest_name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-10 mb-10">
                {values.services.map((job, index) => (
                  <div
                    key={`${job.service_id}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <JobsList
                      jobData={job}
                      allServices={allServices}
                      updateJobList={(updatedJob) =>
                        updateJobList(index, updatedJob)
                      }
                      duration_in_months={formData.duration_in_months}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeJobList(index)}
                      style={{ marginLeft: "10px" }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex">
                <div className="flex-grow"></div>
                <div className="">
                  <Button variant="outlined" onClick={addJobList}>
                    Add
                  </Button>
                </div>
              </div>

              <ContractSummary
                setFormData={setFormData}
                grandTotal={grandTotal}
              />

              <Scope
                selectedServices={Array.from(selectedServiceDetails.values())}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ServiceAgreement;
