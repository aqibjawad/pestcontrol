import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import PropTypes from "prop-types";
import styles from "../../styles/dateFilter.module.css";

const DateFilters2 = ({ onOptionChange, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("This Month");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("This Month");

  // Set default dates when component mounts
  useEffect(() => {
    handleOptionClick("This Month");
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    let start, end;
    const today = new Date();

    switch (option) {
      case "This Month":
        start = formatDateForInput(
          new Date(today.getFullYear(), today.getMonth(), 1)
        );
        end = formatDateForInput(
          new Date(today.getFullYear(), today.getMonth() + 1, 0)
        );
        break;
      case "Last Month":
        const firstDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        start = formatDateForInput(firstDayLastMonth);
        end = formatDateForInput(lastDayLastMonth);
        break;
      case "This Year":
        start = formatDateForInput(new Date(today.getFullYear(), 0, 1));
        end = formatDateForInput(new Date(today.getFullYear(), 11, 31));
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

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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

DateFilters2.propTypes = {
  onOptionChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

DateFilters2.defaultProps = {
  onOptionChange: () => {},
  onDateChange: () => {},
};

export default DateFilters2;
