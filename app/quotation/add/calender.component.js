import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarComponent = ({ onDateChange }) => {
  const [dates, setDates] = useState([]);

  const handleDateChange = (date) => {
    if (date) {
      // Convert date to string for easier comparison
      const dateStr = date.toDateString();
      setDates((prevDates) => {
        const newDates = prevDates.includes(dateStr)
          ? prevDates.filter(d => d !== dateStr)
          : [...prevDates, dateStr];
        
        onDateChange(newDates); // Pass updated list of dates
        return newDates;
      });
    }
  };

  // Convert date strings back to Date objects for rendering
  const formattedDates = dates.map(dateStr => new Date(dateStr));

  return (
    <div>
      <DatePicker
        selected={null}
        onChange={handleDateChange}
        inline
        highlightDates={formattedDates}
        dayClassName={date =>
          dates.includes(date.toDateString()) ? 'selected-date' : undefined
        }
      />
      <p>Selected Dates: {dates.join(', ')}</p>
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
