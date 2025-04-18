"use client";
import React, { useState } from "react";
import styles from "../../styles/generics/inputStyles.module.css";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const InputWithTitle2 = ({
  title,
  type,
  value,
  placeholder,
  onChange,
  readOnly = false,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (date) => {
    if (onChange) {
      onChange("name", format(date, "yyyy-MM-dd"));
    }
    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        {type === "date" ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${styles.inputField}`}
                disabled={readOnly} // Disable the button if readOnly
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? (
                  format(new Date(value), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            {!readOnly && (
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            )}
          </Popover>
        ) : (
          <input
            value={value}
            type={type}
            className={`w-full ${styles.inputField}`}
            placeholder={placeholder}
            onChange={(e) =>
              onChange && onChange(e.target.name, e.target.value)
            }
            readOnly={readOnly}
            {...rest}
          />
        )}
      </div>
    </div>
  );
};

export default InputWithTitle2;
