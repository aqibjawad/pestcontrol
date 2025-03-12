import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfYear,
  endOfYear,
  addYears,
  isBefore,
  isAfter,
} from "date-fns";

const YearPicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDate = new Date();

  const formatDisplayDate = (date) => {
    return format(date, "yyyy");
  };

  const getYearDates = (date) => {
    const start = startOfYear(date);
    const end = endOfYear(date);

    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  };

  const previousYear = () => {
    setSelectedDate((prevDate) => {
      const newDate = addYears(prevDate, -1);
      const dates = getYearDates(newDate);
      onDateChange(dates);
      return newDate;
    });
  };

  const nextYear = () => {
    setSelectedDate((prevDate) => {
      const newDate = addYears(prevDate, 1);
      const dates = getYearDates(newDate);
      onDateChange(dates);
      return newDate;
    });
  };

  const canGoNext = isBefore(
    startOfYear(selectedDate),
    startOfYear(currentDate)
  );

  // Initialize with current year's dates
  React.useEffect(() => {
    const dates = getYearDates(selectedDate);
    onDateChange(dates);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="h-[50px] max-w-[500px] min-w-[500px] bg-white rounded-lg shadow-sm flex items-center justify-between px-4">
        <button
          onClick={previousYear}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-bold text-green-600 text-base">
          {formatDisplayDate(selectedDate)}
        </span>

        <button
          onClick={nextYear}
          disabled={!canGoNext}
          className={`p-2 rounded-full ${
            canGoNext ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default YearPicker;