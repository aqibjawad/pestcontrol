import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({ onDateChange, initialDates = [], isDateSelectable }) => {
  const [dates, setDates] = useState(initialDates);

  useEffect(() => {
    setDates(initialDates);
  }, [initialDates]);

  const handleDateChange = (date) => {
    if (date) {
      const dateStr = date.toDateString();
      setDates((prevDates) => {
        const newDates = prevDates.includes(dateStr)
          ? prevDates.filter((d) => d !== dateStr)
          : [...prevDates, dateStr];

        onDateChange(newDates);
        return newDates;
      });
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
        filterDate={isDateSelectable} // Use filterDate to restrict selectable dates
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
