import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  isBefore,
  isAfter,
} from "date-fns";

const MonthPicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDate = new Date();

  const formatDisplayDate = (date) => {
    return format(date, "MMM yyyy");
  };

  const getMonthDates = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  };

  const previousMonth = () => {
    setSelectedDate((prevDate) => {
      const newDate = addMonths(prevDate, -1);
      const dates = getMonthDates(newDate);
      onDateChange(dates);
      return newDate;
    });
  };

  const nextMonth = () => {
    setSelectedDate((prevDate) => {
      const newDate = addMonths(prevDate, 1);
      const dates = getMonthDates(newDate);
      onDateChange(dates);
      return newDate;
    });
  };

  const canGoNext = isBefore(
    startOfMonth(selectedDate),
    startOfMonth(currentDate)
  );
 
  // Initialize with current month's dates
  React.useEffect(() => {
    const dates = getMonthDates(selectedDate);
    onDateChange(dates);
  }, []);

  return (
    <div className="h-[50px] bg-white rounded-lg shadow-sm flex items-center justify-between px-4">
      <button
        onClick={previousMonth}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="font-bold text-green-600 text-base">
        {formatDisplayDate(selectedDate)}
      </span>

      <button
        onClick={nextMonth}
        disabled={!canGoNext}
        className={`p-2 rounded-full ${
          canGoNext ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MonthPicker;
