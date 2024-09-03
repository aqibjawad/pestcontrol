"use client";

import React, { useState } from "react";

import styles from "../../styles/loginStyles.module.css";

import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import CalendarComponent from "./calender.component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ServiceProduct = () => {
  const [noOfMonth, setNoOfMonth] = useState("");
  const [contractedList, setContractedList] = useState([]);
  const [jobTypeList, setJobTypeList] = useState([
    "One Time",
    "Yearly",
    "Monthly",
    "Daily",
    "Weekly",
    "Custom",
  ]);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [savedDates, setSavedDates] = useState([]);
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [dateArray, setDateArray] = useState([]); // Array to hold numbers 1 to 31
  const [daySelection, setDaySelection] = useState(false); // State for day-wise selection
  const [customInput, setCustomInput] = useState(""); // State for custom input

  const handleNoOfMonth = (e) => {
    setNoOfMonth(e);
  };

  const handleJobTypeChange = (name, index) => {
    setSelectedJobType(name);
    if (
      name === "One Time" ||
      name === "Yearly" ||
      name === "Monthly" ||
      name === "Daily" ||
      name === "Custom"
    ) {
      if (name === "Monthly" || name === "Daily") {
        setDateArray([...Array(31).keys()].map((n) => n + 1)); // Create array of numbers 1 to 31
      }
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleDaySelectionChange = (day) => {
    setSelectedDates((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateSave = () => {
    if (selectedJobType === "Custom") {
      const customDates = selectedDates.map(
        (date) => `${formatDate(date)} (${customInput})`
      );
      setSavedDates(customDates.slice());
    } else {
      const formattedDates = selectedDates.map((date) => formatDate(date));
      setSavedDates(formattedDates.slice());
    }
    setSelectedDates([]);
    setOpen(false);
  };

  const formatDate = (date) => {
    return new Date(date).toDateString();
  };

  // Format saved dates
  const formattedDates = savedDates.join(", ");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div
      className={styles.userFormContainer}
      style={{
        fontSize: "16px",
        margin: "auto",
        border: "1px solid #EAECF0",
        padding: "20px",
        marginTop: "2rem",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div className="mt-10" style={{ width: "25%" }}>
          <Dropdown title={"Service Product"} options={contractedList} />
        </div>

        <div className="mt-10" style={{ width: "35%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputWithTitle
              title={"No of Month"}
              type={"text"}
              name="noOfMonth"
              placeholder={"No of Month"}
              value={noOfMonth}
              onChange={handleNoOfMonth}
            />
            <Dropdown
              title={"Job Type"}
              options={jobTypeList}
              onChange={handleJobTypeChange}
            />
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {daySelection ? "Select Day" : "Select Dates"}
            </DialogTitle>
            <DialogContent>
              {selectedJobType === "Monthly" || selectedJobType === "Daily" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "10px",
                      gap: "10px",
                      fontSize: "10px",
                    }}
                  >
                    <Button
                      variant={daySelection ? "outlined" : "contained"}
                      onClick={() => setDaySelection(false)}
                    >
                      Date-wise
                    </Button>
                    <Button
                      variant={daySelection ? "contained" : "outlined"}
                      onClick={() => setDaySelection(true)}
                    >
                      Day-wise
                    </Button>
                  </div>
                  {daySelection ? (
                    <div>
                      {["1st Week", "2nd Week", "3rd Week", "4th Week"].map(
                        (week, index) => (
                          <div key={index} style={{ marginBottom: "10px" }}>
                            <div>{week}</div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                width: "573px",
                              }}
                            >
                              {daysOfWeek.map((day, i) => (
                                <Button
                                  style={{ fontSize: "12px" }}
                                  key={i}
                                  variant={
                                    selectedDates.includes(`${week}-${day}`)
                                      ? "contained"
                                      : "outlined"
                                  }
                                  onClick={() =>
                                    handleDaySelectionChange(`${week}-${day}`)
                                  }
                                >
                                  {day}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                      }}
                    >
                      {dateArray.map((date, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedDates.includes(date)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleDateChange(date)}
                        >
                          {date}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <CalendarComponent onDateChange={handleDateChange} />
                  {selectedJobType === "Custom" && (
                    <InputWithTitle
                      title={"Custom Input"}
                      type={"text"}
                      name="customInput"
                      placeholder={"Enter custom data"}
                      value={customInput}
                      onChange={setCustomInput}
                    />
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleDateSave}>Save Dates</Button>
            </DialogActions>
          </Dialog>
        </div>

        <div className="mt-10" style={{ width: "15%" }}>
          <InputWithTitle
            title={"Rate"}
            type={"text"}
            name="name"
            placeholder={"Rate"}
          />
        </div>

        <div className="mt-10" style={{ width: "25%" }}>
          <InputWithTitle
            title={"Sub Total"}
            type={"text"}
            name="firmName"
            placeholder={"Sub Total"}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10rem", marginTop: "1rem" }}>
        <div className="mt-10">
          <div
            style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}
          >
            {formattedDates}
          </div>
        </div>
      </div>

      <div
        className="mt-5"
        style={{ border: "1px solid #D0D5DD", width: "100%", padding: "30px" }}
      >
        <div style={{ color: "#344054" }}>. Flies</div>

        <div className="mt-5" style={{ color: "#344054" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>
    </div>
  );
};

export default ServiceProduct;
