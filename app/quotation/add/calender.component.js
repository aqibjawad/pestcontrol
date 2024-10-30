import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({
  onDateChange,
  initialDates = [],
  isDateSelectable,
}) => {
  const [dates, setDates] = useState(initialDates);

  useEffect(() => {
    if (JSON.stringify(dates) !== JSON.stringify(initialDates)) {
      setDates(initialDates);
    }
  }, [initialDates]);

  // Helper function to normalize date to local midnight
  const normalizeDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const formatDate = (date) => {
    const d = normalizeDate(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const handleDateChange = (date) => {
    if (date) {
      const normalizedDate = normalizeDate(date);
      const dateStr = formatDate(normalizedDate);
      const newDates = dates.includes(dateStr)
        ? dates.filter((d) => d !== dateStr)
        : [...dates, dateStr];

      setDates(newDates);
      onDateChange(newDates);
    }
  };

  const formattedDates = dates.map((dateStr) =>
    normalizeDate(new Date(dateStr))
  );

  // Format selected dates for display
  const displayDates = dates
    .map((dateStr) => normalizeDate(new Date(dateStr)).toLocaleDateString())
    .join(", ");

  return (
    <div>
      <DatePicker
        selected={null}
        onChange={handleDateChange}
        inline
        highlightDates={formattedDates}
        dayClassName={(date) => {
          const dateStr = formatDate(normalizeDate(date));
          return dates.includes(dateStr) ? "selected-date" : undefined;
        }}
        filterDate={isDateSelectable}
      />
      <p>Selected Dates: {displayDates.length > 0 ? displayDates : "None"}</p>
      <style jsx>{`
        .selected-date {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
