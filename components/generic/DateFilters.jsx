import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import styles from "../../styles/dateFilter.module.css";

const DateFilters = ({ onOptionChange, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [title, setTitle] = useState("Date Filter");

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (option !== "dateRange") {
      setStartDate(null);
      setEndDate(null);
      handleClose();
      onOptionChange(option, null, null);
    }
    setTitle(option);
  };

  const handleStartDateChange = (event) => {
    const date = event.target.value;
    setStartDate(date);
    if (startDate !== undefined || endDate !== undefined) {
      onDateChange(startDate, endDate);
    }
  };

  const handleEndDateChange = (event) => {
    const date = event.target.value;
    setEndDate(date);
    if (startDate !== undefined || endDate !== undefined) {
      setTitle(formatDate(startDate) + " - " + formatDate(endDate));
      onDateChange(startDate, endDate);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-filters-popover" : undefined;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", year: "numeric", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  };
  return (
    <div>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        style={{
          color: "#000",
          borderColor: "#f3f3f3",
        }}
      >
        {title}
      </Button>
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
              variant="outlined"
              style={{ border: "none" }}
              onClick={() => handleOptionClick("This Month")}
            >
              This Month
            </div>
          </div>
          <div>
            <div
              className={styles.dateItem}
              variant="outlined"
              style={{ border: "none" }}
              onClick={() => handleOptionClick("This Year")}
            >
              This Year
            </div>
          </div>
          <div className={styles.dateItem}>Date Range</div>
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
        </div>
      </Popover>
    </div>
  );
};

export default DateFilters;
