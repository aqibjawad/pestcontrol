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
}) => {
  
  const [rate, setRate] = useState(jobData.rate || 0);
  const [open, setOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState(jobData.jobType || "");
  
  const [selectedDates, setSelectedDates] = useState(jobData.dates || []);
  console.log("dates selected !!!!",selectedDates);
  
  const [subTotal, setSubTotal] = useState(jobData.subTotal || 0);
  const [intervalDays, setIntervalDays] = useState(5);
  const [allGeneratedDates, setAllGeneratedDates] = useState([]);
  const [generatedSubTotal, setGeneratedSubTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [dayWiseSelection, setDayWiseSelection] = useState([]);

  const jobTypes = [
    { label: "One Time", value: "one_time" },
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Custom", value: "custom" },
  ];

  const generateDates = (initialDates) => {
    if (!initialDates || !initialDates.length) return [];

    return initialDates
      .flatMap((initialDate) => {
        const startDate = new Date(initialDate);
        return Array.from({ length: duration_in_months - 1 }, (_, i) => {
          const date = new Date(startDate);
          date.setMonth(startDate.getMonth() + i + 1);
          return date.getDate() === startDate.getDate() ? date : null;
        })
          .filter(Boolean)
          .map((date) => date.toISOString().slice(0, 10));
      })
      .sort();
  };

  useEffect(() => {
    let allDates = selectedDates ? [...selectedDates] : [];
    let finalDates = allDates;

    if (selectedJobType === "monthly" && allDates.length > 0) {
      finalDates = generateDates(allDates);
    }

    const calculatedSubTotal = finalDates.length * parseFloat(rate || 0);

    setAllGeneratedDates(finalDates);
    setSubTotal(calculatedSubTotal);
    setGeneratedSubTotal(calculatedSubTotal);

    updateJobList({
      jobType: selectedJobType,
      rate: rate,
      dates: finalDates,
      displayDates: selectedDates,
      subTotal: calculatedSubTotal,
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
    console.log("handleServiceChange called with value:", value);
    const selectedService = allServices.find((service) => service.id === value);
    console.log("selectedService:", selectedService);
    if (selectedService) {
      updateJobList((prevJobData) => {
        console.log("Updating jobData:", prevJobData);
        return {
          ...prevJobData,
          service_id: value,
          service_name: selectedService.pest_name,
        };
      });
    }
  };

  useEffect(() => {
    // This will run after jobData has been updated
    // console.log("Updated jobData:", jobData);
  }, [jobData]);

  // const serviceOptions = allServices.map((service) => ({
  //   label: service.service_title,
  //   value: service.id,
  // }));

  const getUniqueServiceOptions = (allServices) => {
    const uniqueTitles = new Set();
    const uniqueOptions = [];

    allServices.forEach((service) => {
      if (!uniqueTitles.has(service.service_title)) {
        uniqueTitles.add(service.service_title);
        uniqueOptions.push({
          label: service.service_title,
          value: service.id,
        });
      }
    });

    return uniqueOptions;
  };

  const serviceOptions = getUniqueServiceOptions(allServices);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={4}>
          <Dropdown2
            title="Select Services"
            options={serviceOptions}
            value={jobData.service_id}
            onChange={handleServiceChange}
            fullWidth
          />
        </Grid>

        <Grid item lg={3} xs={4}>
          <InputWithTitle
            title="No of Jobs"
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

        {selectedJobType === "monthly" && (
          <>
            <Grid item lg={3} xs={4}>
              <InputWithTitle
                title="Total No Of Jobs"
                type="text"
                name="generatedDatesCount"
                placeholder="Generated Jobs"
                value={selectedDates.length * duration_in_months}
                readOnly={true}
              />
            </Grid>
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
          <Button
            onClick={() => {
              setSelectedDates([]); // Clear selected dates
              setDayWiseSelection([]); // Clear day-wise selection if applicable
            }}
          >
            Clear
          </Button>
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
