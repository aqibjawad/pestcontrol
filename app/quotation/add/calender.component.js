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

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (date) => {
    if (date) {
      const dateStr = formatDate(date);
      const newDates = dates.includes(dateStr)
        ? dates.filter((d) => d !== dateStr)
        : [...dates, dateStr];

      setDates(newDates);
      onDateChange(newDates);
    }
  };

  const formattedDates = dates.map((dateStr) => new Date(dateStr));

  // Format selected dates for display
  const displayDates = dates.map((dateStr) => new Date(dateStr).toLocaleDateString()).join(", ");

  return (
    <div>
      <DatePicker
        selected={null}
        onChange={handleDateChange}
        inline
        highlightDates={formattedDates}
        dayClassName={(date) => {
          const dateStr = formatDate(date);
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
