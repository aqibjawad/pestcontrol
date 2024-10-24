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

const InputWithTitle = ({ title, type, value, onChange, ...rest }) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (date) => {
    onChange(format(date, "yyyy-MM-dd"));
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
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? (
                  format(new Date(value), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <input
            onChange={(e) => onChange(e.target.value)} // Pass the value directly
            className={`w-full ${styles.inputField}`}
            {...rest}
          />
        )}
      </div>
    </div>
  );
};

export default InputWithTitle;
