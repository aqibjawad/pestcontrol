"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
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
} from "@mui/material";
import styles from "../../styles/invoiceDetails.module.css";

import { serviceInvoice } from "@/networkUtil/Constants";

import APICall from "@/networkUtil/APICall";
import withAuth from "@/utils/withAuth";

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
      const response = await api.getDataWithToken(`${serviceInvoice}/${id}`);
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
              {invoiceList?.user?.name}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {invoiceList?.user?.email}
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
              {invoiceList?.user?.name}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {invoiceList?.user?.client?.mobile_number}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Tax Invoice
          </Typography>
          <TableContainer component={Paper}>
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
                    Tax Invoice
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    VAT (%)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right"> General Pest Control </TableCell>
                  <TableCell align="right">{invoiceList?.total_amt}</TableCell>
                  <TableCell align="right">
                    {invoiceList?.invoiceable?.vat_per}
                  </TableCell>
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

      <div className="mt-5">
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
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="right"
                >
                  Rate (AED)
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                  align="right"
                >
                  Total (AED)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceList?.details?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                  >
                    {" "}
                    General Pest Control{" "}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="right"
                  >
                    {item.rate}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                    }}
                    align="right"
                  >
                    {item.sub_total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div>
        <div className={styles.totalAmount}>
          (
          {invoiceList?.total_amt && formatAmountDisplay(invoiceList.total_amt)}
          )
        </div>

        <div className={styles.descrp}>
          Payment will be paid after receiving of invoice within 30 days period.
        </div>

        <div className={styles.totalAmount}>Bank Details:</div>

        <div className={styles.Bankdescrp}>
          Account Holder : ACCURATE PEST CONTROL SERVICES L.L.C IBAN:
          AE980400000883216722001
        </div>

        <div className={styles.Bankdescrp}>
          Account: 0883216722001 Bank Name : RAK BANK
        </div>

        <div className={styles.Bankdescrp}>Branch: DRAGON MART, DUBAI</div>

        <div className={`${styles.Bankdescrp} mt-5`}>Best Regards</div>
      </div>

      <Grid className="mt-5" container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.user?.client?.firm_name}
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

          <Typography className="" variant="body2">
            {invoiceList?.user?.name}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Manager
          </Typography>
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

export default withAuth(Page);
