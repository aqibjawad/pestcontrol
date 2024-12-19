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
  console.log(JSON.stringify(jobData));

  const [rate, setRate] = useState(jobData.rate || 0);
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

  console.log(numberOfJobs);

  const jobTypes = [
    { label: "One Time", value: "one_time" },
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Custom", value: "custom" },
  ];

  // Function to calculate subtotal
  const calculateSubTotal = (numberOfJobs, currentRate) => {
    return numberOfJobs * parseFloat(currentRate || 0);
  };

  // Update rate handler
  const handleRateChange = (newRate) => {
    setRate(newRate);
    const newSubTotal = calculateSubTotal(selectedDates.length, newRate);
    setSubTotal(newSubTotal);

    // If it's monthly or daily, also update generated subtotal
    if (selectedJobType === "monthly" || selectedJobType === "daily") {
      const totalJobs = selectedDates.length * duration_in_months;
      const newGeneratedSubTotal = calculateSubTotal(totalJobs, newRate);
      setGeneratedSubTotal(newGeneratedSubTotal);
    }
  };

  const generateFutureDates = (
    initialDates,
    selectedJobType,
    durationInMonths
  ) => {
    if (!initialDates || initialDates.length === 0) return [];

    const today = new Date();
    const result = [];

    if (selectedJobType === "monthly") {
      // For each selected date, add corresponding dates for subsequent months
      initialDates.forEach((initialDate) => {
        const date = new Date(initialDate);

        for (let i = 0; i < durationInMonths; i++) {
          const newDate = new Date(date);
          newDate.setMonth(newDate.getMonth() + i);
          const targetMonth = newDate.getMonth();
          newDate.setDate(1); // Reset to first of month
          newDate.setMonth(targetMonth + 1); // Go to first of next month
          newDate.setDate(0); // Back up one day to last of target month

          const lastDayOfMonth = newDate.getDate();
          const originalDay = date.getDate();

          newDate.setMonth(targetMonth);
          newDate.setDate(Math.min(originalDay, lastDayOfMonth));

          // Only add dates in the future
          if (newDate >= today) {
            result.push(newDate.toISOString().slice(0, 10));
          }
        }
      });
    }

    return result.sort();
  };

  useEffect(() => {
    let allDates = selectedDates ? [...selectedDates] : [];
    let finalDates = allDates;

    if (selectedJobType === "monthly" && allDates.length > 0) {
      finalDates = generateFutureDates(allDates, "monthly", duration_in_months);
      setAllDatesSelect(finalDates.length);
    }

    // Calculate subtotals
    const newSubTotal = calculateSubTotal(selectedDates.length, rate);
    const newGeneratedSubTotal = calculateSubTotal(finalDates.length, rate);

    setAllGeneratedDates(finalDates);
    setSubTotal(newSubTotal);
    setGeneratedSubTotal(newGeneratedSubTotal);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      dates: finalDates,
      displayDates: selectedDates,
      subTotal: newGeneratedSubTotal,
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
      // For daily, only allow one date selection
      setSelectedDates(formattedDates.slice(-1));
    } else {
      setSelectedDates(formattedDates);
    }
  };

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderDayWiseSelection = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeks = ["1st Week", "2nd Week", "3rd Week", "4th Week"];

    return (
      <div className="day-wise-selection">
        <table>
          <thead>
            <tr>
              <th></th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={week}>
                <td>{week}</td>
                {days.map((day, dayIndex) => (
                  <td key={`${week}-${day}`}>
                    <Button
                      variant={
                        dayWiseSelection.some(
                          (item) =>
                            item.week === weekIndex && item.day === dayIndex
                        )
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        let newSelection = [];
                        if (selectedJobType === "daily") {
                          // For daily, only allow one selection
                          newSelection = [{ week: weekIndex, day: dayIndex }];
                        } else {
                          newSelection = [...dayWiseSelection];
                          const isSelected = newSelection.some(
                            (item) =>
                              item.week === weekIndex && item.day === dayIndex
                          );
                          if (isSelected) {
                            const index = newSelection.findIndex(
                              (item) =>
                                item.week === weekIndex && item.day === dayIndex
                            );
                            if (index !== -1) newSelection.splice(index, 1);
                          } else {
                            newSelection.push({
                              week: weekIndex,
                              day: dayIndex,
                            });
                          }
                        }
                        setDayWiseSelection(newSelection);

                        const generatedDates =
                          generateDatesFromDayWiseSelection(newSelection);
                        setSelectedDates(generatedDates);
                      }}
                    >
                      {day}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const generateDatesFromDayWiseSelection = (dayWiseSelection) => {
    const result = [];
    const today = new Date();

    for (let monthOffset = 0; monthOffset < duration_in_months; monthOffset++) {
      const currentMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
      );

      dayWiseSelection.forEach(({ week, day }) => {
        const jsDay = day === 6 ? 0 : day + 1;
        const datesInMonth = [];
        const tempDate = new Date(currentMonth);

        while (tempDate.getDay() !== jsDay) {
          tempDate.setDate(tempDate.getDate() + 1);
        }

        while (tempDate.getMonth() === currentMonth.getMonth()) {
          datesInMonth.push(new Date(tempDate));
          tempDate.setDate(tempDate.getDate() + 7);
        }

        if (datesInMonth[week]) {
          result.push(datesInMonth[week].toISOString().slice(0, 10));
        }
      });
    }

    return result.sort();
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
          <InputWithTitle
            title={`No of Jobs`}
            type="text"
            name="noOfJobs"
            placeholder="No of Jobs"
            value={selectedDates.length || 0}
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

        {(selectedJobType === "monthly" || selectedJobType === "daily") && (
          <>
            <Grid item lg={3} xs={4}>
              <InputWithTitle
                title="Total No Of Jobs"
                type="text"
                name="generatedDatesCount"
                placeholder="Generated Jobs"
                value={allDatesSelect}
                readOnly={true}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle
                title="Sub total"
                type="text"
                name="generatedSubtotal"
                placeholder="Generated Subtotal"
                value={allDatesSelect * rate}
                readOnly
              />
            </Grid>
          </>
        )}
      </Grid>

      <div style={{ marginTop: "1rem" }}>
        <div style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}>
          {selectedDates?.length > 0 ? (
            <>
              Selected Dates: {selectedDates.join(", ")}
              {(selectedJobType === "monthly" ||
                selectedJobType === "daily") && (
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
          {selectedJobType === "monthly" || selectedJobType === "daily"
            ? `Select Dates (Will repeat for ${duration_in_months} months)`
            : selectedJobType === "daily"
            ? "Select Date (Only one date allowed)"
            : "Select Dates"}
        </DialogTitle>
        <DialogContent>
          {(selectedJobType === "weekly" ||
            selectedJobType === "daily" ||
            selectedJobType === "monthly") && (
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Date" />
              <Tab label="Day-wise" />
            </Tabs>
          )}
          <Box sx={{ p: 2 }}>
            {activeTab === 0 && (
              <CalendarComponent
                initialDates={selectedDates?.map((date) => new Date(date))}
                onDateChange={handleDateChange}
                minDate={selectedJobType === "daily" ? new Date() : undefined}
                maxSelectable={selectedJobType === "daily" ? 1 : undefined}
              />
            )}
            {activeTab === 1 && renderDayWiseSelection()}
          </Box>
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
