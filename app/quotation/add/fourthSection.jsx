"use client";

import React, { useState } from "react";
import styles from "../../../styles/quotes.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import CalendarComponent from "./calender.component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const Section = ({
  noOfMonth,
  handleNoOfMonth,
  contractedList,
  jobTypeList,
  selectedJobType,
  setSelectedJobType,
  open,
  setOpen,
  dateArray,
  selectedDates,
  handleDateChange,
  daySelection,
  setDaySelection,
  handleDaySelectionChange,
  customInput,
  setCustomInput,
  handleClose,
  handleDateSave,
  savedDates,
  formatDate,
}) => {
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
    <div style={{ marginBottom: "2rem" }}>
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
              onChange={setSelectedJobType}
            />
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {daySelection ? "Select Day" : "Select Dates"}
            </DialogTitle>
            <DialogContent>
              {["Daily", "Monthly", "Weekly"].includes(selectedJobType) ? (
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
            {savedDates.join(", ")}
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

const FourthSection = () => {
  const [sections, setSections] = useState([{
    noOfMonth: "",
    selectedJobType: null,
    selectedDates: [],
    savedDates: [],
    open: false,
    daySelection: false,
    customInput: "",
  }]); // Initial section

  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      {
        noOfMonth: "",
        selectedJobType: null,
        selectedDates: [],
        savedDates: [],
        open: false,
        daySelection: false,
        customInput: "",
      }
    ]);
  };

  const handleNoOfMonth = (index, e) => {
    const newSections = [...sections];
    newSections[index].noOfMonth = e.target.value;
    setSections(newSections);
  };

  const handleJobTypeChange = (index, jobType) => {
    const newSections = [...sections];
    newSections[index].selectedJobType = jobType;
    if (
      ["Monthly", "Daily", "Weekly"].includes(jobType)
    ) {
      newSections[index].open = true;
    } else {
      newSections[index].open = false;
    }
    setSections(newSections);
  };

  const handleDateChange = (index, date) => {
    const newSections = [...sections];
    if (newSections[index].selectedDates.includes(date)) {
      newSections[index].selectedDates = newSections[index].selectedDates.filter(d => d !== date);
    } else {
      newSections[index].selectedDates.push(date);
    }
    setSections(newSections);
  };

  const handleDaySelectionChange = (index, day) => {
    const newSections = [...sections];
    if (newSections[index].selectedDates.includes(day)) {
      newSections[index].selectedDates = newSections[index].selectedDates.filter(d => d !== day);
    } else {
      newSections[index].selectedDates.push(day);
    }
    setSections(newSections);
  };

  const handleClose = (index) => {
    const newSections = [...sections];
    newSections[index].open = false;
    setSections(newSections);
  };

  const handleDateSave = (index) => {
    const newSections = [...sections];
    if (newSections[index].selectedJobType === "Custom") {
      const customDates = newSections[index].selectedDates.map(
        (date) => `${formatDate(date)} (${newSections[index].customInput})`
      );
      newSections[index].savedDates = customDates.slice();
    } else {
      const formattedDates = newSections[index].selectedDates.map((date) => formatDate(date));
      newSections[index].savedDates = formattedDates.slice();
    }
    newSections[index].selectedDates = [];
    newSections[index].open = false;
    setSections(newSections);
  };

  const formatDate = (date) => {
    return new Date(date).toDateString();
  };

  const jobTypeList = ["One Time", "Yearly", "Monthly", "Daily", "Weekly", "Custom"];
  const dateArray = [...Array(31).keys()].map((n) => n + 1); // Create array of numbers 1 to 31

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
      {sections.map((section, index) => (
        <Section
          key={index}
          noOfMonth={section.noOfMonth}
          handleNoOfMonth={(e) => handleNoOfMonth(index, e)}
          contractedList={[]}
          jobTypeList={jobTypeList}
          selectedJobType={section.selectedJobType}
          setSelectedJobType={(jobType) => handleJobTypeChange(index, jobType)}
          open={section.open}
          setOpen={(open) => {
            const newSections = [...sections];
            newSections[index].open = open;
            setSections(newSections);
          }}
          dateArray={dateArray}
          selectedDates={section.selectedDates}
          handleDateChange={(date) => handleDateChange(index, date)}
          daySelection={section.daySelection}
          setDaySelection={(daySelection) => {
            const newSections = [...sections];
            newSections[index].daySelection = daySelection;
            setSections(newSections);
          }}
          handleDaySelectionChange={(day) => handleDaySelectionChange(index, day)}
          customInput={section.customInput}
          setCustomInput={(value) => {
            const newSections = [...sections];
            newSections[index].customInput = value;
            setSections(newSections);
          }}
          handleClose={() => handleClose(index)}
          handleDateSave={() => handleDateSave(index)}
          savedDates={section.savedDates}
          formatDate={formatDate}
        />
      ))}

      <div className={styles.divBtn}>
        <div
          className={styles.addServices}
          onClick={addSection}
        >
          Add Services
        </div>
      </div>
    </div>
  );
};

export default FourthSection;
