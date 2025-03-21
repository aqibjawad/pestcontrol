"use client";

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { serviceInvoice, dashboard, company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import DateFilters2 from "@/components/generic/DateFilters2";
import Link from "next/link";

// Replace `dayjs` with your date handling logic (assuming custom logic for dates)
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const getDefaultDateRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: formatDate(startOfMonth),
    end: formatDate(endOfMonth),
  };
};

const All = () => {
  const api = new APICall();

  // Separate loading states for each section
  const [loadingStates, setLoadingStates] = useState({
    expense: false,
    paid: false,
    unpaid: false,
  });

  // Default date range (current month)
  const defaultDateRange = getDefaultDateRange();

  // Add state for date range
  const [dateRange, setDateRange] = useState({
    startDate: defaultDateRange.start,
    endDate: defaultDateRange.end,
  });

  const [expenseList, setExpenseList] = useState([]);
  const [chequeList, setChequeList] = useState([]); // Changed from quoteList
  const [totalAmount, setTotalAmount] = useState(0);
  const [unPaidList, setUnPaidList] = useState([]);
  const [unPaidTotalAmount, setUnPaidTotalAmount] = useState(0);
  const [cashList, setCashList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const [totals, setTotals] = useState({
    cashTotal: 0,
  });

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchExpenses(dateRange.startDate, dateRange.endDate);
    getAllCheques(dateRange.startDate, dateRange.endDate);
    fetchUnpaidInvoices(dateRange.startDate, dateRange.endDate);
    fetchFinancialData(dateRange.startDate, dateRange.endDate);
  }, []);

  const getAllCheques = async (startDate, endDate) => {
    setFetchingData(true);
    setLoadingDetails(true);
    setLoadingStates((prev) => ({ ...prev, paid: true }));

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      // Use default date range as fallback
      queryParams.push(`start_date=${dateRange.startDate}`);
      queryParams.push(`end_date=${dateRange.endDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${company}/receives/get?${queryParams.join("&")}`
      );

      setChequeList(response.data);
      // Calculate totals
      calculateTotals(response.data);
    } catch (error) {
      console.error("Error fetching cheques:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
      setLoadingStates((prev) => ({ ...prev, paid: false }));
    }
  };

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (acc, transaction) => {
        return {
          cashTotal: acc.cashTotal + parseFloat(transaction.cash_amt || 0),
        };
      },
      { cashTotal: 0 }
    );

    setTotals(totals);
  };

  const fetchUnpaidInvoices = async (startDate, endDate) => {
    setLoadingStates((prev) => ({ ...prev, unpaid: true }));
    try {
      const finalStartDate = startDate || dateRange.startDate;
      const finalEndDate = endDate || dateRange.endDate;

      const response = await api.getDataWithToken(
        `${serviceInvoice}?start_date=${finalStartDate}&end_date=${finalEndDate}`
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
      const finalStartDate = startDate || dateRange.startDate;
      const finalEndDate = endDate || dateRange.endDate;

      const response = await api.getDataWithToken(
        `${dashboard}/expense_collection?start_date=${finalStartDate}&end_date=${finalEndDate}`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, expense: false }));
    }
  };

  const getCash = async (startDate, endDate) => {
    try {
      const finalStartDate = startDate || dateRange.startDate;
      const finalEndDate = endDate || dateRange.endDate;

      const response = await api.getDataWithToken(
        `${dashboard}/cash_collection?start_date=${finalStartDate}&end_date=${finalEndDate}`
      );
      setCashList(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchFinancialData = async (startDate, endDate) => {
    setFetchingData(true);
    try {
      // Parallel API calls with the received dates
      await Promise.all([getCash(startDate, endDate)]);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleExpenseDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    fetchExpenses(startDate, endDate);
  };

  const handlePaidDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    getAllCheques(startDate, endDate);
  };

  const handleUnpaidDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    fetchUnpaidInvoices(startDate, endDate);
  };

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
    fetchFinancialData(startDate, endDate);
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
      currency: "AED",
    });
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
                Received
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
                <div>Total Amount: {formatAmount(totals.cashTotal)}</div>
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
                Receivable Amounts
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
                <div>Total Amount: {formatAmount(unPaidTotalAmount)}</div>
                <div>
                  <Link href="/amounts">View Details</Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default All;
