import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({
  onDateChange,
  initialDates = [],
  isDateSelectable,
}) => {
  const [selectedDates, setSelectedDates] = useState(initialDates);

  useEffect(() => {
    console.log("Initial dates updated:", initialDates);
    if (JSON.stringify(selectedDates) !== JSON.stringify(initialDates)) {
      console.log("Resetting selected dates to initial dates");
      setSelectedDates(initialDates);
    }
  }, [initialDates]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    console.log("Date changed:", date);
    if (!date) return;

    const formattedDate = formatDate(date);
    let newDates;

    if (selectedDates.includes(formattedDate)) {
      console.log("Removing date:", formattedDate);
      // If date is already selected, remove it
      newDates = selectedDates.filter((d) => d !== formattedDate);
    } else {
      console.log("Adding date:", formattedDate);
      // If date is not selected, add it
      newDates = [...selectedDates, formattedDate];
    }

    console.log("Updated selected dates:", newDates);
    setSelectedDates(newDates);
    onDateChange(newDates);
  };

  const getHighlightedDates = () => {
    console.log("Getting highlighted dates");
    return selectedDates.map((dateStr) => new Date(dateStr));
  };

  const getDisplayDates = () => {
    console.log("Getting display dates");
    return selectedDates
      .map((dateStr) => new Date(dateStr).toLocaleDateString())
      .join(", ");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <DatePicker
        selected={null}
        onChange={handleDateChange}
        inline
        highlightDates={getHighlightedDates()}
        dateFormat="yyyy-MM-dd"
        showTimeSelect={false} // Ensure no time selection
        dayClassName={(date) => {
          console.log("Getting day class name for date:", date);
          return selectedDates.includes(formatDate(date))
            ? "selected-date"
            : undefined;
        }}
        filterDate={isDateSelectable}
      />
      <p className="mt-4 text-gray-700">
        Selected Dates: {getDisplayDates() || "None"}
      </p>
      <style jsx>{`
        .selected-date {
          background-color: #007bff !important;
          color: white !important;
          border-radius: 0.25rem;
        }
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;