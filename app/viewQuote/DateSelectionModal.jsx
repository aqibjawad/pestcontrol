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
  CircularProgress
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
  const api = new APICall();

  const [totalServices, setTotalServices] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);
  const [servicesPerMonth, setServicesPerMonth] = useState(0);
  const [monthlyDateCounts, setMonthlyDateCounts] = useState({});
  const [isValidSelection, setIsValidSelection] = useState(true);
  const [isValidTotalDates, setIsValidTotalDates] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    if (
      quoteData?.quote_services?.[0]?.no_of_services &&
      quoteData?.duration_in_months
    ) {
      const total = quoteData.quote_services[0].no_of_services;
      const duration = quoteData.duration_in_months;
      setTotalServices(total);
      setDurationMonths(duration);
      setServicesPerMonth(Math.floor(total / duration));
    }
  }, [quoteData]);

  useEffect(() => {
    if (totalServices && generatedDates.length > 0) {
      setIsValidTotalDates(generatedDates.length === totalServices);
      if (generatedDates.length > totalServices) {
        setErrorMessage(
          `Too many dates selected. Please select only ${totalServices} dates.`
        );
      } else {
        setErrorMessage("");
      }
    }
  }, [generatedDates, totalServices]);

  useEffect(() => {
    if (selectedDates.length > 0 && durationMonths) {
      const newDates = generateDatesForDuration(selectedDates, selectedTime);
      validateMonthlyDates(newDates);
      setGeneratedDates(newDates);
    }
  }, [selectedDates, durationMonths]);

  useEffect(() => {
    if (durationMonths) {
      const dates = generateWeeklyDates(selectedTime);
      validateMonthlyDates(dates);
      setGeneratedDates(dates);
    }
  }, [weeklySelection, durationMonths]);

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
      // For date-wise tab, affect button state
      setIsValidSelection(isMonthlyValid);
    } else {
      // For day-wise tab, always keep button enabled
      setIsValidSelection(true);

      // But prevent checkbox selection if monthly limit would be exceeded
      if (!isMonthlyValid) {
        return false; // This will prevent checkbox from being selected
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

  const handleDateChange = (dates) => {
    const potentialDates = generateDatesForDuration(dates, selectedTime);
    if (validateMonthlyDates(potentialDates)) {
      setSelectedDates(dates);
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

  const handleWeekDayChange = (week, day) => {
    const newWeeklySelection = {
      ...weeklySelection,
      [week]: {
        ...weeklySelection[week],
        [day]: !weeklySelection[week][day],
      },
    };

    const potentialDates = generateWeeklyDates(
      selectedTime,
      newWeeklySelection
    );
    // Only update weekly selection if monthly validation passes
    if (validateMonthlyDates(potentialDates)) {
      setWeeklySelection(newWeeklySelection);
    }
    // If validation fails, the checkbox won't be updated
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the API call starts

    // For day-wise selection, we don't check isValidTotalDates
    if (
      !validateMonthlyDates(generatedDates) ||
      (tabIndex === 0 && !isValidTotalDates)
    ) {
      setLoading(false); // Reset loading state if validation fails
      return;
    }

    let serviceId = quoteData?.quote_services[0]?.service_id;
    if (!serviceId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Service ID is missing or undefined. Cannot proceed.",
      });
      setLoading(false); // Reset loading state if service ID is missing
      return;
    }

    const dataToSend = {
      quote_services: [
        {
          quote_service_id: serviceId,
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
      setLoading(false); // Reset loading state after request completes
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
        Select Dates and Time (Maximum {servicesPerMonth} services per month)
      </DialogTitle>
      <DialogContent>
        <div className="mb-4 mt-4">
          <TextField
            type="time"
            label="Select Time"
            value={selectedTime}
            onChange={handleTimeChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
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
            <div className="mt-2 text-sm text-gray-600">
              Total services required: {totalServices}
              <br />
              Currently selected: {generatedDates.length}
              <br />
              Maximum {servicesPerMonth} services allowed per month
              {errorMessage && (
                <div className="text-red-500 mt-1">{errorMessage}</div>
              )}
            </div>
          </div>
        )}

        {tabIndex === 1 && (
          <div className="mt-4">
            <div className="mb-4 text-sm text-gray-600">
              Currently selected dates: {generatedDates.length}
              <br />
              Maximum {servicesPerMonth} services allowed per month
            </div>
            {renderWeekSelection(1)}
            {renderWeekSelection(2)}
            {renderWeekSelection(3)}
            {renderWeekSelection(4)}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {/* <Button
          onClick={handleSubmit}
          color="primary"
          disabled={tabIndex === 0 ? !isValidTotalDates : !isValidSelection}
        >
          Save Dates
        </Button> */}
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={
            tabIndex === 0 ? !isValidTotalDates : !isValidSelection || loading
          } // Disable button if loading
        >
          {loading ? <CircularProgress size={24} /> : "Save Dates"}{" "}
          {/* Show loader when loading */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateTimeSelectionModal;
