"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const AssignmentModal = ({
  open,
  onClose,
  invoiceId,
  salesManagers,
  onAssign,
  onRefresh,
}) => {
  const api = new APICall();
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const obj = {
      invoice_id: invoiceId,
      recovery_officer_id: selectedManager,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/invoice/assign`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        }).then(() => {
          onClose(); // Close modal
          onRefresh(); // Call a refresh function instead of window.location.reload()
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="assignment-modal-title"
      aria-describedby="assignment-modal-description"
    >
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="assignment-modal-title" variant="h6" component="h2">
            Assign Invoice
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Sales Manager
          </Typography>
          <Select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select a manager</em>
            </MenuItem>
            {salesManagers?.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedManager || loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Assign"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignmentModal;
