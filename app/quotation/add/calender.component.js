import React, { useState, useEffect } from "react";

const CalendarComponent = ({
  onDateChange,
  initialDates = [],
  isDateSelectable = () => true,
}) => {
  const [selectedDates, setSelectedDates] = useState(
    new Set(
      initialDates.map((date) => new Date(date).toISOString().split("T")[0])
    )
  );

  useEffect(() => {
    const initialDateSet = new Set(
      initialDates.map((date) => new Date(date).toISOString().split("T")[0])
    );
    if (
      JSON.stringify([...selectedDates]) !== JSON.stringify([...initialDateSet])
    ) {
      setSelectedDates(initialDateSet);
    }
  }, [initialDates]);

  const handleDateClick = (date) => {
    if (!isDateSelectable(date)) return;

    const dateStr = date.toISOString().split("T")[0];
    const newDates = new Set(selectedDates);

    if (newDates.has(dateStr)) {
      newDates.delete(dateStr);
    } else {
      newDates.add(dateStr);
    }

    setSelectedDates(newDates);
    onDateChange([...newDates]);
  };

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const monthDays = [];
    const startPadding = firstDay.getDay();

    // Add padding for start of month
    for (let i = 0; i < startPadding; i++) {
      monthDays.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      monthDays.push(new Date(currentYear, currentMonth, day));
    }

    return monthDays;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {generateCalendar().map((date, index) => (
          <div
            key={index}
            className={`calendar-day ${date ? "calendar-day-active" : ""} ${
              date && selectedDates.has(date.toISOString().split("T")[0])
                ? "selected"
                : ""
            } ${date && !isDateSelectable(date) ? "disabled" : ""}`}
            onClick={() => date && handleDateClick(date)}
          >
            {date ? date.getDate() : ""}
          </div>
        ))}
      </div>

      <div className="selected-dates">
        <p className="selected-dates-label">Selected Dates:</p>
        <div className="selected-dates-list">
          {[...selectedDates].length > 0 ? (
            [...selectedDates].sort().map((dateStr) => (
              <span key={dateStr} className="date-badge">
                {formatDate(dateStr)}
              </span>
            ))
          ) : (
            <span className="no-dates">None</span>
          )}
        </div>
      </div>

      <style jsx>{`
        .calendar-container {
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: 0 auto;
        }

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .calendar-day-header {
          padding: 5px;
          font-size: 0.9em;
          color: #666;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 0.9em;
          background: white;
        }

        .calendar-day:hover:not(.disabled) {
          background-color: #f0f0f0;
        }

        .calendar-day.selected {
          background-color: #007bff;
          color: white;
          border-color: #0056b3;
        }

        .calendar-day.disabled {
          color: #ccc;
          cursor: not-allowed;
          background-color: #f8f8f8;
        }

        .selected-dates {
          margin-top: 20px;
          padding: 10px;
        }

        .selected-dates-label {
          font-weight: bold;
          margin-bottom: 10px;
          color: #666;
        }

        .selected-dates-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .date-badge {
          background-color: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .no-dates {
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
