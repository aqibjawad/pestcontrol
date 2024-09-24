"use client";

import React, { useState, useEffect } from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import CalendarComponent from "./calender.component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

const JobsList = ({ checkedServices }) => {
  const [noOfMonth, setNoOfMonth] = useState("");
  const [rate, setRate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [subTotal, setSubTotal] = useState(0); // State for subtotal

  useEffect(() => {
    // Calculate subtotal whenever selected dates or rate changes
    const total = selectedDates.length * (parseFloat(rate) || 0);
    setSubTotal(total);
  }, [selectedDates, rate]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const jobTypes = [
    { label: "One Time", value: "one_time" },
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Custom", value: "custom" },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateSave = () => {
    setOpen(false);
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (["one_time", "yearly", "monthly"].includes(value)) {
      setOpen(true);
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleDropdownChange = (value) => {
    const product = checkedServices.find((service) => service.id === value);
    setSelectedProduct(product);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ marginTop: "1rem" }}>
          <Grid container spacing={2}>
            <Grid lg={2} item xs={4}>
              <Dropdown
                title={"Selected Products"}
                options={checkedServices.map((service) => ({
                  label: service.pest_name,
                  value: service.id,
                }))}
                onChange={handleDropdownChange}
              />
            </Grid>

            <Grid lg={2} item xs={4}>
              <InputWithTitle
                title={"No of Month"}
                type={"text"}
                name="noOfMonth"
                placeholder={"No of Month"}
                onChange={setNoOfMonth}
              />
            </Grid>

            <Grid lg={2} item xs={4}>
              <Dropdown
                title={"Job Type"}
                options={jobTypes}
                onChange={handleJobTypeChange}
              />
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Dates</DialogTitle>
                <DialogContent>
                  <CalendarComponent
                    onDateChange={handleDateChange}
                    initialDates={selectedDates}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleDateSave}>Save Dates</Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid item xs={2}>
              <InputWithTitle
                title={"Rate"}
                type={"text"}
                name="rate"
                placeholder={"Rate"}
                onChange={setRate}
              />
            </Grid>

            <Grid item xs={3}>
              <InputWithTitle
                title={"Sub Total"}
                type={"text"}
                name="subTotal"
                placeholder={"Sub Total"}
                value={subTotal} // Set the calculated subtotal here
                readOnly // Make it read-only
              />
            </Grid>

            <Grid className="mt-10" item xs={1}>
              <Button variant="outlined" color="error">
                Delete
              </Button>
            </Grid>
          </Grid>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <div
            style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}
          >
            {selectedDates.length > 0 ? (
              <>
                Selected Dates: {selectedDates.join(", ")}
                <Button
                  variant="outlined"
                  size="small"
                  style={{ marginLeft: "10px" }}
                  onClick={() => setOpen(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              "No dates selected"
            )}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #D0D5DD",
            width: "100%",
            padding: "30px",
            marginTop: "1rem",
          }}
        >
          <div style={{ color: "#344054", marginTop: "1rem" }}>
            {selectedProduct ? (
              <>
                <div>{selectedProduct.term_and_conditions}</div>
              </>
            ) : (
              <div>No product selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;
