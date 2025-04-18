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
} from "@mui/material";
import { FaTrash, FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdExpandMore } from "react-icons/md";
import APICall from "@/networkUtil/APICall";
import { contract } from "@/networkUtil/Constants";

import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import Dropdown from "@/components/generic/dropDown";

const ServiceProduct = ({ quote }) => {
  const api = new APICall();
  const rows = quote?.quote_services || [];

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
    // Pre-fill the fields with current values
    setEditNoOfServices(row?.no_of_services || "");
    setEditJobType(row?.job_type || "");
    setEditRate(row?.rate || "");

    // Calculate duration in months (12 / no_of_services)
    const duration = row?.no_of_services / quote?.duration_in_months;
    setEditDurationInMonths(duration);

    setSelectedServiceType(row?.job_type || "");
    setOpenEditModal(true);
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

  const handleEditSave = async () => {
    if (!selectedRow) return;

    try {
      // Format the data for the update API
      const data = {
        quote_service_id: selectedRow.id,
        no_of_services: editNoOfServices,
        job_type: selectedServiceType,
        rate: editRate,
      };

      // Make API call to update the service
      const response = await api.postDataToken(
        `${contract}/service/update`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service has been updated successfully!",
        });
        setOpenEditModal(false);
        window.location.reload();
      } else {
        throw new Error(response.error?.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      // Add user feedback for error
    }
  };

  const handleDateChange = (name, value) => {
    setSelectedDate(value);
  };

  return (
    <div className={styles.clientRecord}>
      <div className={styles.clientHead}>Service Product</div>

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
                <TableCell align="center">{row.service_cancel_reason || "No Cancel Yet"}</TableCell>
                <TableCell align="center">{row.service_cancelled_at || "No"}</TableCell>
                <TableCell align="center">{row.sub_total}</TableCell>
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
          <div className="flex gap-4">
            <InputWithTitle
              title="Jobs Per Month"
              value={editDurationInMonths}
              disabled={true}
              type="text"
            />
          </div>

          {/* Separate input fields for Duration and Remaining Months */}
          <div className="flex gap-4">
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

          {/* Job Type at the top */}
          <Dropdown
            title="Service Type"
            options={["Quarterly", "Monthly"]}
            value={selectedServiceType}
            onChange={(value) => setSelectedServiceType(value)}
          />

          <InputWithTitle
            title="No. of Services"
            value={editNoOfServices}
            onChange={setEditNoOfServices}
            type="text"
          />

          <InputWithTitle
            title="Rate"
            value={editRate}
            onChange={setEditRate}
            type="text"
          />

          {/* Date filter below */}
          <InputWithTitle3
            title="Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceProduct;
