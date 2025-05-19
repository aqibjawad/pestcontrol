"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/ledger.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { format } from "date-fns";
import withAuth from "@/utils/withAuth";
import DateFilters from "@/components/generic/DateFilters";
import { cashLedger } from "../../networkUtil/Constants";
import APICall from "../../networkUtil/APICall";

const Page = () => {
  const api = new APICall();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }
    try {
      const response = await api.getDataWithToken(
        `${cashLedger}/cash/get?${queryParams.join("&")}`
      );
      setRowData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleExport = () => {
    if (!rowData || rowData.length === 0) {
      console.warn("No data available to export");
      return;
    }

    const doc = new jsPDF();

    const logoPath = "/logo.jpeg";
    const logoWidth = 35;
    const logoHeight = 20;

    // Add title
    doc.setFontSize(16);
    doc.text("Cash Ledger Report", 14, 20);

    // Add date range
    doc.setFontSize(12);
    const dateText =
      startDate && endDate
        ? `Date: ${format(new Date(startDate), "dd/MM/yyyy")} - ${format(
            new Date(endDate),
            "dd/MM/yyyy"
          )}`
        : `Date: ${format(new Date(), "dd/MM/yyyy")}`;
    doc.text(dateText, 14, 30);

    // Add logo to the right end of the header
    doc.addImage(logoPath, "PNG", 170, 10, logoWidth, logoHeight);

    // Define table headers
    const headers = [
      "Sr No",
      "Description",
      "Paid By",
      "Paid To",
      "Date",
      "Cash Amount",
    ];

    // Define table body
    const body = rowData.map((row, index) => [
      index + 1,
      row.description,
      row.personable?.name || "N/A",
      row.referenceable?.name || "Other Cash Expenses",
      format(new Date(row.updated_at), "yyyy-MM-dd"),
      row.cash_balance,
    ]);

    // Add table with header styling
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: { fillColor: [50, 169, 46], textColor: 255 }, // #32A92E color
    });

    doc.save("cash-ledger-report.pdf");
  };

  const totalCashAmount = useMemo(() => {
    return rowData
      .reduce((total, row) => total + parseFloat(row.cash_amt || 0), 0)
      .toFixed(2);
  }, [rowData]);

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <div className="pageTitle">Cash Ledger</div>
        <div className="flex gap-2">
          <div className="border border-green-600 rounded-md h-10 w-40 flex items-center justify-center">
            <DateFilters onDateChange={handleDateChange} />
          </div>

          <Button variant="contained" color="primary" onClick={handleExport}>
            Download PDF
          </Button>
        </div>
      </div>

      <TableContainer className="mt-5" component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Paid By</TableCell>
              <TableCell>Paid To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Cash Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array(6)
                      .fill()
                      .map((_, i) => (
                        <TableCell key={i}>
                          <Skeleton variant="wave" width={100} />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              : rowData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.personable.name}</TableCell>
                    <TableCell>
                      {row?.referenceable?.name || "Other Cash Expenses"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(row.updated_at), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>{row.cash_amt}</TableCell>
                    <TableCell>{row.cash_balance}</TableCell>
                  </TableRow>
                ))}
            {!loading && (
              <TableRow>
                <TableCell colSpan={5} align="right">
                  <strong>Total Cash:</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalCashAmount}</strong>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default withAuth(Page);
