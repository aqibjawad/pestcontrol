import React, { useState, useEffect } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import { Grid } from "@mui/material";
import Dropdown2 from "@/components/generic/DropDown2";

const JobsList = ({
  jobData,
  allServices,
  updateJobList,
  duration_in_months,
  formData,
}) => {
  // Find matching quote service from formData
  const findQuoteService = () => {
    if (formData?.quote_services && formData.quote_services.length > 0) {
      return (
        formData.quote_services.find(
          (service) => service.service_id === jobData.service_id
        ) || formData.quote_services[0]
      );
    }
    return null;
  };

  const quoteService = findQuoteService();

  const [jobsPerMonth, setJobsPerMonth] = useState();
  const [totalJobs, setTotalJobs] = useState(jobData.totalJobs || 0);
  const [rate, setRate] = useState(jobData.rate || 0);
  const [noJobs, setNoJobs] = useState(jobData.no_of_jobs || 0);
  const [selectedJobType, setSelectedJobType] = useState(
    jobData.jobType || "monthly"
  );
  const [selectedDates, setSelectedDates] = useState(jobData.dates || []);
  const [subTotal, setSubTotal] = useState(jobData.subTotal || 0);
  const [selectedService, setSelectedService] = useState(
    jobData.service_id || ""
  );
  const [hasInitialized, setHasInitialized] = useState(false);

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

  // Update parent component with all necessary data
  useEffect(() => {
    const calculatedSubTotal = totalJobs * parseFloat(rate);
    setSubTotal(calculatedSubTotal);

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

    // Reset jobs when changing type
    if (value === "custom") {
      if (formData?.quote_services?.length > 0) {
        const customService = formData.quote_services.find(
          (service) => service.job_type === "custom"
        );
        if (customService) {
          setNoJobs(customService.no_of_services);
          setRate(customService.rate);
        } else {
          const calculatedTotalJobs = Math.floor(duration_in_months / 3);
          setNoJobs(calculatedTotalJobs);
        }
      } else {
        const calculatedTotalJobs = Math.floor(duration_in_months / 3);
        setNoJobs(calculatedTotalJobs);
      }
    }
  };

  useEffect(() => {
    if (selectedJobType === "monthly") {
      const calculatedTotalJobs = jobsPerMonth * duration_in_months;
      setNoJobs(Math.floor(calculatedTotalJobs)); // Rounds down
    } else if (selectedJobType === "custom") {
      const calculatedTotalJobs = duration_in_months / 3;
      setNoJobs(Math.floor(calculatedTotalJobs)); // Rounds down
    }
  }, [selectedJobType, jobsPerMonth, duration_in_months]);

  // Initialize from formData
  useEffect(() => {
    if (!hasInitialized && formData?.quote_services?.length > 0) {
      const matchingQuoteService = findQuoteService();
      if (matchingQuoteService) {
        if (matchingQuoteService.job_type === "monthly") {
          const calculatedTotalJobs = matchingQuoteService.no_of_services;
          setNoJobs(calculatedTotalJobs);
          setRate(matchingQuoteService.rate);
          setJobsPerMonth(
            matchingQuoteService.no_of_services / duration_in_months
          );
        } else if (matchingQuoteService.job_type === "custom") {
          setNoJobs(matchingQuoteService.no_of_services);
          setRate(matchingQuoteService.rate);
        }
        setHasInitialized(true);
      }
    }
  }, [formData, hasInitialized, duration_in_months]);

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

  const handleJobsPerMonthChange = (value) => {
    const newJobsPerMonth = parseInt(value) || 0;
    setJobsPerMonth(newJobsPerMonth);

    // Calculate and update total jobs based on duration_in_months
    const calculatedTotalJobs = newJobsPerMonth * duration_in_months;
    setNoJobs(calculatedTotalJobs);
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
                title="Jobs Per Month"
                type="text"
                placeholder="Jobs Per Month"
                value={jobsPerMonth}
                onChange={handleJobsPerMonthChange}
              />
            </Grid>
            <Grid item lg={3} xs={4}>
              <InputWithTitle
                title="Total Jobs"
                type="text"
                name="noJobs"
                placeholder="Total Jobs"
                value={noJobs}
                onChange={(value) => setNoJobs(value)}
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
              value={noJobs}
              onChange={(value) => setNoJobs(value)}
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
