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
  const [noJobs, setNoJobs] = useState(jobData.no || 0);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType || "");
  const [selectedDates, setSelectedDates] = useState(numberOfJobs || []);
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

  useEffect(() => {
    let calculatedTotalJobs = 0;
    if (selectedJobType === "custom") {
      calculatedTotalJobs = Math.floor(duration_in_months / 3); // Quarterly calculation
    } else if (selectedJobType === "monthly") {
      calculatedTotalJobs = noJobs * duration_in_months; // Monthly calculation
    } else {
      calculatedTotalJobs = noJobs * duration_in_months; // Default calculation
    }
    setTotalJobs(calculatedTotalJobs);
  }, [noJobs, duration_in_months, selectedJobType]);

  useEffect(() => {
    const calculatedSubTotal = noJobs * rate;
    setSubTotal(calculatedSubTotal);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      service_id: jobData.service_id,
      serviceName: jobData.serviceName,
      no_of_jobs: totalJobs, // Pass the number of jobs
    });
  }, [
    selectedDates,
    rate,
    selectedJobType,
    duration_in_months,
    noJobs,
    totalJobs,
  ]);

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (value === "daily") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDates([today.toISOString().slice(0, 10)]);
    }
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
        serviceName: service.service_title,
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
