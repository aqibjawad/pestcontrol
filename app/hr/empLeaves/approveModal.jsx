"use client";

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";

const ApproveModal = ({ open, handleClose, employee, handleApprove }) => {
  const [formData, setFormData] = useState({
    start_date: employee?.start_date || "",
    end_date: employee?.end_date || "",
    total_days: employee?.total_days || "",
    remarks: "",
  });

  // Handle input change for regular inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input change for InputWithTitle3 component
  const handleCustomInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Submit function
  const handleSubmit = () => {
    handleApprove(employee.id, formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="bg-white p-6 rounded-md shadow-lg w-[400px] mx-auto mt-20">
        <h2 className="text-lg font-semibold mb-4">Approve Request</h2>
        <InputWithTitle3
          title="Start Date"
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleCustomInputChange}
          className="mb-3"
        />
        <InputWithTitle3
          title="End Date"
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleCustomInputChange}
          className="mb-3"
        />
        <InputWithTitle3
          title="Total Days"
          type="number"
          name="total_days"
          value={formData.total_days}
          onChange={handleCustomInputChange}
          className="mb-3"
        />
        <TextField
          fullWidth
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
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

export default ApproveModal;
