// JobsList.jsx
import React, { useState, useEffect } from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown2 from "@/components/generic/Dropdown2";
import CalendarComponent from "./calender.component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

const JobsList = ({ jobData, allServices, updateJobList, duration_in_months }) => {
  const [rate, setRate] = useState(jobData.rate);
  const [open, setOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType);
  const [selectedDates, setSelectedDates] = useState(jobData.dates);
  const [subTotal, setSubTotal] = useState(jobData.subTotal);
  const [intervalDays, setIntervalDays] = useState(5);

  const [no_of_months, setNoOfMonths] = useState();

  const jobTypes = [
    { label: "One Time", value: "one_time" },
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Custom", value: "custom" },
  ];

  useEffect(() => {
    const total = selectedDates?.length * parseFloat(rate || 0);
    setSubTotal(total);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      dates: selectedDates,
      subTotal: total,
    });
  }, [selectedDates, rate, selectedJobType]);

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => 
      date instanceof Date ? date.toISOString().slice(0, 10) : date
    );
    setSelectedDates(formattedDates);
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (["one_time", "yearly", "monthly", "weekly", "custom"].includes(value)) {
      setOpen(true);
    }
    if (value === "daily") {
      setSelectedDates([new Date().toISOString().slice(0, 10)]);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={4}>
          <Dropdown2
            title="Selected Products"
            options={allServices.filter(service => service.isChecked).map((service) => ({
              label: service.pest_name,
              value: service.id,
            }))}
            value={jobData.service_id}
            onChange={(value) => {
              const selectedService = allServices.find((service) => service.id === value);
              updateJobList({
                service_id: value,
                serviceName: selectedService.pest_name,
              });
            }}
          />
        </Grid>
        <Grid item lg={3} xs={4}>
          <InputWithTitle
            title="No of Jobs"
            type="text"
            name="noOfMonth"
            placeholder="No of Jobs"
            value={no_of_months}
            onChange={setNoOfMonths}
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
        <Grid item xs={2}>
          <InputWithTitle
            title="Rate"
            type="text"
            name="rate"
            placeholder="Rate"
            value={rate}
            onChange={setRate}
          />
        </Grid>
        <Grid item xs={3}>
          <InputWithTitle
            title="Sub Total"
            type="text"
            name="subTotal"
            placeholder="Sub Total"
            value={subTotal}
            readOnly
          />
        </Grid>
      </Grid>

      <div style={{ marginTop: "1rem" }}>
        {/* <div style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}>
          {selectedDates?.length > 0 ? (
            <>
              Selected Dates: {selectedDates.join(", ")}
              <Button
                variant="outlined"
                size="small"
                style={{ marginLeft: "10px" }}
                onClick={() => setOpen(true)}
              >
                Edit
              </Button>
            </>
          ) : (
            "No dates selected"
          )}
        </div> */}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Dates</DialogTitle>
        <DialogContent>
          <CalendarComponent
            initialDates={selectedDates?.map((date) => new Date(date))}
            onDateChange={handleDateChange}
          />
          {selectedJobType === "custom" && (
            <InputWithTitle
              title="Custom Input"
              type="text"
              name="customInput"
              placeholder="Enter custom details"
              value={intervalDays}
              onChange={setIntervalDays}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save Dates</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobsList;