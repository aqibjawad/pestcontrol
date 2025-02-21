"use client";

import React, { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import APICall from "@/networkUtil/APICall";
import Swal from "sweetalert2";
import styles from "../../styles/stock.module.css";
import Tabs from "../serviceInvoices/add/tabs";

import InputWithTitle from "@/components/generic/InputWithTitle";
import { serviceInvoice, bank } from "@/networkUtil/Constants";
import GreenButton from "@/components/generic/GreenButton";
import Dropdown2 from "../../components/generic/DropDown2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const PayModal = ({ open, onClose, invoiceId, invoiceData, onRefresh }) => {

  console.log(invoiceData, "invoiceData");
  
  const [fetchingData, setFetchingData] = useState(false);

  const api = new APICall();
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");

  const [settlement, setIsSettelemt] = useState(false);

  const [paid_amt, setPaidAmount] = useState("");
  const [descrp, setDescrp] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  // Bank states
  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  // Payment method specific states
  const [cheque_amount, setChequeAmount] = useState("");
  const [cheque_no, setChequeNo] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [transection_id, setTransactionId] = useState("");
  const [clientName, setClientName] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBankId("");
    setChequeAmount("");
    setChequeNo("");
    setChequeDate("");
    setTransactionId("");
  };

  const handleSettlementChange = (e) => {
    setIsSettelemt(e.target.checked);
  };

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

  const bankOptions = allBanksList?.map((bank) => ({
    value: bank.id,
    label: bank.bank_name,
  }));

  const createVehicleObject = () => {
    let vehicleObj = {
      service_invoice_id: invoiceId,
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
        setButtonLoading(false);
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
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service Invoice Payment Added Successfully",
        }).then(() => {
          onClose();
          onRefresh(); // Call refresh function instead of reloading
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while submitting the payment.",
      });
    } finally {
      setButtonLoading(false);
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
            Add Payment on Invoice Number {invoiceId} with an amount {invoiceData?.total_amt}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid item lg={6} xs={12} sm={6} md={6}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>
        {(activeTab === "cash" || activeTab === "online") && (
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
                <Grid item xs={12} sm={6}>
                  <InputWithTitle
                    title="Transaction ID"
                    type="text"
                    value={transection_id}
                    onChange={(value) => setTransactionId(value)}
                  />
                </Grid>
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
            disabled={buttonLoading}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default PayModal;
