import React, { useState } from "react";
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
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { FaTrash, FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import APICall from "@/networkUtil/APICall";
import { contract } from "@/networkUtil/Constants";

const ServiceProduct = ({ quote }) => {
  const api = new APICall();
  const rows = quote?.quote_services || [];

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditValue(row?.no_of_services || ""); // Set the initial value to be edited
    setOpenEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    try {
      setIsDeleting(true);

      // Format the data exactly as required by the API
      const data = {
        quote_id: quote.id, // Make sure this is a number (not string)
        quote_service_ids: [Number(selectedRow.id)], // Ensure this is an array of numbers
      };

      // Try sending as raw JSON instead of form data
      const response = await api.postDataToken(
        `${contract}/service/remove`,
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
          text: "Contract has been created successfully!",
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

  const handleEditSave = () => {
    // Call your update API or logic here using selectedRow.id and editValue
    console.log("Editing:", selectedRow, "New value:", editValue);
    setOpenEditModal(false);
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
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service product?
          </DialogContentText>
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

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit No. of Services</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="No. of Services"
            type="number"
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
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
