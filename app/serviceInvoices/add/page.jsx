"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Typography,
} from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { serviceInvoice, bank } from "@/networkUtil/Constants";
import GreenButton from "@/components/generic/GreenButton";
import APICall from "@/networkUtil/APICall";
import Tabs from "./tabs";
import styles from "../../../styles/stock.module.css";
import Dropdown2 from "../../../components/generic/DropDown2";
import withAuth from "@/utils/withAuth";

import { useRouter } from "next/navigation";

import { CircularProgress } from "@mui/material";

import Swal from "sweetalert2";
const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [allInvoiceList, setAllInvoiceList] = useState([]);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [autoFillCheck, setAutoFillCheck] = useState(false);

  // Basic states
  const [id, setId] = useState("");
  const [paid_amt, setPaidAmount] = useState("");
  const [descrp, setDescrp] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [settlement, setIsSettelemt] = useState(false);

  // Bank states
  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  // Payment method specific states
  const [cheque_amount, setChequeAmount] = useState("");
  const [cheque_no, setChequeNo] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [transection_id, setTransactionId] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    getAllBanks();
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllServices(id);
    }
  }, [id]);

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

  const getAllServices = async () => {
    setFetchingData(true);
    try {
      if (id !== "") {
        const response = await api.getDataWithToken(
          `${serviceInvoice}?user_id=${id}`
        );

        setClientName(response.data[0].user.name);
        setAllInvoiceList(response.data);
      }
    } catch (error) {
      console.error("Error fetching Services:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const clearFormState = () => {
    setSelectedInvoiceId(null);
    setSelectedInvoice(null);
    setPaidAmount("");
    setDescrp("");
    setActiveTab("cash");
    setSelectedBankId("");
    setChequeAmount("");
    setChequeNo("");
    setChequeDate("");
    setTransactionId("");
    setShowPaymentForm(false);
  };

  const handleSettlementChange = (e) => {
    setIsSettelemt(e.target.checked);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBankId("");
    setChequeAmount("");
    setChequeNo("");
    setChequeDate("");
    setTransactionId("");
  };

  const handleBankChange = (selectedValue) => {
    setSelectedBankId(selectedValue);
  };

  const handleRadioChange = (invoice) => {
    if (invoice.status !== "paid") {
      setSelectedInvoiceId(invoice.id);
      setSelectedInvoice({
        ...invoice,
        userId: invoice.user.id,
        userName: invoice.user.name,
      });
      setShowPaymentForm(true);
    }
  };

  const createVehicleObject = () => {
    let vehicleObj = {
      service_invoice_id: selectedInvoice.id,
      paid_amt,
      descrp,
      is_settlement: settlement ? 1 : 0,
      payment_type: activeTab,
    };

    if (activeTab === "cheque") {
      vehicleObj = {
        ...vehicleObj,
        bank_id: selectedBankId,
        paid_amt: cheque_amount,
        cheque_amount,
        cheque_no,
        cheque_date,
      };
    } else if (activeTab === "online") {
      vehicleObj = {
        ...vehicleObj,
        bank_id: selectedBankId,
        amount: paid_amt,
        transection_id,
      };
    }

    return vehicleObj;
  };

  const validateForm = async () => {
    if (activeTab === "cash") {
      if (!paid_amt || isNaN(paid_amt) || paid_amt <= 0) {
        await Swal.fire(
          "Validation Error",
          "Please enter a valid payment amount.",
          "error"
        );
        return false;
      }

      if (!descrp.trim()) {
        await Swal.fire(
          "Validation Error",
          "Description is required.",
          "error"
        );
        return false;
      }
    }

    if (activeTab === "cheque") {
      if (!selectedBankId) {
        await Swal.fire(
          "Validation Error",
          "Please select a bank for cheque payment.",
          "error"
        );
        return false;
      }
      if (!cheque_amount || isNaN(cheque_amount) || cheque_amount <= 0) {
        await Swal.fire(
          "Validation Error",
          "Please enter a valid cheque amount.",
          "error"
        );
        return false;
      }
      if (!cheque_no.trim()) {
        await Swal.fire(
          "Validation Error",
          "Cheque number is required.",
          "error"
        );
        return false;
      }
      if (!cheque_date) {
        await Swal.fire(
          "Validation Error",
          "Cheque date is required.",
          "error"
        );
        return false;
      }
    } else if (activeTab === "online") {
      if (!selectedBankId) {
        await Swal.fire(
          "Validation Error",
          "Please select a bank for online payment.",
          "error"
        );
        return false;
      }
      if (!transection_id.trim()) {
        await Swal.fire(
          "Validation Error",
          "Transaction ID is required.",
          "error"
        );
        return false;
      }
    }

    return true; // All validations passed
  };

  const handleSubmit = async () => {
    if (!(await validateForm())) {
      return; // Stop execution if validation fails
    }

    setButtonLoading(true);

    if (settlement) {
      // Show confirmation dialog first if settlement is checked
      const result = await Swal.fire({
        title: "Confirm Settlement",
        text: "Are you sure you want to settle this invoice?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, settle it",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return; // Exit if user doesn't confirm
      }
    }
    const vehicleData = createVehicleObject();
    try {
      const response = await api.postFormDataWithToken(
        `${serviceInvoice}/add_payment`,
        vehicleData
      );

      if (response.status === "success") {
        alert("Service Invoice Payment Added Successfully");
        clearFormState();
        getAllServices(id);
        router.push(
          `/paymentInvoice?id=${selectedInvoice.id}&userId=${selectedInvoice.userId}`
        );
      } else {
        alert(`${response.error.message}`);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("An error occurred while submitting the payment.");
    } finally {
      setButtonLoading(false);
    }
  };

  const bankOptions = allBanksList.map((bank) => ({
    value: bank.id,
    label: bank.bank_name,
  }));

  return (
    <div>
      <div className="mt-5"></div>
      <div className="pageTitle">Client</div>
      <div className="pageTitle">{clientName}</div>
      <div className="mt-5"></div>
      <Grid item lg={6} xs={12}>
        {fetchingData ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table aria-label="invoice table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Select
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Invoice ID
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Amount
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Remaining Amount
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Status
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allInvoiceList.map((invoice) => {
                  const remainingAmount =
                    parseFloat(invoice.total_amt) -
                    parseFloat(invoice.paid_amt);

                  return (
                    <TableRow
                      key={invoice.id}
                      hover={invoice.status !== "paid"}
                      style={{
                        backgroundColor:
                          invoice.status === "paid" ? "#f0f0f0" : "white",
                        cursor:
                          invoice.status === "paid" ? "not-allowed" : "pointer",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Radio
                          checked={selectedInvoiceId === invoice.id}
                          onChange={() => handleRadioChange(invoice)}
                          disabled={invoice.status === "paid"}
                        />
                      </TableCell>
                      <TableCell>{invoice.service_invoice_id}</TableCell>
                      <TableCell>{invoice.total_amt}</TableCell>
                      <TableCell>{remainingAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(invoice.updated_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{invoice.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>

      {showPaymentForm && (
        <Grid
          style={{ backgroundColor: "white", marginTop: "2rem" }}
          item
          lg={6}
          xs={12}
          sm={6}
          md={6}
        >
          <Grid item lg={6} xs={12} sm={6} md={6}>
            <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </Grid>
          {activeTab === "cash" && (
            <Grid className={styles.fromGrid} container spacing={3}>
              <Grid item lg={8} xs={12} md={6}>
                <InputWithTitle
                  onChange={(value) => setPaidAmount(value)}
                  type="text"
                  value={paid_amt}
                  title="Paid Amount"
                />
              </Grid>

              <Grid item lg={4} xs={12} md={6}>
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
              </Grid>

              <Grid item lg={12} xs={12} md={12}>
                <InputWithTitle
                  onChange={(value) => setDescrp(value)}
                  type="text"
                  value={descrp}
                  title="Description"
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2}>
            {activeTab !== "cash" && (
              <Grid className={styles.fromGrid} container spacing={3}>
                <Grid item xs={12}>
                  <Dropdown2
                    onChange={handleBankChange}
                    title="Banks"
                    options={bankOptions}
                    value={selectedBankId}
                  />
                </Grid>

                {activeTab === "cheque" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputWithTitle
                        title="Cheque Date"
                        type="date"
                        value={cheque_date}
                        onChange={(value) => setChequeDate(value)}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12} md={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputWithTitle
                        title="Cheque Number"
                        type="text"
                        value={cheque_no}
                        onChange={(value) => setChequeNo(value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputWithTitle
                        title="Cheque Amount"
                        type="text"
                        value={cheque_amount}
                        onChange={(value) => setChequeAmount(value)}
                      />
                    </Grid>
                  </>
                )}

                {activeTab === "online" && (
                  <>
                    <Grid item lg={8} xs={12} md={6}>
                      <InputWithTitle
                        onChange={(value) => setPaidAmount(value)}
                        type="text"
                        value={paid_amt}
                        title="Paid Amount"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputWithTitle
                        title="Transaction ID"
                        type="text"
                        value={transection_id}
                        onChange={(value) => setTransactionId(value)}
                      />
                    </Grid>
                    <Grid item lg={4} xs={12} md={6}>
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
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Grid>

          <div className="mt-10">
            <GreenButton
              onClick={handleSubmit}
              title={
                buttonLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Submit"
                )
              }
              disabled={buttonLoading} // Disable the button when loading
            />
          </div>
        </Grid>
      )}
    </div>
  );
};

export default withAuth(Page);
