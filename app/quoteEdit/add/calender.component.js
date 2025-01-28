import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({
  onDateChange,
  initialDates = [],
  isDateSelectable,
}) => {
  const [selectedDates, setSelectedDates] = useState(initialDates);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (JSON.stringify(selectedDates) !== JSON.stringify(initialDates)) {
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
    const formattedDate = formatDate(date); // Convert selected date to string
    let newDates;

    console.log("Formatted date:", formattedDate);
    console.log("Selected dates (before):", selectedDates);

    // Ensure comparison is done on formatted dates
    const formattedSelectedDates = selectedDates.map((d) => formatDate(d));

    if (formattedSelectedDates.includes(formattedDate)) {
      // Remove date if already selected
      newDates = selectedDates.filter((d) => formatDate(d) !== formattedDate);
      console.log("Removing date (if):", formattedDate);
    } else {
      // Add date if not already selected
      newDates = [...selectedDates, date];
      console.log("Adding date (else):", formattedDate);
    }

    setSelectedDates(newDates);
    console.log("Selected dates (after):", newDates);
    onDateChange(newDates);
  };

  const getHighlightedDates = () => {
    return selectedDates.map((dateStr) => new Date(dateStr));
  };

  const getDisplayDates = () => {
    return selectedDates
      .map((dateStr) => new Date(dateStr).toLocaleDateString())
      .join(", ");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        inline
        highlightDates={getHighlightedDates()}
        dateFormat="yyyy-MM-dd"
        showTimeSelect={false} // Ensure no time selection
        dayClassName={(date) => {
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
