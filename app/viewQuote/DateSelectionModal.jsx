import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  CircularProgress,
} from "@mui/material";
import CalendarComponent from "./calender.component";
import Swal from "sweetalert2";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import {
  addMonths,
  format,
  parse,
  startOfMonth,
  setDate,
  addWeeks,
  addDays,
  getDate,
  setHours,
  setMinutes,
  parseISO,
  getMonth,
  getYear,
} from "date-fns";

const DateTimeSelectionModal = ({ open, onClose, initialDates, quoteData }) => {
  const idAsString = quoteData?.quote_services[0]?.id.toString();

  const jobTypes =
    quoteData?.quote_services?.map((service) => service.job_type) || [];
  const isCustomJob = jobTypes.includes("custom");

  const api = new APICall();

  // New state variables
  const [trn, setTrn] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [isFoodWatchAccount, setIsFoodWatchAccount] = useState(false);
  const [foodWatchStatus, setFoodWatchStatus] = useState("unlinked");

  // Existing state variables
  const [totalServices, setTotalServices] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);
  const [servicesPerMonth, setServicesPerMonth] = useState(0);
  const [monthlyDateCounts, setMonthlyDateCounts] = useState({});
  const [isValidSelection, setIsValidSelection] = useState(true);
  const [isValidTotalDates, setIsValidTotalDates] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState(initialDates || []);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [tabIndex, setTabIndex] = useState(0);
  const [generatedDates, setGeneratedDates] = useState([]);
  const [weeklySelection, setWeeklySelection] = useState({
    week1: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    week2: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    week3: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    week4: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
  });

  // New handlers
  const handleTrnChange = (e) => {
    setTrn(e.target.value);
  };

  const handleLicenseNoChange = (e) => {
    setLicenseNo(e.target.value);
  };

  const handleFoodWatchLink = () => {
    setFoodWatchStatus("linked");
    setIsFoodWatchAccount(true);
  };

  const handleFoodWatchUnlink = () => {
    setFoodWatchStatus("unlinked");
    setIsFoodWatchAccount(false);
  };

  // Existing useEffects
  useEffect(() => {
    if (quoteData?.quote_services?.[0]) {
      const total = quoteData.quote_services[0].no_of_services;
      const duration = quoteData.duration_in_months;

      // Extract job types and check if "custom" exists
      const jobTypes =
        quoteData.quote_services.map((service) => service.job_type) || [];
      const isCustomJob = jobTypes.includes("custom");

      // Calculate services per month based on job type
      const servicesPerMonth = isCustomJob
        ? duration / total // For "custom" job type
        : total / duration; // For other job types

      // Save the calculated value in the state
      setTotalServices(servicesPerMonth);
      setDurationMonths(duration);
    }
  }, [quoteData]);

  useEffect(() => {
    if (totalServices && generatedDates.length > 0) {
      setIsValidTotalDates(generatedDates.length === totalServices);
      if (generatedDates.length > totalServices) {
        setErrorMessage(
          `Too many dates selected. Please select only ${totalServices} dates.`
        );
      } else if (generatedDates.length < totalServices) {
        setErrorMessage(
          `Not enough dates selected. Please select ${totalServices} dates.`
        );
      } else {
        setErrorMessage("");
      }
    }
  }, [generatedDates, totalServices]);

  useEffect(() => {
    if (selectedDates.length > 0 && durationMonths) {
      const newDates = isCustomJob
        ? generateDatesWithInterval(selectedDates, selectedTime)
        : generateDatesForDuration(selectedDates, selectedTime);

      validateMonthlyDates(newDates);
      setGeneratedDates(newDates);
    }
  }, [selectedDates, durationMonths, isCustomJob]);

// Add this useEffect to track checkbox selections
useEffect(() => {
  // Count total selected checkboxes across all weeks
  const totalSelected = Object.values(weeklySelection).reduce((count, weekDays) => {
    return count + Object.values(weekDays).filter(Boolean).length;
  }, 0);
  
  // Update validation state based on selections
  if (tabIndex === 1) { // Only for Day Wise tab
    setIsValidTotalDates(totalSelected === totalServices);
    
    if (totalSelected > totalServices) {
      setErrorMessage(`Too many days selected. Please select only ${totalServices} days.`);
    } else if (totalSelected < totalServices) {
      setErrorMessage(`Not enough days selected. Please select ${totalServices} days.`);
    } else {
      setErrorMessage("");
    }
  }
}, [weeklySelection, totalServices, tabIndex]);
  // Existing helper functions
  const countDatesPerMonth = (dates) => {
    const counts = {};
    dates.forEach((date) => {
      const dateObj = parseISO(date);
      const monthKey = `${getYear(dateObj)}-${getMonth(dateObj) + 1}`;
      counts[monthKey] = (counts[monthKey] || 0) + 1;
    });
    return counts;
  };

  const validateMonthlyDates = (dates) => {
    if (!dates.length) return true;

    const monthCounts = countDatesPerMonth(dates);
    setMonthlyDateCounts(monthCounts);

    const isMonthlyValid = Object.values(monthCounts).every(
      (count) => count <= servicesPerMonth
    );

    if (tabIndex === 0) {
      setIsValidSelection(isMonthlyValid);
    } else {
      setIsValidSelection(true);
      if (!isMonthlyValid) {
        return false;
      }
    }

    return true;
  };

  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);

    if (tabIndex === 0) {
      const newDates = generateDatesForDuration(selectedDates, newTime);
      validateMonthlyDates(newDates);
      setGeneratedDates(newDates);
    } else {
      const dates = generateWeeklyDates(newTime);
      validateMonthlyDates(dates);
      setGeneratedDates(dates);
    }
  };

  const generateDatesForDuration = (dates, timeString) => {
    if (dates.length === 0) return [];

    try {
      const allDates = [];
      const [hours, minutes] = timeString.split(":").map(Number);

      const selectedDaysOfMonth = dates.map((date) => {
        const dateObj = new Date(date);
        return dateObj.getDate();
      });

      const firstDate = new Date(dates[0]);
      const startMonth = firstDate.getMonth();
      const startYear = firstDate.getFullYear();

      for (let monthOffset = 0; monthOffset < durationMonths; monthOffset++) {
        selectedDaysOfMonth.forEach((dayOfMonth) => {
          let newDate = new Date(
            startYear,
            startMonth + monthOffset,
            dayOfMonth
          );
          newDate = setHours(newDate, hours);
          newDate = setMinutes(newDate, minutes);
          allDates.push(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        });
      }

      return allDates.sort();
    } catch (error) {
      console.error("Error generating dates:", error);
      return [];
    }
  };

  const generateDatesWithInterval = (dates, timeString) => {
    if (!dates?.length || !durationMonths) return [];

    try {
      const allDates = [];
      const [hours, minutes] = timeString.split(":").map(Number);

      dates.forEach((date) => {
        const baseDate = new Date(date);
        const intervals = Math.floor(durationMonths / 3);

        for (let i = 0; i < intervals; i++) {
          let newDate = addMonths(baseDate, i * 3);
          newDate = setHours(newDate, hours);
          newDate = setMinutes(newDate, minutes);
          allDates.push(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        }
      });

      return allDates.sort();
    } catch (error) {
      console.error("Error generating interval dates:", error);
      return [];
    }
  };

  const handleDateChange = (dates) => {
    console.log("Selected dates:", dates);

    if (isCustomJob) {
      const intervalDates = generateDatesWithInterval(dates, selectedTime);
      console.log("Generated interval dates:", intervalDates);

      if (validateMonthlyDates(intervalDates)) {
        setSelectedDates(dates);
        setGeneratedDates(intervalDates);
      }
    } else {
      const regularDates = generateDatesForDuration(dates, selectedTime);
      if (validateMonthlyDates(regularDates)) {
        setSelectedDates(dates);
        setGeneratedDates(regularDates);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setGeneratedDates([]);
    setMonthlyDateCounts({});
    setIsValidSelection(true);
    setIsValidTotalDates(false);
    setErrorMessage("");
  };

  // Modify the handleWeekDayChange function
  const handleWeekDayChange = (week, day) => {
    // Calculate how many checkboxes are currently selected
    const currentSelectedCount = Object.values(weeklySelection).reduce(
      (count, weekDays) => {
        return count + Object.values(weekDays).filter(Boolean).length;
      },
      0
    );

    // Check if trying to select a new checkbox
    const isSelecting = !weeklySelection[week][day];

    // If selecting and already at max allowed, prevent selection
    if (isSelecting && currentSelectedCount >= totalServices) {
      // Show error message
      setErrorMessage(`You can only select ${totalServices} days per month`);
      return;
    }

    // Clear error message if deselecting or within limits
    setErrorMessage("");

    // Update the weekly selection state
    const newWeeklySelection = {
      ...weeklySelection,
      [week]: {
        ...weeklySelection[week],
        [day]: !weeklySelection[week][day],
      },
    };

    // Apply the state change
    setWeeklySelection(newWeeklySelection);

    // Generate dates based on the new selection
    const potentialDates = generateWeeklyDates(
      selectedTime,
      newWeeklySelection
    );
    setGeneratedDates(potentialDates);

    // Count how many days are now selected
    const newSelectedCount = Object.values(newWeeklySelection).reduce(
      (count, weekDays) => {
        return count + Object.values(weekDays).filter(Boolean).length;
      },
      0
    );

    // Update validation state
    setIsValidTotalDates(newSelectedCount === totalServices);
  };

  const generateWeeklyDates = (timeString, weekSelection = weeklySelection) => {
    const selectedDays = [];
    const now = new Date();
    const monthStart = startOfMonth(now);
    const dayMap = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0 };
    const [hours, minutes] = timeString.split(":").map(Number);

    const baseDates = [];
    Object.entries(weekSelection).forEach(([week, days], weekIndex) => {
      Object.entries(days).forEach(([day, isSelected]) => {
        if (isSelected) {
          const dayNumber = dayMap[day];
          let targetDate = addWeeks(monthStart, weekIndex);

          while (targetDate.getDay() !== dayNumber) {
            targetDate = addDays(targetDate, 1);
          }

          targetDate = setHours(targetDate, hours);
          targetDate = setMinutes(targetDate, minutes);
          baseDates.push(targetDate);
        }
      });
    });

    if (baseDates.length > 0 && durationMonths) {
      for (let monthOffset = 0; monthOffset < durationMonths; monthOffset++) {
        baseDates.forEach((baseDate) => {
          const newDate = addMonths(baseDate, monthOffset);
          selectedDays.push(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        });
      }
    }

    return selectedDays.sort();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      trn: trn,
      license_no: licenseNo,
      is_food_watch_account: isFoodWatchAccount,
      quote_services: [
        {
          quote_service_id: idAsString,
          dates: generatedDates,
        },
      ],
    };

    try {
      const response = await api.postDataToken(
        `${quotation}/move/contract/${quoteData.id}`,
        dataToSend
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        onClose();
        window.location.reload();
      } else {
        throw new Error(response.error?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message || "Failed to process the request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderWeekSelection = (weekNum) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const weekKey = `week${weekNum}`;

    return (
      <div className="mb-4 p-4 border rounded">
        <h3 className="mb-2 font-medium">Week {weekNum}</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <FormControlLabel
              key={`${weekKey}-${day}`}
              control={
                <Checkbox
                  checked={weeklySelection[weekKey][day]}
                  onChange={() => handleWeekDayChange(weekKey, day)}
                  size="small"
                />
              }
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              className="m-0"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Select Dates and Time (
        {isCustomJob
          ? "1 service per month"
          : `Maximum ${totalServices} services per month`}
        )
      </DialogTitle>

      <DialogContent>
        <div className="mb-4 mt-4">
          <TextField
            type="time"
            label="Select Time"
            value={selectedTime}
            onChange={handleTimeChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />

          <TextField
            className="ml-10"
            type="text"
            label="TRN"
            value={trn}
            onChange={handleTrnChange}
          />

          <TextField
            className="ml-10"
            type="text"
            label="License No"
            value={licenseNo}
            onChange={handleLicenseNoChange}
          />

          <div className="mt-4">
            <label className="block font-bold mb-2">Food Watch Account</label>
            <div className="space-x-4">
              <Button
                variant="contained"
                onClick={handleFoodWatchLink}
                style={{
                  backgroundColor:
                    foodWatchStatus === "linked" ? "#4CAF50" : "#D3D3D3",
                  color: "white",
                }}
              >
                Link
              </Button>
              <Button
                variant="contained"
                onClick={handleFoodWatchUnlink}
                style={{
                  backgroundColor:
                    foodWatchStatus === "unlinked" ? "#4CAF50" : "#D3D3D3",
                  color: "white",
                }}
              >
                Unlink
              </Button>
            </div>
          </div>
        </div>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Date Wise" />
          <Tab label="Day Wise" />
        </Tabs>

        {tabIndex === 0 && (
          <div className="mt-3">
            <CalendarComponent
              initialDates={selectedDates}
              onDateChange={handleDateChange}
            />
          </div>
        )}

        {tabIndex === 1 && (
          <div className="mt-4">
            {renderWeekSelection(1)}
            {renderWeekSelection(2)}
            {renderWeekSelection(3)}
            {renderWeekSelection(4)}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={
            loading ||
            (tabIndex === 0
              ? isCustomJob
                ? selectedDates.length !== 1
                : selectedDates.length !== totalServices
              : !isValidTotalDates)
          }
        >
          {loading ? <CircularProgress size={24} /> : "Save Dates"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateTimeSelectionModal;
