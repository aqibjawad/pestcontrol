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
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { outstandings } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
const Page = () => {
  const api = new APICall();
  const router = useRouter();
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
      const response = await api.getDataWithToken(`${outstandings}`);

      setInvoiceList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setInvoiceList([]);
      processInvoiceData([], calculateDateRanges());
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    getAllQuotes();
  }, []);

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

  const handleNavigation = (index) => {
    let dateRange = {
      start: "",
      end: "",
    };
    if (index === 3) {
      const today = new Date();
      const startDate = endOfMonth(today);
      const fourthMonth = subMonths(today, 4);
      const endDate = endOfMonth(fourthMonth);

      dateRange = {
        start: "2023-9-31",
        end: format(endDate, "yyyy-M-dd"),
      };
    } else {
      const today = new Date();
      const targetMonth = subMonths(today, index);
      const startDate = startOfMonth(targetMonth);
      const endDate = endOfMonth(targetMonth);

      dateRange = {
        start: format(startDate, "yyyy-M-dd"),
        end: format(endDate, "yyyy-M-dd"),
      };
    }

    // Navigate to invoice page with date parameters
    router.push(`/invoice?start=${dateRange.start}&end=${dateRange.end}`);
  };

  return (
    <>
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
            {invoiceList.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell sx={bodyCellStyle}>{row.title}</TableCell>
                <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
                  {row.count}
                </TableCell>
                <TableCell sx={{ ...bodyCellStyle, ...amountCellStyle }}>
                  {parseFloat(row.total_amt).toLocaleString("en-US", {
                    style: "currency",
                    currency: "AED",
                  })}
                </TableCell>
                <TableCell sx={{ ...bodyCellStyle, textAlign: "right" }}>
                  <button
                    onClick={() => handleNavigation(index)}
                    style={linkStyle}
                  >
                    View Details
                  </button>

                  {/* <Link
                    href={`/invoice?start=${
                      row.title === "Older Than 3 Months"
                        ? ""
                        : format(
                            summaryData[
                              row.title.replace(/\s+/g, "").toLowerCase()
                            ].start,
                            "yyyy-MM-dd"
                          )
                    }&end=${format(
                      summaryData[row.title.replace(/\s+/g, "").toLowerCase()]
                        .end || new Date(),
                      "yyyy-MM-dd"
                    )}`}
                    style={linkStyle}
                  >
                    View Details
                  </Link> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default withAuth(Page);
