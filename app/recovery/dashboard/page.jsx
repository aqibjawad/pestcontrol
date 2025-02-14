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
  Card,
  CardContent,
  Grid,
  Skeleton,
  Tabs,
  Tab,
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Dropdown2 from "../../../components/generic/DropDown2";

import {
  serviceInvoice,
  getAllEmpoyesUrl,
  bank,
} from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";

import DateFilters from "@/components/generic/DateFilters";

const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

const Page = () => {
  const api = new APICall();

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
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
  const [settlement, setIsSettelemt] = useState(false);
  const [cheque_no, setChequeNo] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = React.useState("cash");

  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSettlementChange = (e) => {
    setIsSettelemt(e.target.checked);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");

    setId(urlId);

    if (urlId) {
      getAllRecoveries(urlId);
    }
  }, [startDate, endDate]);

  const getAllRecoveries = async (id) => {
    setFetchingData(true);
    const queryParams = [];

    queryParams.push(`start_date=${startDate}`);
    queryParams.push(`end_date=${endDate}`);

    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/${id}?${queryParams.join("&")}`
      );
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
          bank_id: selectedBankId,
          service_invoice_id: selectedInvoice.id,
          paid_amt,
          payment_type: paymentMethod,
          cheque_no: cheque_no,
          cheque_date: cheque_date,
          is_settlement: settlement ? 1 : 0,
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
            {fetchingData
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" height={30} width={80} />
                    </TableCell>
                  </TableRow>
                ))
              : quoteList?.map((quote, index) => (
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
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  const bankOptions = allBanksList.map((bank) => ({
    value: bank.id,
    label: bank.bank_name,
  }));

  const getAllBanks = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setAllBankList(response.data);
    } catch (error) {
      console.error("Error fetching Banks:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  const handleBankChange = (selectedValue) => {
    setSelectedBankId(selectedValue);
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
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                  value={paymentMethod}
                  onChange={(e, newValue) => setPaymentMethod(newValue)}
                  variant="fullWidth"
                >
                  <Tab label="Cash" value="cash" />
                  <Tab label="Cheque" value="cheque" />
                </Tabs>
              </Box>

              {paymentMethod === "cash" && (
                <TextField
                  fullWidth
                  type="number"
                  label="Cash Amount"
                  value={paid_amt}
                  onChange={(e) => setPaidAmt(Number(e.target.value))}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 0, max: selectedInvoice.total_amt }}
                />
              )}

              {paymentMethod === "cheque" && (
                <>
                  <Dropdown2
                    onChange={handleBankChange}
                    title="Banks"
                    options={bankOptions}
                    value={selectedBankId}
                  />
                  <div className="mt-3">
                    <TextField
                      fullWidth
                      type="number"
                      label="Cheque Amount"
                      value={paid_amt}
                      onChange={(e) => setPaidAmt(Number(e.target.value))}
                      sx={{ mb: 2 }}
                      inputProps={{ min: 0, max: selectedInvoice.total_amt }}
                    />
                  </div>
                  <InputWithTitle
                    title="Cheque Date"
                    type="date"
                    value={cheque_date}
                    onChange={(value) => setChequeDate(value)}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <InputWithTitle
                      title="Cheque Number"
                      type="text"
                      value={cheque_no}
                      onChange={(value) => setChequeNo(value)}
                    />
                  </LocalizationProvider>
                </>
              )}

              <div className="flex items-center gap-2 mt-10">
                <input
                  type="checkbox"
                  id="settlement"
                  checked={settlement}
                  onChange={handleSettlementChange}
                  className="w-4 h-4"
                />
                <label htmlFor="settlement">Settlement</label>
              </div>
            </>
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

  // Calculate summary statistics
  const summary = quoteList?.reduce(
    (acc, row) => {
      acc.totalAmount += parseFloat(row.total_amt || 0);
      acc.paidAmount += parseFloat(row.paid_amt || 0);
      acc.totalInvoices += 1;
      if (row.status === "paid") acc.paidInvoices += 1;

      const lastHistory =
        row.assigned_histories?.[row.assigned_histories.length - 1];
      if (lastHistory?.promise_date) acc.promiseInvoices += 1;
      if (lastHistory?.other) acc.otherInvoices += 1;

      return acc;
    },
    {
      totalAmount: 0,
      paidAmount: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      promiseInvoices: 0,
      otherInvoices: 0,
    }
  );

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div className="flex justify-between items-center mb-6">
          <div
            style={{
              fontSize: "20px",
              fontFamily: "semibold",
              marginBottom: "1rem",
            }}
          >
            Assigned Invoices
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg mt-8">
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={3}>
            {fetchingData
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Skeleton variant="text" width={120} />
                    </Typography>
                    <Typography variant="h6">
                      <Skeleton variant="text" width={80} />
                    </Typography>
                  </Grid>
                ))
              : [
                  {
                    label: "Total Amount",
                    value: summary?.totalAmount.toFixed(2),
                  },
                  {
                    label: "Paid Amount",
                    value: summary?.paidAmount.toFixed(2),
                  },
                  {
                    label: "Total Invoices",
                    value: summary?.totalInvoices,
                  },
                  {
                    label: "Paid Invoices",
                    value: summary?.paidInvoices,
                  },
                  {
                    label: "Promise Invoices",
                    value: summary?.promiseInvoices,
                  },
                  {
                    label: "Other Invoices",
                    value: summary?.otherInvoices,
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6">{item.value}</Typography>
                  </Grid>
                ))}
          </Grid>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        {modalContent()}
      </Modal>
    </div>
  );
};

export default Page;
