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

  const handleDateChange = (date) => {
    if (date) {
      const dateStr = date.toDateString();
      const newDates = dates.includes(dateStr)
        ? dates.filter((d) => d !== dateStr)
        : [...dates, dateStr];

      setDates(newDates);
      onDateChange(newDates);
    }
  };

  const formattedDates = dates.map((dateStr) => new Date(dateStr));

  return (
    <div>
      <DatePicker
        selected={null}
        onChange={handleDateChange}
        inline
        highlightDates={formattedDates}
        dayClassName={(date) => {
          const dateStr = date.toDateString();
          return dates.includes(dateStr) ? "selected-date" : undefined;
        }}
        filterDate={isDateSelectable}
      />
      <p>Selected Dates: {dates.join(", ")}</p>
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
