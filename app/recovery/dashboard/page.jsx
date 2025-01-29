"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { serviceInvoice, getAllEmpoyesUrl } from "@/networkUtil/Constants";

const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [id, setId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentOption, setPaymentOption] = useState("");
  const [promiseDate, setPayLaterDate] = useState(null);
  const [comment, setComment] = useState("");
  const [paid_amt, setPaidAmt] = useState(0);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");

    setId(urlId);

    if (urlId) {
      getAllRecoveries(urlId);
    }
  }, []);

  const getAllRecoveries = async (id) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}/${id}`);
      setQuoteList(response?.data?.assigned_invoices);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleOpenModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaidAmt(invoice.total_amt);
    setOpenModal(true);
    setPaymentOption("");
    setPayLaterDate(null);
    setComment("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInvoice(null);
    setPaidAmt(0);
    setPaymentOption("");
    setPayLaterDate(null);
    setComment("");
  };

  const clearFormState = () => {
    setSelectedInvoice(null);
    setPaidAmt(0);
    setPaymentOption("");
    setPayLaterDate(null);
    setComment("");
    setOpenModal(false);
  };

  const handlePaymentAction = async () => {
    if (!paid_amt || paid_amt <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    setButtonLoading(true);
    try {
      // First handle the payment

      const responseData = {
        invoice_id: selectedInvoice.id,
        recovery_officer_id: id,
        response_type: paymentOption,
        comment: comment,
      };

      const responseSubmission = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/invoice/assign/response`,
        responseData
      );

      if (responseSubmission.status === "success") {
        // After successful payment, automatically submit the response
        const paymentData = {
          service_invoice_id: selectedInvoice.id,
          paid_amt,
          payment_type: "cash",
        };

        const paymentResponse = await api.postFormDataWithToken(
          `${serviceInvoice}/add_payment`,
          paymentData
        );

        if (responseSubmission.status === "success") {
          alert("Payment processed and status updated successfully");
          clearFormState();
          getAllRecoveries(id);
        } else {
          alert(
            responseSubmission.error?.message ||
              "Failed to update payment status"
          );
        }
      } else {
        alert(paymentResponse.error?.message || "Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing the payment");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedInvoice || !paymentOption) {
      alert("Please select a payment option");
      return;
    }

    setButtonLoading(true);

    try {
      const formData = {
        invoice_id: selectedInvoice.id,
        recovery_officer_id: id,
        response_type: paymentOption,
        comment: comment,
      };

      if (paymentOption === "promise" && promiseDate) {
        formData.promise_date = promiseDate.format("YYYY-MM-DD");
      }

      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/invoice/assign/response`,
        formData
      );

      if (response.status === "success") {
        alert("Payment status updated successfully");
        handleCloseModal();
        getAllRecoveries(id);
      } else {
        alert(response.error?.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while updating payment status");
    } finally {
      setButtonLoading(false);
    }
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Service Invoice Id</TableCell>
              <TableCell>User Invoice Id</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              quoteList?.map((quote, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{quote?.user?.name}</TableCell>
                  <TableCell>{quote?.service_invoice_id}</TableCell>
                  <TableCell>{quote?.user_invoice_id}</TableCell>
                  <TableCell>{quote.total_amt}</TableCell>
                  <TableCell>{quote.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(quote)}
                      disabled={quote.status?.toLowerCase() === "paid"}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const modalContent = () => (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 450,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: "10px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Invoice Details
      </Typography>
      {selectedInvoice ? (
        <>
          <Typography>Total Amount: {selectedInvoice.total_amt}</Typography>

          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Select Payment Option:
          </Typography>
          <Select
            fullWidth
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            sx={{ mb: 2 }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select
            </MenuItem>
            <MenuItem value="payment">Payment</MenuItem>
            <MenuItem value="promise">Pay Later</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>

          {paymentOption === "payment" && (
            <TextField
              fullWidth
              type="number"
              label="Payment Amount"
              value={paid_amt}
              onChange={(e) => setPaidAmt(Number(e.target.value))}
              sx={{ mb: 2 }}
              inputProps={{ min: 0, max: selectedInvoice.total_amt }}
            />
          )}

          {paymentOption === "promise" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={promiseDate}
                onChange={(newDate) => setPayLaterDate(newDate)}
                sx={{ mt: 2, width: "100%" }}
              />
            </LocalizationProvider>
          )}

          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Add Comment:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />

          {paymentOption === "payment" ? (
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handlePaymentAction}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Confirm Payment"
              )}
            </Button>
          ) : (
            (paymentOption === "promise" || paymentOption === "other") && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={handleSubmit}
                disabled={buttonLoading}
              >
                {buttonLoading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            )
          )}

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleCloseModal}
            disabled={buttonLoading}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "-4rem" }}
        >
          Recovery Details
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        {modalContent()}
      </Modal>
    </div>
  );
};

export default Page;
