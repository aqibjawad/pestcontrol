import React, { useState, useEffect } from "react";
import styles from "../../styles/viewQuote.module.css";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { FaTrash, FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import APICall from "@/networkUtil/APICall";
import { contract } from "@/networkUtil/Constants";

import InputWithTitle from "@/components/generic/InputWithTitle";
import Swal from "sweetalert2";
import Dropdown from "@/components/generic/dropDown";
import AddService from "./addService";

import CalendarComponent from "./calander";

const ServiceProduct = ({ quote }) => {
  const api = new APICall();
  const rows = quote?.quote_services || [];

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [remainingMonths, setRemainingMonths] = useState(0);
  const [serviceDates, setServiceDates] = useState([]);

  const [deleteReason, setDeleteReason] = useState();

  // Edit values
  const [editNoOfServices, setEditNoOfServices] = useState("");
  const [editJobType, setEditJobType] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editDurationInMonths, setEditDurationInMonths] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isNoOfServicesDisabled, setIsNoOfServicesDisabled] = useState(false);
  const [editNoOfJobs, setEditNoOfJobs] = useState("");

  // Time selection states
  const [selectedHour, setSelectedHour] = useState("02");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedAmPm, setSelectedAmPm] = useState("PM");

  // Calculate remaining months and filter service dates when a row is selected
  useEffect(() => {
    if (selectedRow) {
      calculateRemainingMonths();

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      const currentAndFutureDates = selectedRow.quote_service_dates.filter(
        (dateObj) => {
          const serviceDate = new Date(dateObj.service_date);
          // Include dates from the current month onward
          return (
            serviceDate.getMonth() >= today.getMonth() &&
            serviceDate.getFullYear() >= today.getFullYear()
          );
        }
      );

      setServiceDates(currentAndFutureDates);
    }
  }, [selectedRow]);

  // Handle service type change
  useEffect(() => {
    if (selectedServiceType === "Quarterly") {
      // Calculate the number of services for quarterly (remaining months / 3)
      const quarterlyServices = Math.ceil(remainingMonths / 3);
      setEditNoOfServices(quarterlyServices.toString());
      setIsNoOfServicesDisabled(true);

      // For Quarterly, set No. of Jobs equal to No. of Services
      setEditNoOfJobs(quarterlyServices.toString());
    } else if (selectedServiceType === "Monthly") {
      // Empty the no. of services field for monthly
      setEditNoOfServices("");
      setIsNoOfServicesDisabled(false);
      setEditNoOfJobs("");
    }
  }, [selectedServiceType, remainingMonths]);

  // Calculate No. of Jobs when No. of Services changes
  useEffect(() => {
    if (editNoOfServices && !isNaN(editNoOfServices)) {
      if (selectedServiceType === "Quarterly") {
        // For Quarterly, No. of Jobs equals No. of Services
        setEditNoOfJobs(editNoOfServices);
      } else {
        // For Monthly, calculate as before: No. of Jobs = No. of Services * Remaining Months
        const noOfJobs = parseInt(editNoOfServices) * remainingMonths;
        setEditNoOfJobs(noOfJobs.toString());
      }
    } else {
      setEditNoOfJobs("");
    }
  }, [editNoOfServices, remainingMonths, selectedServiceType]);

  // Function to calculate remaining months (including current month)
  const calculateRemainingMonths = () => {
    if (
      !selectedRow ||
      !selectedRow.quote_service_dates ||
      selectedRow.quote_service_dates.length === 0
    ) {
      setRemainingMonths(0);
      return;
    }

    // Find the last service date
    const lastServiceDate = new Date(
      selectedRow.quote_service_dates[
        selectedRow.quote_service_dates.length - 1
      ].service_date
    );
    const today = new Date();

    // Calculate months difference
    let months = (lastServiceDate.getFullYear() - today.getFullYear()) * 12;
    months += lastServiceDate.getMonth() - today.getMonth();

    // Include current month in the count (add 1)
    months += 1;

    setRemainingMonths(Math.max(0, months));
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    // Pre-fill the fields with current values, but keep No. of Services empty
    setEditNoOfServices(""); // Set this to empty string instead of row?.no_of_services
    setEditJobType(row?.job_type || "");
    setEditRate(row?.rate || "");

    // Calculate duration in months (12 / no_of_services)
    const duration = row?.no_of_services / quote?.duration_in_months;
    setEditDurationInMonths(duration);

    // Reset selected service type to ensure calendar is disabled initially
    setSelectedServiceType("");

    // Set default time (2:30 PM)
    setSelectedHour("02");
    setSelectedMinute("30");
    setSelectedAmPm("PM");

    // Reset edit no of jobs
    setEditNoOfJobs("");

    setOpenEditModal(true);
  };

  const handleAddServiceClick = () => {
    setOpenAddModal(true);
  };

  const handleServiceAdded = () => {
    // Reload data or update the UI
    window.location.reload();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    try {
      setIsDeleting(true);

      // Format the data exactly as required by the API
      const data = {
        quote_id: quote.id, // Make sure this is a number
        services: [
          {
            quote_service_id: Number(selectedRow.id), // Ensure this is a number
            reason: deleteReason || "No reason provided", // You need to collect this reason from user
          },
        ],
      };
      // Try sending as raw JSON instead of form data
      const response = await api.postDataToken(
        `${contract}/service/remove`,
        data
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Contract has been deleted successfully!",
        });
        setOpenDeleteModal(false);
        window.location.reload();
      } else {
        throw new Error(response.error?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      // Consider adding user feedback here
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (selectedRow && serviceDates) {
      // Convert service_date strings to Date objects
      const initialDates = serviceDates.map(
        (date) => new Date(date.service_date)
      );
      setUpdatedServiceDates(initialDates);
    }
  }, [selectedRow, serviceDates]);

  const [updatedServiceDates, setUpdatedServiceDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Convert 12-hour format to 24-hour format for API
  const convertTo24HourFormat = (hour, minute, ampm) => {
    let hourNum = parseInt(hour);

    // Convert to 24-hour format if PM
    if (ampm === "PM" && hourNum < 12) {
      hourNum += 12;
    }
    // Handle 12 AM case (should be 00)
    else if (ampm === "AM" && hourNum === 12) {
      hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, "0")}:${minute}`;
  };

  const handleEditSave = async () => {
    if (!selectedRow) return;

    // Check if dates are selected
    if (!updatedServiceDates || updatedServiceDates.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select at least one service date.",
      });
      return;
    }

    try {
      setIsLoading(true); // Set loading state to true before API call

      // Convert time to 24-hour format
      const timeIn24HourFormat = convertTo24HourFormat(
        selectedHour,
        selectedMinute,
        selectedAmPm
      );

      // Determine job type based on selection - MODIFIED HERE
      // Send "custom" to backend when "Quarterly" is selected
      const jobTypeForBackend =
        selectedServiceType === "Quarterly"
          ? "custom"
          : selectedServiceType.toLowerCase();

      // Rest of your code remains the same
      const data = {
        quote_id: quote.id,
        quote_services: [
          {
            quote_service_id: Number(selectedRow.id),
            job_type: jobTypeForBackend, // Using our modified job type value
            rate: parseFloat(editRate),
            no_of_services: parseInt(editNoOfServices),
            no_of_jobs: parseInt(editNoOfJobs), // Add the no_of_jobs field
            dates: updatedServiceDates.map((date) => {
              // Format date as required by the API and include the selected time
              const d = new Date(date);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              return `${year}-${month}-${day} ${timeIn24HourFormat}:00`;
            }),
          },
        ],
      };
      const response = await api.postDataToken(`${contract}/update`, data);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Service updated successfully!",
      });

      setOpenEditModal(false);
      // Refresh your data or perform any other necessary actions
      window.location.reload();
    } catch (error) {
      console.error("Error updating service:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update service. Please try again.",
      });
    } finally {
      setIsLoading(false); // Reset loading state when API call completes
    }
  };

  const handleDateChange = (name, value) => {
    setSelectedDate(value);
  };

  // Generate hour, minute options
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className={styles.clientRecord}>
      <div
        className={styles.clientHead}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Service Product</span>
        <div style={{ cursor: "pointer" }} onClick={handleAddServiceClick}>
          Add Service
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell align="center" style={{ color: "white" }}>
                Sr No
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Service Product
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                No. of Services
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Job Type
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Rate
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Service Cancel Reason
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Service Cancel At
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Sub Total
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Update
              </TableCell>
              <TableCell align="center" style={{ color: "white" }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  {row.service.service_title}
                </TableCell>
                <TableCell align="center">{row.no_of_services}</TableCell>
                <TableCell align="center">{row.job_type}</TableCell>
                <TableCell align="center">{row.rate}</TableCell>
                <TableCell align="center">
                  {row.service_cancel_reason || "Active"}
                </TableCell>
                <TableCell align="center">
                  {row.service_cancelled_at
                    ? new Date(row.service_cancelled_at).toLocaleDateString(
                        "en-GB"
                      )
                    : "No"}
                </TableCell>
                <TableCell align="center">{row.sub_total}</TableCell>

                {!row.service_cancel_reason && (
                  <>
                    <TableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#32A92E",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditClick(row)}
                      >
                        <FaPencil />
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteClick(row)}
                      >
                        <FaTrash />
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <InputWithTitle
            title={"Reason"}
            onChange={setDeleteReason}
            value={deleteReason}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteModal(false)}
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal with InputWithTitle components */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedRow?.service?.service_title}</DialogTitle>
        <DialogContent>
          {/* Separate input fields for Duration and Remaining Months */}
          <div className="flex gap-4">
            <InputWithTitle
              title="Jobs Per Month"
              value={editDurationInMonths}
              disabled={true}
              type="text"
            />

            <InputWithTitle
              title="Duration in Months"
              value={quote?.duration_in_months}
              disabled={true}
              type="text"
            />

            <InputWithTitle
              title="Remaining Months"
              value={`${remainingMonths} months`}
              disabled={true}
              type="text"
            />
          </div>

          <div className="flex gap-4">
            {/* Job Type at the top */}
            <div style={{ width: "600px" }}>
              <Dropdown
                title="Service Type"
                options={["Quarterly", "Monthly"]}
                value={selectedServiceType}
                onChange={(value) => setSelectedServiceType(value)}
              />
            </div>

            <InputWithTitle
              title="No. of Services"
              value={editNoOfServices}
              onChange={(value) => {
                setEditNoOfServices(value);
                // No need for calculation here as it's handled in the useEffect
              }}
              type="text"
              disabled={isNoOfServicesDisabled}
            />

            <InputWithTitle
              title="No. of Jobs"
              value={editNoOfJobs}
              disabled={true}
              type="text"
            />

            <InputWithTitle
              title="Rate"
              value={editRate}
              onChange={setEditRate}
              type="text"
            />
          </div>

          {/* Enhanced Time selection with AM/PM */}
          <div className="mt-4">
            <div
              className={
                styles.timeSelectionContainer || "flex items-center gap-2"
              }
            >
              <p className="mr-2 font-medium">Service Time:</p>

              {/* Hour Selector */}
              <FormControl size="small" style={{ minWidth: 80 }}>
                <Select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                >
                  {hours.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <span className="mx-1">:</span>

              {/* Minute Selector */}
              <FormControl size="small" style={{ minWidth: 80 }}>
                <Select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                >
                  {minutes.map((minute) => (
                    <MenuItem key={minute} value={minute}>
                      {minute}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* AM/PM Selector */}
              <FormControl size="small" style={{ minWidth: 80, marginLeft: 8 }}>
                <Select
                  value={selectedAmPm}
                  onChange={(e) => setSelectedAmPm(e.target.value)}
                >
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </Select>
              </FormControl>

              {/* Display selected time */}
              <Box ml={2} display="flex" alignItems="center">
                <span className="text-gray-600">
                  ({selectedHour}:{selectedMinute} {selectedAmPm})
                </span>
              </Box>
            </div>
          </div>

          {/* Date filter below - conditionally rendered based on selectedServiceType */}
          <div className="mt-5">
            {selectedServiceType ? (
              <CalendarComponent
                initialDates={updatedServiceDates || []}
                onDateChange={(dates) => {
                  setUpdatedServiceDates(dates);
                  console.log("Selected dates:", dates);
                }}
                serviceType={selectedServiceType}
                remainingMonths={remainingMonths}
                isDateSelectable={(date) => {
                  return date >= new Date();
                }}
              />
            ) : (
              <div className="p-4 bg-gray-100 text-center rounded">
                Please select a Service Type first to enable date selection
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            color="primary"
            disabled={isLoading || !selectedServiceType}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Service Modal */}
      {openAddModal && (
        <AddService
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          quoteId={quote}
          onServiceAdded={handleServiceAdded}
        />
      )}
    </div>
  );
};

export default ServiceProduct;
