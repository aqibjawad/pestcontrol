"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from "@mui/material";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  isBefore,
} from "date-fns";
import { serviceInvoice } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";

const Page = () => {
  const api = new APICall();
  const [invoiceList, setInvoiceList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [summaryData, setSummaryData] = useState({
    thisMonth: { total: 0, count: 0, start: null, end: null },
    lastMonth: { total: 0, count: 0, start: null, end: null },
    lastThreeMonths: { total: 0, count: 0, start: null, end: null },
    olderThanThreeMonths: { total: 0, count: 0, start: null, end: null },
  });
  const [statusFilter, setStatusFilter] = useState("unpaid");

  const calculateDateRanges = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Last month calculations
    const lastMonthDate = subMonths(now, 1);
    const lastMonthStart = startOfMonth(lastMonthDate);
    const lastMonthEnd = endOfMonth(lastMonthDate);

    // This month range
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    // Last 3 months range (excluding current and last month)
    const threeMonthsStart = startOfMonth(subMonths(now, 4));
    const threeMonthsEnd = endOfMonth(subMonths(now, 2));

    return {
      thisMonth: { start: thisMonthStart, end: thisMonthEnd },
      lastMonth: { start: lastMonthStart, end: lastMonthEnd },
      lastThreeMonths: { start: threeMonthsStart, end: threeMonthsEnd },
      olderThanThreeMonths: { end: threeMonthsStart },
    };
  };

  const getAllQuotes = async () => {
    setFetchingData(true);
    setLoadingDetails(true);

    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);
      const dateRanges = calculateDateRanges();

      let filteredData = response.data;
      if (statusFilter !== "all") {
        filteredData = response.data.filter(
          (invoice) => invoice.status.toLowerCase() === statusFilter
        );
      }

      setInvoiceList(filteredData);
      processInvoiceData(filteredData, dateRanges);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setInvoiceList([]);
      processInvoiceData([], calculateDateRanges());
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const processInvoiceData = (data, dateRanges) => {
    if (!Array.isArray(data)) return;

    const summary = {
      thisMonth: { total: 0, count: 0, ...dateRanges.thisMonth },
      lastMonth: { total: 0, count: 0, ...dateRanges.lastMonth },
      lastThreeMonths: { total: 0, count: 0, ...dateRanges.lastThreeMonths },
      olderThanThreeMonths: {
        total: 0,
        count: 0,
        end: dateRanges.olderThanThreeMonths.end,
      },
    };

    try {
      data.forEach((invoice) => {
        if (!invoice?.issued_date) return;

        const issueDate = new Date(invoice.issued_date);
        const amount = parseFloat(invoice.total_amt) || 0;

        // This Month
        if (
          isWithinInterval(issueDate, {
            start: dateRanges.thisMonth.start,
            end: dateRanges.thisMonth.end,
          })
        ) {
          summary.thisMonth.total += amount;
          summary.thisMonth.count++;
          return;
        }

        // Last Month
        if (
          isWithinInterval(issueDate, {
            start: dateRanges.lastMonth.start,
            end: dateRanges.lastMonth.end,
          })
        ) {
          summary.lastMonth.total += amount;
          summary.lastMonth.count++;
          return;
        }

        // Last 3 Months
        if (
          isWithinInterval(issueDate, {
            start: dateRanges.lastThreeMonths.start,
            end: dateRanges.lastThreeMonths.end,
          })
        ) {
          summary.lastThreeMonths.total += amount;
          summary.lastThreeMonths.count++;
          return;
        }

        // Older than 3 months
        if (isBefore(issueDate, dateRanges.olderThanThreeMonths.end)) {
          summary.olderThanThreeMonths.total += amount;
          summary.olderThanThreeMonths.count++;
        }
      });

      setSummaryData(summary);
    } catch (error) {
      console.error("Error processing invoice data:", error);
    }
  };

  useEffect(() => {
    getAllQuotes();
  }, [statusFilter]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const headerCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid rgba(224, 224, 224, 1)",
  };

  const bodyCellStyle = {
    borderBottom: "1px solid rgba(224, 224, 224, 0.8)",
  };

  const amountCellStyle = {
    color: "#2196f3",
    fontWeight: "500",
    textAlign: "right",
  };

  const linkStyle = {
    color: "#1976d2",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  };

  if (loadingDetails) {
    return (
      <TableContainer component={Paper} elevation={1}>
        <Typography
          variant="h6"
          sx={{ p: 2, borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
        >
          Outstandings
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle}>Period</TableCell>
              <TableCell sx={{ ...headerCellStyle, textAlign: "right" }}>
                Invoices
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, textAlign: "right" }}>
                Total Amount
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, textAlign: "right" }}>
                View Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4].map((cell) => (
                  <TableCell key={cell}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Typography
        variant="h6"
        sx={{ p: 2, borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
      >
        Outstandings
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyle}>Period</TableCell>
            <TableCell sx={{ ...headerCellStyle, textAlign: "right" }}>
              Invoices
            </TableCell>
            <TableCell sx={{ ...headerCellStyle, textAlign: "right" }}>
              Total Amount
            </TableCell>
            <TableCell sx={{ ...headerCellStyle, textAlign: "right" }}>
              View Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover>
            <TableCell sx={bodyCellStyle}>This Month</TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              {summaryData.thisMonth.count}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, ...amountCellStyle }}>
              {formatCurrency(summaryData.thisMonth.total)}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              <Link
                href={`/invoice?start=${format(
                  summaryData.thisMonth.start,
                  "yyyy-MM-dd"
                )}&end=${format(summaryData.thisMonth.end, "yyyy-MM-dd")}`}
                style={linkStyle}
              >
                View Details
              </Link>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell sx={bodyCellStyle}>Last Month</TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              {summaryData.lastMonth.count}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, ...amountCellStyle }}>
              {formatCurrency(summaryData.lastMonth.total)}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              <Link
                href={`/invoice?start=${format(
                  summaryData.lastMonth.start,
                  "yyyy-MM-dd"
                )}&end=${format(summaryData.lastMonth.end, "yyyy-MM-dd")}`}
                style={linkStyle}
              >
                View Details
              </Link>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell sx={bodyCellStyle}>Last 3 Months</TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              {summaryData.lastThreeMonths.count}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, ...amountCellStyle }}>
              {formatCurrency(summaryData.lastThreeMonths.total)}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              <Link
                href={`/invoice?start=${format(
                  summaryData.lastThreeMonths.start,
                  "yyyy-MM-dd"
                )}&end=${format(
                  summaryData.lastThreeMonths.end,
                  "yyyy-MM-dd"
                )}`}
                style={linkStyle}
              >
                View Details
              </Link>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell sx={bodyCellStyle}>Older Than 3 Months</TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              {summaryData.olderThanThreeMonths.count}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, ...amountCellStyle }}>
              {formatCurrency(summaryData.olderThanThreeMonths.total)}
            </TableCell>
            <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
              <Link
                href={`/invoice?start=&end=${format(
                  summaryData.olderThanThreeMonths.end,
                  "yyyy-MM-dd"
                )}`}
                style={linkStyle}
              >
                View Details
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Page;
