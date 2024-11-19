"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { Box, Grid, Typography, Paper } from "@mui/material";
import styles from "../../styles/invoiceDetails.module.css";

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
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}/${id}`);
      setQuoteList(response.data);
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
            Greece Cluster Building K12, Office 12, International City
          </Typography>
          <Typography variant="body2">info@accuratepestcontrol.ae</Typography>

          <Typography className="mt-5" variant="body2">
            Pay Slip To
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.name}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.email}
          </Typography>
        </Grid>
      </Grid>

      <div className="mt-5">
        <Grid container spacing={2} component={Paper} sx={{ padding: 2 }}>
          {/* Header Row */}
          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#32A92E" }}
            >
              Basic
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#32A92E", textAlign: "right" }}
            >
              Allowance (AED)
            </Typography>
          </Grid>

          {/* Data Row */}
          <Grid item xs={6}>
            <Typography
              sx={{ color: "black", padding: "4px 16px", lineHeight: "1rem" }}
            >
              {invoiceList?.employee?.basic_salary}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              sx={{
                color: "black",
                padding: "4px 16px",
                lineHeight: "1rem",
                textAlign: "right",
              }}
            >
              {invoiceList?.employee?.allowance}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          className="mt-5"
          container
          spacing={2}
          component={Paper}
          sx={{ padding: 2 }}
        >
          {/* Header Row */}
          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#32A92E" }}
            >
              Other
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#32A92E", textAlign: "right" }}
            >
              Salary (AED)
            </Typography>
          </Grid>

          {/* Data Row */}
          <Grid item xs={6}>
            <Typography
              sx={{ color: "black", padding: "4px 16px", lineHeight: "1rem" }}
            >
              {invoiceList?.employee?.other}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              sx={{
                color: "black",
                padding: "4px 16px",
                lineHeight: "1rem",
                textAlign: "right",
              }}
            >
              {invoiceList?.employee?.total_salary}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          className="mt-5"
          container
          spacing={2}
          component={Paper}
          sx={{ padding: 2 }}
        >
          {/* Header Row */}
          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#32A92E" }}
            >
              Comission
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#32A92E", textAlign: "right" }}
            >
              Total Salary (AED)
            </Typography>
          </Grid>

          {/* Data Row */}
          <Grid item xs={6}>
            <Typography
              sx={{ color: "black", padding: "4px 16px", lineHeight: "1rem" }}
            >
              {invoiceList?.employee?.commission_per}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              sx={{
                color: "black",
                padding: "4px 16px",
                lineHeight: "1rem",
                textAlign: "right",
              }}
            >
              {invoiceList?.employee?.total_salary &&
              invoiceList?.employee?.commission_per
                ? (
                    invoiceList?.employee?.total_salary *
                    (1 + invoiceList?.employee?.commission_per / 100)
                  ).toFixed(2)
                : "0.00"}
            </Typography>
          </Grid>
        </Grid>
      </div>

      <Grid className="mt-5" container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.name}
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
