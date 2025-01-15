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
}) => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [rate, setRate] = useState(jobData.rate || 0);
  const [noJobs, setNoJobs] = useState(jobData.no_of_jobs || 0);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType || "");
  const [selectedDates, setSelectedDates] = useState(jobData.dates || []);
  const [subTotal, setSubTotal] = useState(jobData.subTotal || 0);
  const [selectedService, setSelectedService] = useState(
    jobData.service_id || ""
  );

  const jobTypes = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "custom" },
  ];

  const getUniqueServiceOptions = (services) => {
    const uniqueServices = new Map();
    services.forEach((service) => {
      if (!uniqueServices.has(service.service_title)) {
        uniqueServices.set(service.service_title, {
          label: service.service_title,
          value: service.id,
        });
      }
    });
    return Array.from(uniqueServices.values());
  };

  const serviceOptions = getUniqueServiceOptions(allServices);

  // Calculate total jobs based on job type
  useEffect(() => {
    let calculatedTotalJobs = 0;
    if (selectedJobType === "custom") {
      calculatedTotalJobs = Math.floor(duration_in_months / 3); // Quarterly
    } else if (selectedJobType === "monthly") {
      calculatedTotalJobs = noJobs * duration_in_months; // Monthly
    }
    setTotalJobs(calculatedTotalJobs);
  }, [noJobs, duration_in_months, selectedJobType]);

  // Update parent component with all necessary data
  useEffect(() => {
    const calculatedSubTotal = totalJobs * rate;
    setSubTotal(calculatedSubTotal);

    // Get the selected service details
    const selectedServiceDetails = allServices.find(
      (s) => s.id === selectedService
    );

    updateJobList({
      service_id: selectedService,
      service_name: selectedServiceDetails?.pest_name || jobData.service_name,
      jobType: selectedJobType,
      rate: parseFloat(rate),
      no_of_jobs: parseInt(noJobs),
      totalJobs: totalJobs,
      subTotal: calculatedSubTotal,
      dates: selectedDates,
      detail: [
        {
          job_type: selectedJobType,
          rate: parseFloat(rate),
          dates: selectedDates,
          no_of_jobs: parseInt(noJobs),
        },
      ],
    });
  }, [
    selectedService,
    selectedJobType,
    rate,
    noJobs,
    totalJobs,
    selectedDates,
  ]);

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (value === "custom") {
      setNoJobs(1);
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

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item lg={6} xs={4}>
          <Dropdown2
            title="Selected Products"
            options={serviceOptions}
            value={selectedService}
            onChange={handleServiceChange}
            fullWidth
          />
        </Grid>

        <Grid item lg={6} xs={4}>
          <Dropdown2
            title="Job Type"
            options={jobTypes}
            value={selectedJobType}
            onChange={handleJobTypeChange}
          />
        </Grid>

        {selectedJobType === "monthly" && (
          <>
            <Grid item lg={3} xs={4}>
              <InputWithTitle
                title="No of Jobs"
                type="text"
                name="noJobs"
                placeholder="No of Jobs"
                value={noJobs}
                onChange={(value) => setNoJobs(value)}
              />
            </Grid>
            <Grid item lg={3} xs={4}>
              <InputWithTitle
                title="Total Jobs"
                type="text"
                name="totalJobs"
                placeholder="Total Jobs"
                value={totalJobs}
                readOnly
              />
            </Grid>
          </>
        )}

        {selectedJobType === "custom" && (
          <Grid item lg={6} xs={4}>
            <InputWithTitle
              title="Total Jobs"
              type="text"
              name="totalJobs"
              placeholder="Total Jobs"
              value={totalJobs}
              readOnly
            />
          </Grid>
        )}

        <Grid item lg={6} xs={2}>
          <InputWithTitle
            title="Rate"
            type="text"
            name="rate"
            placeholder="Rate"
            value={rate}
            onChange={(value) => setRate(value)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default JobsList;
