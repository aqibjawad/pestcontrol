import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";

const ContractCancelModal = ({ open, onClose, quoteData }) => {
  const api = new APICall();
  const [contract_cancel_reason, setContrCancel] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added missing state

  // Make sure quoteData exists and has quote_services
  const idAsString = quoteData?.quote_services?.[0]?.id?.toString() || "";

  const handleCancelChange = (e) => {
    setContrCancel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract_cancel_reason.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide a reason for cancellation",
      });
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    const obj = {
      contract_cancel_reason,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${quotation}/move/cancel/${quoteData?.id}`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Quote has been cancelled successfully!",
        });
        setContrCancel(""); // Reset the form
        onClose(); // Close the modal
        window.location.reload(); // Consider using a less disruptive update method
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error?.message || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during cancellation.",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Quote Cancellation</DialogTitle>

      <DialogContent>
        <div className="mb-4 mt-4">
          <TextField
            type="text"
            label="Cancellation Reason"
            value={contract_cancel_reason}
            onChange={handleCancelChange}
            disabled={loading}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading || !contract_cancel_reason.trim()}
        >
          {loading ? <CircularProgress size={24} /> : "Cancel Quote"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractCancelModal;
