import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker"; // For custom range selection
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import styles from "../../styles/dateFilter.module.css";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  format,
} from "date-fns";

const DateFilters2 = ({ onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("This Month");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("This Month");
  const [customRange, setCustomRange] = useState(false);

  const handleOptionClick = (option) => {
    const today = new Date();
    let start, end;

    switch (option) {
      case "This Month":
        start = startOfMonth(today);
        end = endOfMonth(today);
        setCustomRange(false);
        break;

      case "Last Month":
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        setCustomRange(false);
        break;

      case "This Week":
        start = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
        end = endOfWeek(today, { weekStartsOn: 1 });
        setCustomRange(false);
        break;

      case "Custom Range":
        setCustomRange(true);
        start = null;
        end = null;
        break;

      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedOption(option);
    setTitle(option);

    if (onDateChange && start && end) {
      // Format dates consistently
      const formattedStart = format(start, "yyyy-MM-dd");
      const formattedEnd = format(end, "yyyy-MM-dd");
      onDateChange(formattedStart, formattedEnd);
    }

    setAnchorEl(null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    handleOptionClick("This Month");
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCustomRangeSubmit = () => {
    if (startDate && endDate && onDateChange) {
      onDateChange(startDate, endDate);
    }
    setTitle(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );
    setAnchorEl(null);
    setCustomRange(false);
  };

  return (
    <div>
      <button onClick={handleClick} className={styles.filterButton}>
        {title}
      </button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div className={styles.popoverContent}>
          {["This Month", "Last Month", "This Week", "Custom Range"].map(
            (option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`${styles.option} ${
                  selectedOption === option ? styles.selected : ""
                }`}
              >
                {option}
              </div>
            )
          )}
          {customRange && (
            <div className={styles.customRangeContainer}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className={styles.datePicker}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                className={styles.datePicker}
              />
              <button
                onClick={handleCustomRangeSubmit}
                className={styles.customRangeSubmitButton}
                disabled={!startDate || !endDate}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

DateFilters2.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default DateFilters2;
