import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
              <Calendar
                mode="single"
                selected={value ? parseISO(value) : undefined}
                onSelect={handleDateChange}
                initialFocus
                className="rounded-md border shadow-md bg-white"
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

export default InputWithTitle3;