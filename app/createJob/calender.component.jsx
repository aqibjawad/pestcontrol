import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onDateChange }) => {
  const [dates, setDates] = useState([new Date(), new Date()]);

  const handleDateChange = (newDates) => {
    setDates(newDates);
    onDateChange(newDates);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        selectRange={true}
        value={dates}
      />
      <p>Selected Dates: {dates[0].toDateString()} - {dates[1].toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;
  