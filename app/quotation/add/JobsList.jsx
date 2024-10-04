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

const JobsList = ({
  jobData,
  allServices,
  updateJobList,
  duration_in_months,
}) => {
  const [rate, setRate] = useState(jobData.rate || 0);
  const [open, setOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType || "");
  const [selectedDates, setSelectedDates] = useState(jobData.dates || []);
  const [subTotal, setSubTotal] = useState(jobData.subTotal || 0);
  const [intervalDays, setIntervalDays] = useState(5);
  const [noOfJobs, setNoOfJobs] = useState(0);
  const [allGeneratedDates, setAllGeneratedDates] = useState([]);

  const [generatedSubTotal, setGeneratedSubTotal] = useState(0);


  const jobTypes = [
    { label: "One Time", value: "one_time" },
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Custom", value: "custom" },
  ];

  const generateMonthlyDates = (initialDates) => {
    if (!initialDates || initialDates.length === 0) return [];

    const allDates = [...initialDates];

    for (let i = 1; i < duration_in_months; i++) {
      initialDates.forEach((dateStr) => {
        const date = new Date(dateStr);
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + i);

        const lastDayOfMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        if (date.getDate() > lastDayOfMonth) {
          newDate.setDate(lastDayOfMonth);
        }

        const generatedDate = newDate.toISOString().slice(0, 10);
        allDates.push(generatedDate);
      });
    }

    return allDates.sort();
  };

  useEffect(() => {
    let allDates = selectedDates ? [...selectedDates] : [];
    let selectedSubTotal = allDates.length * parseFloat(rate || 0);

    let generatedSubTotal = 0;
    if (selectedJobType === "monthly" && allDates.length > 0) {
      const generatedDates = generateMonthlyDates(allDates);
      setAllGeneratedDates(generatedDates);
      generatedSubTotal = generatedDates.length * parseFloat(rate || 0);
    } else {
      setAllGeneratedDates(allDates);
    }

    setSubTotal(selectedSubTotal);
    setGeneratedSubTotal(generatedSubTotal);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      dates: selectedJobType === "monthly" ? allGeneratedDates : allDates,
      displayDates: selectedDates,
      subTotal:
        selectedJobType === "monthly" ? generatedSubTotal : selectedSubTotal,
      service_id: jobData.service_id,
      serviceName: jobData.serviceName,
    });
  }, [selectedDates, rate, selectedJobType, duration_in_months]);

  const handleDateChange = (dates) => {
    const formattedDates = dates
      ? dates.map((date) =>
          date instanceof Date ? date.toISOString().slice(0, 10) : date
        )
      : [];

    if (selectedJobType === "daily") {
      // Filter out any dates before today for daily job type
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredDates = formattedDates.filter((dateStr) => {
        const date = new Date(dateStr);
        return date >= today;
      });
      setSelectedDates(filteredDates);
    } else {
      setSelectedDates(formattedDates);
    }
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (value === "monthly") {
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

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={4}>
          <Dropdown2
            title="Selected Products"
            options={allServices
              .map((service) => ({
                label: service.service_title,
                value: service.id,
              }))}
            value={jobData.service_id}
            onChange={(value) => {
              const selectedService = allServices.find(
                (service) => service.id === value
              );
              updateJobList({
                ...jobData,
                service_id: value,
                serviceName: selectedService.service_title,
              });
            }}
          />
        </Grid>

        <Grid item lg={3} xs={4}>
          <InputWithTitle
            title="No of Jobs"
            type="text"
            name="noOfJobs"
            placeholder="No of Jobs"
            value={selectedDates.length || 0} // Changed this to show only selected dates
            readOnly={true}
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
            onChange={(value) => setRate(value)}
          />
        </Grid>

        <Grid item xs={3}>
          <InputWithTitle
            title="Sub Total for selected Jobs"
            type="text"
            name="subTotal"
            placeholder="Sub Total"
            value={subTotal}
            readOnly
          />
        </Grid>

        {selectedJobType === "monthly" ? (
          <>
            <Grid item lg={3} xs={4}>
              <InputWithTitle
                title="Total No Of Jobs"
                type="text"
                name="generatedDatesCount"
                placeholder="Generated Jobs"
                value={allGeneratedDates.length || 0}
                readOnly={true}
              />
            </Grid>
          </>
        ) : (
          ""
        )}

        {selectedJobType === "monthly" ? (
          <>
            <Grid item xs={3}>
              <InputWithTitle
                title="Sub total"
                type="text"
                name="generatedSubtotal"
                placeholder="Generated Subtotal"
                value={generatedSubTotal}
                readOnly
              />
            </Grid>
          </>
        ) : (
          ""
        )}

      </Grid>

      <div style={{ marginTop: "1rem" }}>
        <div style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}>
          {selectedDates?.length > 0 ? (
            <>
              Selected Dates: {selectedDates.join(", ")}
              {selectedJobType === "monthly" && (
                <span style={{ marginLeft: "10px", color: "#9E9E9E" }}>
                  (Will repeat for {duration_in_months} months)
                </span>
              )}
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
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedJobType === "monthly"
            ? `Select Dates (Will repeat for ${duration_in_months} months)`
            : selectedJobType === "daily"
            ? "Select Dates (Only current and future dates allowed)"
            : "Select Dates"}
        </DialogTitle>
        <DialogContent>
          <CalendarComponent
            initialDates={selectedDates?.map((date) => new Date(date))}
            onDateChange={handleDateChange}
            minDate={selectedJobType === "daily" ? new Date() : undefined}
          />
          {selectedJobType === "custom" && (
            <InputWithTitle
              title="Interval Days"
              type="number"
              name="intervalDays"
              placeholder="Enter interval days"
              value={intervalDays}
              onChange={(value) => setIntervalDays(value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} color="primary">
            Save Dates
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobsList;
