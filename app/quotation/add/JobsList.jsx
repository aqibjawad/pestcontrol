import React, { useState, useEffect } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import CalendarComponent from "./calender.component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, Tabs, Tab, Box, Button } from "@mui/material";
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
  const [noJobs, setNoJobs] = useState(jobData.no);
  const [open, setOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType || "");
  const [selectedDates, setSelectedDates] = useState(numberOfJobs || []);
  const [subTotal, setSubTotal] = useState(jobData.subTotal || 0);
  const [intervalDays, setIntervalDays] = useState(5);
  const [allGeneratedDates, setAllGeneratedDates] = useState([]);
  const [generatedSubTotal, setGeneratedSubTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [dayWiseSelection, setDayWiseSelection] = useState([]);
  const [allDatesSelect, setAllDatesSelect] = useState([]);

  const jobTypes = [
    { label: "One Time", value: "one_time" },
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
  ];

  useEffect(() => {
    const calculatedTotalJobs = noJobs * duration_in_months;
    setTotalJobs(calculatedTotalJobs);
  }, [noJobs, duration_in_months]);

  useEffect(() => {
    // Calculate subtotals
    const calculatedSubTotal = noJobs * rate;
    setSubTotal(calculatedSubTotal);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      service_id: jobData.service_id,
      serviceName: jobData.serviceName,
      no_of_jobs: totalJobs, // Make sure to pass the number of jobs
    });
  }, [selectedDates, rate, selectedJobType, duration_in_months, noJobs]); // Added noJobs to dependencies

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (value === "monthly" || value === "daily") {
      setSelectedDates([]);
      setAllGeneratedDates([]);
    }
    if (value === "daily") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDates([today.toISOString().slice(0, 10)]);
    }
    if (
      ["one_time", "yearly", "monthly", "weekly", "custom", "daily"].includes(
        value
      )
    ) {
      setOpen(true);
    }
  };

  const handleServiceChange = (value) => {
    setSelectedService(value);
    const service = allServices.find((s) => s.id === value);
    if (service) {
      // Update local state and parent component
      updateJobList({
        ...jobData,
        service_id: value,
        serviceName: service.service_title,
      });
    }
  };

  const [selectedService, setSelectedService] = useState(
    jobData.service_id || ""
  );

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
            title={`No of Jobs`}
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
            title="Sub Total for selected Jobs"
            type="text"
            name="subTotal"
            placeholder="Sub Total"
            value={noJobs * rate}
            readOnly
          />
        </Grid>

        <Grid item lg={2} xs={4}>
          <InputWithTitle
            title="Total Jobs"
            type="text"
            name="totalJobs"
            placeholder="Total Jobs"
            value={totalJobs}
            readOnly
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default JobsList;
