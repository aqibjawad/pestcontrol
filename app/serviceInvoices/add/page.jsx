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
  Checkbox,
  Typography,
} from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { serviceInvoice, bank } from "@/networkUtil/Constants";
import GreenButton from "@/components/generic/GreenButton";
import APICall from "@/networkUtil/APICall";
import Tabs from "./tabs";
import styles from "../../../styles/stock.module.css";
import Dropdown2 from "@/components/generic/Dropdown2";

import { useRouter } from "next/navigation";

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

  console.log(allInvoiceList);

  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [serviceInvoiceId, setServiceInvoiceId] = useState(null);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // Basic states
  const [id, setId] = useState("");
  const [paid_amt, setPaidAmount] = useState("");
  const [descrp, setDescrp] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [isAllAmtPay, setIsAllAmtPay] = useState(false);

  // Bank states
  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  // Payment method specific states
  const [cheque_amount, setChequeAmount] = useState("");
  const [cheque_no, setChequeNo] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [transection_id, setTransactionId] = useState("");

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

        const unpaidInvoices = response.data
          .filter((invoice) => invoice.status === "unpaid")
          .slice(0, 10); // Get the first 10 unpaid invoices

        setAllInvoiceList(unpaidInvoices);
      }
    } catch (error) {
      console.error("Error fetching Services:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const clearFormState = () => {
    setSelectedInvoices([]);
    setServiceInvoiceId(null);
    setSelectedInvoice(null);
    setPaidAmount("");
    setDescrp("");
    setActiveTab("cash");
    setIsAllAmtPay(false);
    setSelectedBankId("");
    setChequeAmount("");
    setChequeNo("");
    setChequeDate("");
    setTransactionId("");
    setShowPaymentForm(false);
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

  const handlePayAllClick = () => {
    setIsAllAmtPay(!isAllAmtPay);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = allInvoiceList.map((invoice) => invoice.id);
      setSelectedInvoices(newSelected);
      setServiceInvoiceId(allInvoiceList[0]?.service_invoice_id || null);
    } else {
      setSelectedInvoices([]);
      setServiceInvoiceId(null);
    }
    setShowPaymentForm(allInvoiceList.length > 0);
  };

  const handleCheckboxClick = (invoice) => {
    const selectedIndex = selectedInvoices.indexOf(invoice.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedInvoices, invoice.id);
      setSelectedInvoice(invoice);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedInvoices.slice(1));
      setSelectedInvoice(
        newSelected.length > 0
          ? allInvoiceList.find((inv) => inv.id === newSelected[0])
          : null
      );
    } else if (selectedIndex === selectedInvoices.length - 1) {
      newSelected = newSelected.concat(selectedInvoices.slice(0, -1));
      setSelectedInvoice(
        allInvoiceList.find((inv) => inv.id === newSelected[0])
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedInvoices.slice(0, selectedIndex),
        selectedInvoices.slice(selectedIndex + 1)
      );
      setSelectedInvoice(
        allInvoiceList.find((inv) => inv.id === newSelected[0])
      );
    }

    setSelectedInvoices(newSelected);
    setShowPaymentForm(newSelected.length > 0);
  };

  const isSelected = (id) => selectedInvoices.indexOf(id) !== -1;

  const createVehicleObject = () => {
    let vehicleObj = {
      service_invoice_id: selectedInvoice.id,
      paid_amt,
      descrp,
      is_all_amt_pay: isAllAmtPay ? 1 : 0,
      payment_type: activeTab,
    };

    if (activeTab === "cheque") {
      vehicleObj = {
        ...vehicleObj,
        bank_id: selectedBankId,
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

  const handleSubmit = async () => {
    setButtonLoading(true);

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
      <Grid item lg={6} xs={12}>
        {fetchingData ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table aria-label="invoice table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedInvoices.length > 0 &&
                        selectedInvoices.length < allInvoiceList.length
                      }
                      checked={
                        allInvoiceList.length > 0 &&
                        selectedInvoices.length === allInvoiceList.length
                      }
                      onChange={handleSelectAllClick}
                    />
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
                  const isItemSelected = isSelected(invoice.id);
                  const remainingAmount =
                    parseFloat(invoice.total_amt) -
                    parseFloat(invoice.paid_amt);

                  return (
                    <TableRow
                      hover
                      onClick={() => handleCheckboxClick(invoice)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={invoice.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{invoice.service_invoice_id}</TableCell>
                      <TableCell>{invoice.total_amt}</TableCell>
                      <TableCell>{remainingAmount.toFixed(2)}</TableCell>
                      <TableCell>{invoice.updated_at}</TableCell>
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
          <Grid container spacing={2}>
            <Grid item lg={8} xs={12} md={6}>
              <InputWithTitle
                onChange={(value) => setPaidAmount(value)}
                type="text"
                value={paid_amt}
                title="Paid Amount"
              />
            </Grid>

            <Grid className="mt-3" item lg={4} xs={12} md={6}>
              <button
                onClick={handlePayAllClick}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: isAllAmtPay ? "#28a745" : "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.3s ease",
                }}
              >
                Pay All
              </button>
            </Grid>

            <Grid item lg={12} xs={12} md={12}>
              <InputWithTitle
                onChange={(value) => setDescrp(value)}
                type="text"
                value={descrp}
                title="Description"
              />
            </Grid>

            <Grid item lg={6} xs={12} sm={6} md={6}>
              <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
            </Grid>

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
              title={buttonLoading ? "Submitting..." : "Submit"}
              disabled={buttonLoading}
            />
          </div>
        </Grid>
      )}
    </div>
  );
};

export default Page;
