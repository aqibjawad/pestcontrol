"use client";

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { serviceInvoice, dashboard } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import DateFilters2 from "@/components/generic/DateFilters2";

import Link from "next/link";

const All = () => {
  const api = new APICall();

  // Separate loading states for each section
  const [loadingStates, setLoadingStates] = useState({
    expense: false,
    paid: false,
    unpaid: false,
  });

  const [expenseList, setExpenseList] = useState([]);
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [unPaidList, setUnPaidList] = useState([]);
  const [unPaidTotalAmount, setUnPaidTotalAmount] = useState(0);

  const fetchPaidInvoices = async (startDate, endDate) => {
    setLoadingStates((prev) => ({ ...prev, paid: true }));
    try {
      const queryParams = [];
      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      }

      const response = await api.getDataWithToken(
        `${serviceInvoice}${
          queryParams.length ? "?" + queryParams.join("&") : ""
        }`
      );
      const paidInvoices = response.data.filter(
        (invoice) => invoice.status === "paid"
      );
      setPaidInvoices(paidInvoices);

      const total = paidInvoices.reduce(
        (sum, invoice) => sum + parseFloat(invoice.total_amt || 0),
        0
      );
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching paid invoices:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, paid: false }));
    }
  };

  const fetchUnpaidInvoices = async (startDate, endDate) => {
    setLoadingStates((prev) => ({ ...prev, unpaid: true }));
    try {
      const queryParams = [];
      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      }

      const response = await api.getDataWithToken(
        `${serviceInvoice}${
          queryParams.length ? "?" + queryParams.join("&") : ""
        }`
      );
      const unpaidInvoices = response.data.filter(
        (invoice) => invoice.status === "unpaid"
      );
      setUnPaidList(unpaidInvoices);

      const total = unpaidInvoices.reduce(
        (sum, invoice) => sum + parseFloat(invoice.total_amt || 0),
        0
      );
      setUnPaidTotalAmount(total);
    } catch (error) {
      console.error("Error fetching unpaid invoices:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, unpaid: false }));
    }
  };

  const fetchExpenses = async (startDate, endDate) => {
    setLoadingStates((prev) => ({ ...prev, expense: true }));
    try {
      const queryParams = [];
      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      }

      const response = await api.getDataWithToken(
        `${dashboard}/expense_collection${
          queryParams.length ? "?" + queryParams.join("&") : ""
        }`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, expense: false }));
    }
  };

  // Separate handlers for each date filter
  const handleExpenseDateChange = (start, end) => {
    fetchExpenses(start, end);
  };

  const handlePaidDateChange = (start, end) => {
    console.log("Paid date change", start);
    fetchPaidInvoices(start, end);
  };

  const handleUnpaidDateChange = (start, end) => {
    fetchUnpaidInvoices(start, end);
  };

  return (
    <Grid container spacing={2}>
      {/* Expense Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: "500" }}>
                Expenses
              </div>
              <div
                style={{
                  padding: "5px",
                  backgroundColor: "#32a92e",
                  borderRadius: "50px",
                  fontSize: "13px",
                }}
              >
                <DateFilters2 onDateChange={handleExpenseDateChange} />
              </div>
            </div>
            {loadingStates.expense ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <div>Total Expense: {expenseList?.total_expense || 0}</div>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Paid Amount Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: "500" }}>
                Recieved Payments
              </div>
              <div
                style={{
                  backgroundColor: "#32a92e",
                  padding: "5px",
                  borderRadius: "50px",
                  fontSize: "13px",
                }}
              >
                <DateFilters2 onDateChange={handlePaidDateChange} />
              </div>
            </div>
            {loadingStates.paid ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>Total Amount: {(totalAmount || 0).toFixed(2)}</div>

                <div>
                  <Link href="/amounts">View Details</Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Unpaid Amount Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: "500" }}>
                Recieveable Amounts
              </div>
              <div
                style={{
                  backgroundColor: "#32a92e",
                  padding: "5px",
                  borderRadius: "50px",
                  fontSize: "13px",
                }}
              >
                <DateFilters2 onDateChange={handleUnpaidDateChange} />
              </div>
            </div>
            {loadingStates.unpaid ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>Total Amount: {(unPaidTotalAmount || 0).toFixed(2)}</div>

                <div>
                  <Link href="/amounts">View Details</Link>
                </div>
              </div>
              // <div>Total Amount: {(unPaidTotalAmount || 0).toFixed(2)}</div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default All;
