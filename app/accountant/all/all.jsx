"use client";

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { serviceInvoice, dashboard } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const All = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const [totalAmount, setTotalAmount] = useState();

  const [unPaidList, setUnPaidList] = useState([]);

  const [unPaidTotalAmount, setUnPaidTotalAmount] = useState();

  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    getAllPaid();
    getAllUnPaid();
    getExpense();
  }, []);

  const getAllPaid = async () => {
    setFetchingData(true);

    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);
      const paidInvoices = response.data.filter(
        (invoice) => invoice.status === "paid"
      );
      setQuoteList(paidInvoices);
      updateTotalAmount(paidInvoices); // Update total amount here
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuoteList([]); // Set empty array on error
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const updateTotalAmount = (invoices) => {
    const totalAmount = invoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.total_amt || 0);
    }, 0);

    setTotalAmount(totalAmount);
  };

  const getAllUnPaid = async () => {
    setFetchingData(true);

    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);
      const unPaidInvoices = response.data.filter(
        (invoice) => invoice.status === "unpaid"
      );
      setUnPaidList(unPaidInvoices);
      updateUnPaidTotalAmount(unPaidInvoices); // Update total amount here
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuoteList([]); // Set empty array on error
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const updateUnPaidTotalAmount = (invoices) => {
    const unPaidTotalAmount = invoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.total_amt || 0);
    }, 0);

    setUnPaidTotalAmount(unPaidTotalAmount);
  };

  const getExpense = async () => {
    try {
      const response = await api.getDataWithToken(
        `${dashboard}/expense_collection`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      console.log("done");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Expenses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Amount: {expenseList?.total_expense}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Paid Amount
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Amount: {(totalAmount || 0).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Un Paid Amount
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Amount: {(unPaidTotalAmount || 0).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default All;
