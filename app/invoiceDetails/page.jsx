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

const invoiceData = {
  companyDetails: {
    name: "Accurate Pest Control Services LLC",
    logo: "/api/placeholder/100/100",
    address: "Office 12, Building # Greece K-12, International City Dubai",
    email: "accuratepestcontrolcl.ae",
    phone: "+971 52 449 6173",
  },
  customerDetails: {
    name: "Kohnook Restaurant LLC",
    contactPerson: "Mr. Asif Ali",
    email: "asif2965@yahoo.com",
    phone: "+971 56 450 1663",
  },
  invoiceDetails: {
    number: "#0001551129",
    date: "03-Dec-2024",
    total: "AED 1,134.00",
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

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceData.companyDetails.name}
          </Typography>
          <Typography variant="body2">
            Greece Cluster Building K12, Office 12, International City
          </Typography>
          <Typography variant="body2">info@accuratepestcontrol.ae</Typography>

          <Typography className="mt-5" variant="body2">
            Bill To
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.user?.name}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {invoiceList?.user?.email}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Tax Invoice
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "lightgreen" }}>
                <TableRow>
                  <TableCell align="left" style={{ color: "white" }}>
                    Tax Invoice
                  </TableCell>
                  <TableCell align="left" style={{ color: "white" }}>
                    Rate
                  </TableCell>
                  <TableCell align="left" style={{ color: "white" }}>
                    Tax
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="right">{item.description}</TableCell>
                    <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.tax.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <div className="mt-5">
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#32A92E", color: "white" }}>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Rate (AED)</TableCell>
                <TableCell align="right">Tax (AED)</TableCell>
                <TableCell align="right">Total (AED)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.tax.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div>
        <div className={styles.totalAmount}>
          Total Amount AED 1,134.00 (One Thousand One Hundred Thirty-Four Only)
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

        <div className={styles.Bankdescrp}>Branch: DRAGON MART, DUBAI</div>

        <div className={`${styles.Bankdescrp} mt-5`}>Best Regards</div>
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

export default Page;
