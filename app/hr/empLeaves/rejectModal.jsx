"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { leave } from "@/networkUtil/Constants";

const RejectModal = ({ open, handleClose, employeeId, handleReject }) => {
  const [remarks, setRemarks] = useState("");

  // Submit function
  const handleSubmit = () => {
    handleReject(employeeId, remarks);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="bg-white p-6 rounded-md shadow-lg w-[400px] mx-auto mt-20">
        <h2 className="text-lg font-semibold mb-4">Reject Request</h2>
        <TextField
          fullWidth
          label="Remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          multiline
          rows={3}
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RejectModal;
