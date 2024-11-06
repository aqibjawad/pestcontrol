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
    if (!date) return;

    const formattedDate = formatDate(date);
    let newDates;

    if (selectedDates.includes(formattedDate)) {
      // If date is already selected, remove it
      newDates = selectedDates.filter((d) => d !== formattedDate);
    } else {
      // If date is not selected, add it
      newDates = [...selectedDates, formattedDate];
    }

    setSelectedDates(newDates);
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
        selected={null}
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
