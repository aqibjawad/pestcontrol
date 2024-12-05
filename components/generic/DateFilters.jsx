import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import PropTypes from "prop-types";
import styles from "../../styles/dateFilter.module.css";
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  parseISO,
} from "date-fns";

const DateFilters = ({ onOptionChange, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("Today");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    let start, end;
    const today = new Date();

    switch (option) {
      case "today":
        start = format(startOfDay(today), "yyyy-MM-dd");
        end = format(endOfDay(today), "yyyy-MM-dd");
        break;
      case "This Month":
        start = format(startOfMonth(today), "yyyy-MM-dd");
        end = format(endOfMonth(today), "yyyy-MM-dd");
        break;
      case "Last Month":
        const lastMonth = subMonths(today, 1);
        start = format(startOfMonth(lastMonth), "yyyy-MM-dd");
        end = format(endOfMonth(lastMonth), "yyyy-MM-dd");
        break;
      case "This Year":
        start = format(startOfYear(today), "yyyy-MM-dd");
        end = format(endOfYear(today), "yyyy-MM-dd");
        break;
      case "dateRange":
        // Don't set dates here, let the user pick them
        break;
      default:
        console.error("Unknown option selected");
        return;
    }

    setStartDate(start);
    setEndDate(end);
    setTitle(option === "dateRange" ? "Select Date Range" : option);

    if (option !== "dateRange") {
      handleClose();
      if (typeof onDateChange === "function") {
        onDateChange(start, end);
      }
    }
  };

  const handleStartDateChange = (event) => {
    const newDate = event.target.value;
    setStartDate(newDate);

    if (endDate && newDate) {
      updateDateRange(newDate, endDate);
    }
  };

  const handleEndDateChange = (event) => {
    const newDate = event.target.value;
    setEndDate(newDate);

    if (startDate && newDate) {
      updateDateRange(startDate, newDate);
    }
  };

  const updateDateRange = (start, end) => {
    const startFormatted = formatDisplayDate(start);
    const endFormatted = formatDisplayDate(end);
    setTitle(`${startFormatted} - ${endFormatted}`);

    if (typeof onDateChange === "function") {
      onDateChange(start, end);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-filters-popover" : undefined;

  return (
    <div>
      <button
        className={styles.datePicker}
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
      >
        {title}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
          },
        }}
      >
        <div>
          <div
            className={styles.dateItem}
            onClick={() => handleOptionClick("today")}
          >
            Today
          </div>

          <div>
            <div
              className={styles.dateItem}
              style={{ border: "none" }}
              onClick={() => handleOptionClick("This Month")}
            >
              This Month
            </div>
            <div
              className={styles.dateItem}
              style={{ border: "none" }}
              onClick={() => handleOptionClick("Last Month")}
            >
              Last Month
            </div>
          </div>
          <div>
            <div
              className={styles.dateItem}
              style={{ border: "none" }}
              onClick={() => handleOptionClick("This Year")}
            >
              This Year
            </div>
          </div>
          <div
            className={styles.dateItem}
            onClick={() => handleOptionClick("dateRange")}
          >
            Date Range
          </div>
          {selectedOption === "dateRange" && (
            <div className={styles.dateItem}>
              <input
                type="date"
                value={startDate || ""}
                onChange={handleStartDateChange}
              />
              <input
                type="date"
                value={endDate || ""}
                onChange={handleEndDateChange}
              />
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

DateFilters.propTypes = {
  onOptionChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

DateFilters.defaultProps = {
  onOptionChange: () => {},
  onDateChange: () => {},
};

export default DateFilters;
