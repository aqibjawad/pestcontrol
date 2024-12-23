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

    const isValid = Object.values(monthCounts).every((count) => {
      return count <= servicesPerMonth;
    });

    setIsValidSelection(isValid);

    if (!isValid) {
      const invalidMonths = Object.entries(monthCounts)
        .filter(([_, count]) => count > servicesPerMonth)
        .map(([month]) => {
          const [year, monthNum] = month.split("-");
          return `${monthNum}/${year}`;
        });

      Swal.fire({
        icon: "error",
        title: "Too Many Dates Selected",
        text: `You can only select up to ${servicesPerMonth} dates per month. Months exceeding limit: ${invalidMonths.join(
          ", "
        )}`,
      });
    }

    return isValid;
  };

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
    if (validateMonthlyDates(potentialDates)) {
      setWeeklySelection(newWeeklySelection);
    }
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

    if (!validateMonthlyDates(generatedDates)) {
      return;
    }

    let serviceId = quoteData?.quote_services[0]?.service_id;
    if (!serviceId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Service ID is missing or undefined. Cannot proceed.",
      });
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

  const renderMonthlyDateCounts = () => {
    return (
      <div className="mt-2 text-sm">
        <p className="font-medium">
          Monthly Breakdown (Limit: {servicesPerMonth} per month):
        </p>
        {Object.entries(monthlyDateCounts).map(([month, count]) => {
          const [year, monthNum] = month.split("-");
          const isOverLimit = count > servicesPerMonth;
          return (
            <p
              key={month}
              className={`${isOverLimit ? "text-red-500" : "text-green-500"}`}
            >
              {`Month ${monthNum}/${year}: ${count} dates`}
            </p>
          );
        })}
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
          <Tab label="Date" />
          <Tab label="Weekly" />
        </Tabs>

        {tabIndex === 0 && (
          <>
            <CalendarComponent
              initialDates={selectedDates}
              onDateChange={handleDateChange}
            />
            {generatedDates.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="font-medium mb-2">Generated Dates:</p>
                <div className="max-h-40 overflow-y-auto">
                  {generatedDates.map((date, index) => (
                    <p key={index}>{date}</p>
                  ))}
                </div>
                {renderMonthlyDateCounts()}
              </div>
            )}
          </>
        )}

        {tabIndex === 1 && (
          <div className="mt-4">
            {[1, 2, 3, 4].map((weekNum) => renderWeekSelection(weekNum))}

            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="font-medium mb-2">Selected Days Preview:</p>
              <div className="max-h-40 overflow-y-auto">
                {generatedDates.map((date, index) => (
                  <p key={index}>{date}</p>
                ))}
              </div>
              {renderMonthlyDateCounts()}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!isValidSelection || generatedDates.length === 0}
        >
          Save Dates
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateTimeSelectionModal;
