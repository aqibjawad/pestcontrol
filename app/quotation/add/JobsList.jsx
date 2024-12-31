import React, { useState, useEffect } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import { Grid } from "@mui/material";
import Dropdown2 from "@/components/generic/DropDown2";

const JobsList = ({
  jobData,
  allServices,
  updateJobList,
  duration_in_months,
  numberOfJobs,
  formData,
}) => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [rate, setRate] = useState(jobData.rate || 0);
  const [noJobs, setNoJobs] = useState(numberOfJobs || 0);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType || "");
  const [selectedDates, setSelectedDates] = useState([]);
  const [subTotal, setSubTotal] = useState(jobData.subTotal || 0);

  const jobTypes = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "installments" },
  ];

  useEffect(() => {
    // Calculate total jobs for the entire duration
    const calculatedTotalJobs = noJobs * duration_in_months;
    setTotalJobs(calculatedTotalJobs);
  }, [noJobs, duration_in_months]);

  useEffect(() => {
    // Calculate subtotal and update parent
    const calculatedSubTotal = noJobs * rate;
    setSubTotal(calculatedSubTotal);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      service_id: jobData.service_id,
      service_name: jobData.service_name,
      no_of_jobs: totalJobs,
      dates: selectedDates,
    });
  }, [selectedDates, rate, selectedJobType, totalJobs, noJobs]);

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (value === "monthly" || value === "daily") {
      setSelectedDates([]);
    }
    if (value === "daily") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDates([today.toISOString().slice(0, 10)]);
    }
  };

  const handleServiceChange = (value) => {
    setSelectedService(value);
    const service = allServices.find((s) => s.id === value);
    if (service) {
      updateJobList({
        ...jobData,
        service_id: value,
        service_name: service.pest_name,
      });
    }
  };

  const [selectedService, setSelectedService] = useState(
    jobData.service_id || ""
  );

  const getUniqueServiceOptions = (services) => {
    const uniqueServices = new Map();

    services.forEach((service) => {
      if (!uniqueServices.has(service.pest_name)) {
        uniqueServices.set(service.pest_name, {
          label: service.pest_name,
          value: service.id,
        });
      }
    });

    return Array.from(uniqueServices.values());
  };

  const serviceOptions = getUniqueServiceOptions(allServices);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={4}>
          <Dropdown2
            title="Selected Products"
            options={serviceOptions}
            value={selectedService}
            onChange={handleServiceChange}
            fullWidth
          />
        </Grid>

        <Grid item lg={3} xs={4}>
          <Dropdown2
            title="Job Type"
            options={jobTypes}
            value={selectedJobType}
            onChange={handleJobTypeChange}
          />
        </Grid>

        <Grid item lg={3} xs={4}>
          <InputWithTitle
            title={`No of Jobs (Monthly)`}
            type="text"
            name="noJobs"
            placeholder="No of Jobs"
            value={noJobs}
            onChange={(value) => setNoJobs(value)}
          />
        </Grid>

        <Grid item xs={2}>
          <InputWithTitle
            title="Rate"
            type="text"
            name="rate"
            placeholder="Rate"
            value={rate}
            onChange={(value) => setRate(value)}
          />
        </Grid>

        <Grid item xs={3}>
          <InputWithTitle
            title="Sub Total"
            type="text"
            name="subTotal"
            placeholder="Sub Total"
            value={noJobs * rate}
            readOnly
          />
        </Grid>
{/* 
        <Grid item lg={2} xs={4}>
          <InputWithTitle
            title="Total Jobs for Contract"
            type="text"
            name="totalJobs"
            placeholder="Total Jobs"
            value={totalJobs}
            readOnly
          />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default JobsList;
