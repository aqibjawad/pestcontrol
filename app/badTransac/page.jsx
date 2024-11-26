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
    thisMonth: { total: 0, count: 0 },
    lastMonth: { total: 0, count: 0 },
    lastThreeMonths: { total: 0, count: 0 },
    olderThanThreeMonths: { total: 0, count: 0 }, // New category
  });
  const [statusFilter, setStatusFilter] = useState("all");

  const getAllQuotes = async () => {
    setFetchingData(true);
    setLoadingDetails(true);

    const currentDate = format(new Date(), "yyyy-MM-dd");
    const queryParams = [
      `start_date=${currentDate}`,
      `end_date=${currentDate}`,
    ];

    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);

      let filteredData = response.data;
      if (statusFilter !== "all") {
        filteredData = response.data.filter(
          (invoice) => invoice.status.toLowerCase() === statusFilter
        );
      }

      setInvoiceList(filteredData);
      processInvoiceData(filteredData);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setInvoiceList([]);
      processInvoiceData([]);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const processInvoiceData = (data) => {
    if (!Array.isArray(data)) return;

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const threeMonthsAgoStart = startOfMonth(subMonths(now, 3));
    const threeMonthsAgoEnd = endOfMonth(now);

    const summary = {
      thisMonth: { total: 0, count: 0 },
      lastMonth: { total: 0, count: 0 },
      lastThreeMonths: { total: 0, count: 0 },
      olderThanThreeMonths: { total: 0, count: 0 }, // New category
    };

    try {
      data.forEach((invoice) => {
        if (!invoice?.issued_date) return;

        const issueDate = new Date(invoice.issued_date);
        const amount = parseFloat(invoice.total_amt) || 0;

        // Check for older than 3 months first
        if (isBefore(issueDate, threeMonthsAgoStart)) {
          summary.olderThanThreeMonths.total += amount;
          summary.olderThanThreeMonths.count++;
          return; // Skip other checks if it's older than 3 months
        }

        if (
          isWithinInterval(issueDate, {
            start: thisMonthStart,
            end: thisMonthEnd,
          })
        ) {
          summary.thisMonth.total += amount;
          summary.thisMonth.count++;
        }

        if (
          isWithinInterval(issueDate, {
            start: lastMonthStart,
            end: lastMonthEnd,
          })
        ) {
          summary.lastMonth.total += amount;
          summary.lastMonth.count++;
        }

        if (
          isWithinInterval(issueDate, {
            start: threeMonthsAgoStart,
            end: threeMonthsAgoEnd,
          })
        ) {
          summary.lastThreeMonths.total += amount;
          summary.lastThreeMonths.count++;
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
          Invoice Summary
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
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Calculate total amount across all periods
  const totalAmount =
    summaryData.thisMonth.total +
    summaryData.lastMonth.total +
    summaryData.lastThreeMonths.total +
    summaryData.olderThanThreeMonths.total;

  return (
    <TableContainer component={Paper} elevation={1}>
      <Typography
        variant="h6"
        sx={{ p: 2, borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
      >
        Invoice Summary
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
              <Link href="/invoice" style={linkStyle}>
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
              <Link href="/invoice" style={linkStyle}>
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
              <Link href="/invoice" style={linkStyle}>
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
              <Link href="/invoice" style={linkStyle}>
                View Details
              </Link>
            </TableCell>
          </TableRow>
          {/* Total Row */}
          <TableRow hover>
            <TableCell
              sx={{
                ...bodyCellStyle,
                fontWeight: "bold",
                borderTop: "2px solid rgba(224, 224, 224, 1)",
              }}
            >
              Total
            </TableCell>
            <TableCell
              sx={{
                ...bodyCellStyle,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              {summaryData.thisMonth.count +
                summaryData.lastMonth.count +
                summaryData.lastThreeMonths.count +
                summaryData.olderThanThreeMonths.count}
            </TableCell>
            <TableCell
              sx={{
                ...bodyCellStyle,
                ...amountCellStyle,
                fontWeight: "bold",
              }}
            >
              {formatCurrency(totalAmount)}
            </TableCell>
            <TableCell sx={bodyCellStyle} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Page;
