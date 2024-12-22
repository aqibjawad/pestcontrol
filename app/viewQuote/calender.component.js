import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({ onDateChange, initialDates = [] }) => {
  const [selectedDates, setSelectedDates] = useState(initialDates);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    let newDates;

    if (selectedDates.includes(formattedDate)) {
      // Remove date if already selected
      newDates = selectedDates.filter((d) => d !== formattedDate);
    } else {
      // Add date if not already selected
      newDates = [...selectedDates, formattedDate];
    }

    setSelectedDates(newDates);
    onDateChange(newDates);
  };

  const getHighlightedDates = () => {
    return selectedDates.map((dateStr) => new Date(dateStr));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <DatePicker
        onChange={handleDateChange}
        inline
        highlightDates={getHighlightedDates()}
      />
      <div className="mt-4">
        <h3 className="font-medium">Selected Dates:</h3>
        <ul>
          {selectedDates.map((date, index) => (
            <li key={index} className="text-sm text-gray-700">
              {date}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .react-datepicker__day--highlighted {
          background-color: #007bff !important;
          color: white !important;
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
