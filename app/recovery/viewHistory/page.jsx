"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import styles from "../../../styles/invoiceDetails.module.css";

import { serviceInvoice, clients } from "@/networkUtil/Constants";

import APICall from "@/networkUtil/APICall";
import withAuth from "@/utils/withAuth";

import { format } from "date-fns";

const invoiceData = {
  companyDetails: {
    name: "Accurate Pest Control Services LLC",
    logo: "/api/placeholder/100/100",
    address: "Office 12, Building # Greece K-12, International City Dubai",
    email: "accuratepestcontrolcl.ae",
    phone: "+971 52 449 6173",
  },
  items: [
    {
      description: "General Pest Control",
      rate: 1080.0,
      tax: 54.0,
      total: 1134.0,
    },
  ],
};

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

  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllQuotes(id);
    }
  }, [id]);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${serviceInvoice}/${id}`);
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (invoiceList?.user?.id) {
      fetchData(invoiceList.user.id);
    }
  }, [invoiceList]);

  const fetchData = async (id) => {
    setLoadingDetails(true);
    try {
      const response = await api.getDataWithToken(
        `${clients}/ledger/get/${invoiceList?.user?.id}`
      );
      const data = response.data.slice(-5);
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );

      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "")
      );
    };

    if (num === 0) return "Zero";

    const decimalParts = num.toString().split(".");
    const wholePart = parseInt(decimalParts[0]);
    const decimal = decimalParts[1] ? parseInt(decimalParts[1]) : 0;

    let result = convertLessThanThousand(wholePart);

    if (wholePart > 999) {
      const thousands = Math.floor(wholePart / 1000);
      result =
        convertLessThanThousand(thousands) +
        " Thousand " +
        convertLessThanThousand(wholePart % 1000);
    }

    if (decimal > 0) {
      result += " Point " + convertLessThanThousand(decimal);
    }

    return result;
  };

  const formatAmountDisplay = (amount) => {
    if (amount === undefined || amount === null) return "";
    const numAmount = parseFloat(amount);
    const amountInWords = numberToWords(numAmount);
    return `Total Amount AED ${numAmount.toFixed(2)} (${amountInWords} Only)`;
  };

  const getNextMonthDate = (issuedDate) => {
    // Check if date is valid
    if (!issuedDate) return null;

    // Convert string to Date object
    const date = new Date(issuedDate);

    // Get the next month
    date.setMonth(date.getMonth() + 1);

    // Format date to YYYY-MM-DD
    const nextDate = date.toISOString().split("T")[0];

    return nextDate;
  };

  const commonStyles = {
    width: "100%",
    maxWidth: "600px", // Set a max-width to keep consistency
    margin: "0 auto", // Center the components
  };

  const headerStyles = {
    backgroundColor: "lightgreen",
    padding: "8px",
    lineHeight: "1rem",
    marginBottom: "1rem",
    borderRadius: "4px",
  };

  if (loadingDetails) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceData.companyDetails.name}
          </Typography>
          <Typography variant="body2">
            Warehouse No 1 Plot No 247-289, Al Qusais Industrial Area 4 , Dubai
            - UAE
          </Typography>
          <Typography variant="body2">info@accuratepestcontrol.ae</Typography>

          <div className="mt-5">
            <Typography className="" variant="body2">
              Bill To
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {invoiceList?.user?.client?.firm_name}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              TRN: {invoiceList?.invoiceable?.trn}
            </Typography>
          </div>

          <div className="mt-5">
            <Typography className="" variant="body2">
              Contact Person
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Manager
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {invoiceList?.user?.client?.mobile_number}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={6}>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", textAlign: "right" }}
          >
            Tax Invoice
          </Typography>
          <div>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", textAlign: "right" }}
            >
              TRN: 1041368802200003
            </Typography>
          </div>

          <div style={{ ...commonStyles, ...headerStyles }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div>Tax Invoice</div>
              </Grid>
              <Grid item xs={6}>
                <div>{invoiceList?.service_invoice_id}</div>
              </Grid>
            </Grid>
          </div>

          <TableContainer component={Paper} style={commonStyles}>
            <Table>
              <TableHead style={{ backgroundColor: "lightgreen" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Due Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">
                    {invoiceList?.issued_date}
                  </TableCell>
                  <TableCell align="right">
                    {getNextMonthDate(invoiceList?.issued_date)}
                  </TableCell>
                  <TableCell align="right">{invoiceList?.total_amt}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ textAlign: "right" }} className={styles.totalAmount}>
            APCS{invoiceList?.user?.client?.referencable_id}PT
            {invoiceList?.invoiceable?.billing_method === "monthly"
              ? 1
              : invoiceList?.invoiceable?.billing_method === "monthly"
              ? 2
              : invoiceList?.invoiceable?.billing_method === "service"
              ? 3
              : "unknown"}
          </div>
        </Grid>
      </Grid>

      <div className="mt-2">
        <Typography className="" variant="body2" sx={{ fontWeight: "bold" }}>
          Assigned Histories
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#32A92E", color: "white" }}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="center"
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="center"
                >
                  Employee Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="center"
                >
                  Response type
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="center"
                >
                  promise_date
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="right"
                >
                  Other
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceList?.assigned_histories?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="left"
                  >
                    {new Date(row?.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="left"
                  >
                    {row?.employee_user?.name}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="left"
                  >
                    {row?.response_type ?? "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="left"
                  >
                    {row?.promise_date ?? "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="left"
                  >
                    {row?.other ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default withAuth(Page);
