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

const JobsList = ({
  checkedServices,
  setFormData,
  formData,
  updateSubTotal,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [noOfMonth, setNoOfMonth] = useState("");
  const [rate, setRate] = useState("100"); // Set a default value for rate, e.g., "100"
  const [open, setOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  // Calculate subtotal whenever selected dates or noOfMonth changes
  useEffect(() => {
    const total = selectedDates.length * (parseFloat(noOfMonth) || 0);
    setSubTotal(total);
    updateSubTotal(total); // Call the parent function to update the subtotal
  }, [selectedDates, noOfMonth]);

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
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) => {
        if (service.id === selectedProduct.id) {
          return {
            ...service,
            detail: [
              {
                job_type: selectedJobType,
                rate: rate, // Send rate to the backend
                dates: selectedDates,
              },
            ],
          };
        }
        return service;
      }),
    }));
    setOpen(false);
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobType(value);
    if (["one_time", "yearly", "monthly", "weekly", "custom", "daily"].includes(value)) {
        setOpen(true);
        if (value === "daily") {
            const today = new Date().toISOString().slice(0, 10);
            setSelectedDates([today]); // Automatically select today's date
        }
    }
};


  const isDateSelectable = (date) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // If daily, only allow today
    if (selectedJobType === "daily") {
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }

    // For monthly, allow dates only in the current month
    if (selectedJobType === "monthly") {
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    }

    return true; // Allow all dates for other job types
  };

  const onChange = (key, value) => {
    setSelectedProduct({ ...selectedProduct, [key]: value });
  };

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) =>
      new Date(date).toISOString().slice(0, 10)
    );
    setSelectedDates(formattedDates); // Update the selected dates here
  };

  const getServices = (services, product) => {
    if (!services.length) return [product];

    const isUpdated = services.find(({ id }) => id === product.id);
    if (isUpdated) {
      return services.map((d) => {
        if (d.id === product.id) {
          return product;
        }
        return d;
      });
    }
    return [...services, product];
  };

  const setProduct = (product) => {
    const updatedService = {
      ...product,
      detail: [
        {
          job_type: selectedJobType,
          rate: rate,
          dates: selectedDates,
        },
      ],
      isChecked: true,
    };

    setSelectedProduct(product); // Set selectedProduct
    setFormData((prev) => ({
      ...prev,
      services: getServices(prev.services, updatedService),
    }));
  };

  const handleDropdownChange = (value) => {
    const product = checkedServices.find((service) => service.id === value);
    setProduct(product);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ marginTop: "1rem" }}>
          <Grid container spacing={2}>
            <Grid lg={3} item xs={4}>
              <Dropdown
                title={"Selected Products"}
                options={checkedServices.map((service) => ({
                  label: service.pest_name,
                  value: service.id,
                }))}
                value={selectedProduct?.id || ""}
                onChange={handleDropdownChange}
              />
            </Grid>

            <Grid lg={3} item xs={4}>
              <InputWithTitle
                title={"No of Month"}
                type={"text"}
                name="noOfMonth"
                placeholder={"No of Month"}
                onChange={(value) => {
                  setNoOfMonth(value); // Update noOfMonth state
                }}
              />
            </Grid>

            <Grid lg={3} item xs={4}>
              <Dropdown
                title={"Job Type"}
                options={jobTypes}
                onChange={(value) => {
                  handleJobTypeChange(value);
                  onChange("job_type", value);
                }}
              />
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Dates</DialogTitle>
                <DialogContent>
                  <CalendarComponent
                    initialDates={selectedDates.map((date) => new Date(date))}
                    onDateChange={(value) => {
                      handleDateChange(value);
                      onChange(
                        "dates",
                        value.map((date) =>
                          new Date(date).toISOString().slice(0, 10)
                        )
                      );
                    }}
                    isDateSelectable={isDateSelectable} // Pass the function to filter selectable dates
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
                value={rate} // Display the default rate value
                onChange={(value) => {
                  setRate(value); // Update rate for backend submission
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <InputWithTitle
                title={"Sub Total"}
                type={"text"}
                name="subTotal"
                placeholder={"Sub Total"}
                value={subTotal} // Display subtotal here
                readOnly
              />
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
              <div>{selectedProduct.term_and_conditions}</div>
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
