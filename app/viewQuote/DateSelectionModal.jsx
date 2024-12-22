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
} from "date-fns";

const DateSelectionModal = ({ open, onClose, initialDates, quoteData }) => {
  const api = new APICall();
  const [selectedDates, setSelectedDates] = useState(initialDates || []);
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
    if (selectedDates.length > 0 && quoteData?.duration_in_months) {
      generateDatesForDuration();
    }
  }, [selectedDates, quoteData?.duration_in_months]);

  // Add new useEffect for weeklySelection
  useEffect(() => {
    if (quoteData?.duration_in_months) {
      const dates = generateWeeklyDates();
      setGeneratedDates(dates);
    }
  }, [weeklySelection, quoteData?.duration_in_months]);

  const generateDatesForDuration = () => {
    if (selectedDates.length === 0) return;

    try {
      const allDates = [];

      const selectedDaysOfMonth = selectedDates.map((date) => {
        const dateObj = new Date(date);
        return dateObj.getDate();
      });

      const firstDate = new Date(selectedDates[0]);
      const startMonth = firstDate.getMonth();
      const startYear = firstDate.getFullYear();

      for (
        let monthOffset = 0;
        monthOffset < quoteData.duration_in_months;
        monthOffset++
      ) {
        selectedDaysOfMonth.forEach((dayOfMonth) => {
          const newDate = new Date(
            startYear,
            startMonth + monthOffset,
            dayOfMonth
          );
          allDates.push(format(newDate, "yyyy-MM-dd"));
        });
      }

      allDates.sort();
      setGeneratedDates(allDates);
    } catch (error) {
      console.error("Error generating dates:", error);
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // Reset generatedDates when switching tabs
    setGeneratedDates([]);
  };

  const handleWeekDayChange = (week, day) => {
    setWeeklySelection((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [day]: !prev[week][day],
      },
    }));
  };

  const generateWeeklyDates = () => {
    const selectedDays = [];
    const now = new Date();
    const monthStart = startOfMonth(now);
    const dayMap = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0 };

    // First generate base dates for the first month
    const baseDates = [];
    Object.entries(weeklySelection).forEach(([week, days], weekIndex) => {
      Object.entries(days).forEach(([day, isSelected]) => {
        if (isSelected) {
          const dayNumber = dayMap[day];
          let targetDate = addWeeks(monthStart, weekIndex);

          while (targetDate.getDay() !== dayNumber) {
            targetDate = addDays(targetDate, 1);
          }

          baseDates.push(targetDate);
        }
      });
    });

    // Now generate dates for all months based on duration_in_months
    if (baseDates.length > 0 && quoteData?.duration_in_months) {
      for (
        let monthOffset = 0;
        monthOffset < quoteData.duration_in_months;
        monthOffset++
      ) {
        baseDates.forEach((baseDate) => {
          const newDate = addMonths(baseDate, monthOffset);
          selectedDays.push(format(newDate, "yyyy-MM-dd"));
        });
      }
    }

    return selectedDays.sort();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataToSend = {
      quote_services: [
        {
          quote_service_id: 40,
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Dates</DialogTitle>
      <DialogContent>
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
                <p className="mt-2">Total Dates: {generatedDates.length}</p>
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
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save Dates
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateSelectionModal;
