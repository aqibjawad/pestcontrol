"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { clients } from "../../../networkUtil/Constants";
import Link from "next/link";
import DateFilters2 from "@/components/generic/DateFilters2";
import { format } from "date-fns";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Transactions = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Generate data for export
  const generateExportData = () => {
    return quoteList
      .map((quote, index) => {
        const latestEntry = getLatestEntry(quote.ledger_entries);
        if (!latestEntry) return null;

        return {
          "Sr No": index + 1,
          Date: new Date(latestEntry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          "Client Name": quote.name,
          Amount:
            latestEntry.entry_type === "cr"
              ? latestEntry.cr_amt
              : latestEntry.dr_amt,
          Reference: latestEntry.referenceable?.name || "N/A",
        };
      })
      .filter(Boolean); // Remove null entries
  };

  // Download as CSV
  const downloadCSV = () => {
    const data = generateExportData();
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${startDate || "all"}_${endDate || "all"}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download as Excel
  const downloadExcel = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(
      workbook,
      `transactions_${startDate || "all"}_${endDate || "all"}.xlsx`
    );
  };

  // Download as PDF
  const downloadPDF = () => {
    const img = new Image();
    img.src = "/logo.jpeg"; // Update with your logo path

    img.onload = () => {
      const doc = new jsPDF();

      // Calculate dimensions while maintaining aspect ratio
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 50; // mm
      const logoHeight = (img.height * logoWidth) / img.width;
      const xPosition = (pageWidth - logoWidth) / 2;

      // Add logo
      doc.addImage(img, "jpeg", xPosition, 10, logoWidth, logoHeight);

      // Add header text
      doc.setFontSize(12);
      doc.text(`Approved Payments Report`, pageWidth / 2, logoHeight + 20, {
        align: "center",
      });
      doc.text(
        `Date Range: ${startDate || "All"} to ${endDate || "All"}`,
        pageWidth / 2,
        logoHeight + 30,
        { align: "center" }
      );

      // Add table
      const data = generateExportData();
      const headers = Object.keys(data[0]);
      const rows = data.map((row) => Object.values(row));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: logoHeight + 40,
        margin: { top: logoHeight + 40 },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [50, 169, 46] },
      });

      doc.save(`transactions_${startDate || "all"}_${endDate || "all"}.pdf`);
    };
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  const getAllQuotes = async () => {
    setFetchingData(true);

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      const startDate = format(firstDayOfMonth, "yyyy-MM-dd");
      const endDate = format(lastDayOfMonth, "yyyy-MM-dd");

      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${clients}/received_amount/get?${queryParams.join("&")}`
      );
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getLatestEntry = (ledgerEntries) => {
    if (!ledgerEntries || ledgerEntries.length === 0) return null;
    const sortedEntries = [...ledgerEntries].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return sortedEntries[0];
  };

  const listServiceTable = () => {
    // Calculate total amount
    const totalAmount = quoteList?.reduce((sum, quote) => {
      const latestEntry = getLatestEntry(quote.ledger_entries);
      if (!latestEntry) return sum;

      const amount =
        latestEntry.entry_type === "cr"
          ? latestEntry.cr_amt
          : latestEntry.dr_amt;

      return sum + parseFloat(amount || 0);
    }, 0);

    return (
      <>
        {/* Export Buttons */}
        <div className="flex gap-2 mb-4 justify-end px-4">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download size={16} />
            Excel
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={16} />
            CSV
          </button>
        </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Recieved By</TableCell>
                <TableCell>View Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetchingData ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                quoteList?.map((quote, index) => {
                  const latestEntry = getLatestEntry(quote.ledger_entries);
                  if (!latestEntry) return null;

                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {new Date(latestEntry.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>{quote.name}</TableCell>
                      <TableCell>
                        {latestEntry.entry_type === "cr"
                          ? latestEntry.cr_amt
                          : latestEntry.dr_amt}
                      </TableCell>
                      <TableCell>
                        {latestEntry.referenceable?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/client/clientLedger/?id=${
                            quote.id
                          }&name=${encodeURIComponent(
                            quote.name
                          )}&phone_number=${encodeURIComponent(
                            quote?.client?.phone_number
                          )}`}
                        >
                          <span className="text-blue-600 hover:text-blue-800">
                            View Details
                          </span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}

              {/* Total Amount Row */}
              {!fetchingData && (
                <TableRow>
                  <TableCell colSpan={3} style={{ fontWeight: "bold" }}>
                    Total Amount:
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "-4rem" }}
        >
          Approved Payments
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "44px",
              width: "202px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "1rem",
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            <DateFilters2 onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>
    </div>
  );
};

export default Transactions;
