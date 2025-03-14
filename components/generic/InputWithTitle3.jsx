import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const InputWithTitle3 = ({
  title,
  type,
  value,
  onChange,
  name = "name",
  className = "",
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(
    value ? parseISO(value) : new Date()
  );

  // States for custom dropdowns
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const handleDateChange = (date) => {
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    onChange(name, formattedDate);
    setOpen(false);
  };

  const formatDisplayDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = parseISO(dateString);
      return format(date, "PPP");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const isValidDate = (dateString) => {
    try {
      parseISO(dateString);
      return true;
    } catch {
      return false;
    }
  };

  // Generate array of years (from 10 years ago to 10 years in the future)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Array of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(monthIndex);
    setCalendarDate(newDate);
    setMonthDropdownOpen(false);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(parseInt(year));
    setCalendarDate(newDate);
    setYearDropdownOpen(false);
  };

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      <div className="relative">
        {type === "date" ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  value ? "text-gray-900" : "text-gray-500"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value && isValidDate(value) ? (
                  formatDisplayDate(value)
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 z-50"
              align="start"
              side="bottom"
              sideOffset={4}
              style={{ zIndex: 9999 }}
            >
              <div className="p-2 flex items-center justify-between space-x-2 bg-gray-50 border-b">
                {/* Custom Month Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-32 justify-between"
                    onClick={() => {
                      setMonthDropdownOpen(!monthDropdownOpen);
                      setYearDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{months[calendarDate.getMonth()]}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                  {monthDropdownOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="max-h-60 overflow-auto">
                        {months.map((month, index) => (
                          <button
                            key={month}
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                            onClick={() => handleMonthChange(index)}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Year Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-24 justify-between"
                    onClick={() => {
                      setYearDropdownOpen(!yearDropdownOpen);
                      setMonthDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{calendarDate.getFullYear()}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                  {yearDropdownOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-24 rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="max-h-60 overflow-auto">
                        {years.map((year) => (
                          <button
                            key={year}
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                            onClick={() => handleYearChange(year)}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Calendar
                mode="single"
                selected={value ? parseISO(value) : undefined}
                onSelect={handleDateChange}
                initialFocus
                month={calendarDate}
                onMonthChange={setCalendarDate}
                className="rounded-md border shadow-md bg-white"
                // Hide the default navigation since we're providing our own
                components={{
                  IconLeft: () => null,
                  IconRight: () => null,
                }}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
            {...rest}
          />
        )}
      </div>
    </div>
  );
};

// ChevronDown icon component
const ChevronDown = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default InputWithTitle3;
