"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";
import CircularProgress from "@mui/material/CircularProgress";
import { adminn } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import APICall from "@/networkUtil/APICall";

const CashBalanceModal = ({ open, onClose }) => {
  const api = new APICall();
  const [cash_amt, setCashAmt] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleInputChange = (name, value) => {
    setCashAmt(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      cash_amt,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${adminn}/cash_balance/add`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        onClose();
        setCashAmt("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during submission.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open} // Use the `open` prop passed from the parent component
      onClose={onClose} // Use the `onClose` prop for closing the modal
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add Cash Balance
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <InputWithTitle3
              title="Add Cash Balance"
              type="text"
              value={cash_amt}
              onChange={handleInputChange}
              name="cash_amt"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <GreenButton
          onClick={handleSubmit}
          title={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )
          }
          disabled={loadingSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default CashBalanceModal;
