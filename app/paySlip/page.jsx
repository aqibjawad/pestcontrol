"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import {
  Grid,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

import APICall from "@/networkUtil/APICall";

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

const getQueryParam = (url, paramKey) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === paramKey) {
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
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const [amount, setAmount] = useState(true);

  const getQueryParam = (url, param) => {
    const searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
  };

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Extract id and amount
    const urlId = getQueryParam(currentUrl, "id");
    const urlAmount = getQueryParam(currentUrl, "amount");

    setId(urlId);
    setAmount(urlAmount); // Assuming setAmount is defined in your component
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllQuotes(id);
    }
  }, [id]);

  const getAllQuotes = async (employeeId) => {
    setFetchingData(true);
    try {
      const currentMonth = getCurrentMonth();
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get?employee_user_id=${employeeId}&salary_month=${currentMonth}`
      );
      setQuoteList(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
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

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceData.name}
          </Typography>
          <Typography variant="body2">
            Warehouse No.1, Plot No. 247-289, Al Qusais Industrial Area 4, Dubai
            - UAE
          </Typography>
          <Typography variant="body2">info@accuratepestcontrol.ae</Typography>

          <Typography className="mt-5" variant="body2">
            Pay Slip To
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.user?.name}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.user?.email}
          </Typography>
        </Grid>
      </Grid>

      <div className="mt-5">
        {fetchingData ? (
          <Skeleton variant="rectangular" width="100%" height="400px" />
        ) : (
          <div>
            <TableContainer component={Paper} sx={{ padding: 2 }}>
              <Table>
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Basic
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Allowance
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Other
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Payable
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* Table Body */}
                <TableBody>
                  <TableRow>
                    <TableCell align="left">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.basic_salary}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.allowance}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.other}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.payable_salary}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ marginTop: 5, padding: 2 }}>
              <Table>
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Commission
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Fines
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Advance Payments
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#32A92E" }}
                      >
                        Hold Salary
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.commission_per || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.total_fines || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.adv_paid || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: "black",
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {invoiceList?.user?.employee?.hold_salary || 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>

      <Grid className="mt-5" container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.user?.name}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Accurate Pest Control Services LLC
          </Typography>
        </Grid>
      </Grid>

      <Grid className="mt-5" container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            _________________________
          </Typography>

          <Typography variant="body2">Signature</Typography>
          <Typography variant="body2">Date :</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            _________________________
          </Typography>

          <Typography variant="body2">Signature</Typography>
          <Typography variant="body2">Date :</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Page;
