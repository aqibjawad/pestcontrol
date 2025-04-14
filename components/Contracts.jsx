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
  Skeleton,
  TableSortLabel,
  Button,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import Link from "next/link";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf"; // Make sure to npm install jspdf
import "jspdf-autotable"; // Make sure to npm install jspdf-autotable

import DateFilters from "./generic/DateFilters";
import { format, differenceInDays, parseISO } from "date-fns";

const Contracts = () => {
  const api = new APICall();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("daysUntilExpiration"); // Default sort by days until expiration

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
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
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const [contactsResponse] = await Promise.all([
        api.getDataWithToken(
          `${quotation}/contracted?${queryParams.join("&")}`
        ),
      ]);

      // Process the data to calculate days until expiration
      const today = new Date();
      const mergedData = contactsResponse.data.map((contract) => {
        let daysUntilExpiration = null;
        if (contract.contract_end_date) {
          const expirationDate = parseISO(contract.contract_end_date);
          daysUntilExpiration = differenceInDays(expirationDate, today);
        }
        return {
          ...contract,
          daysUntilExpiration,
        };
      });

      setQuoteList(mergedData);
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // Calculate counts for different statuses
  const activeCount = quoteList.filter(
    (quote) => quote.is_contracted === 1
  ).length;
  const pendingCount = quoteList.filter(
    (quote) => quote.is_contracted === 0
  ).length;
  const inProcessCount = quoteList.filter(
    (quote) => quote.is_contracted === 2
  ).length;
  const expiredCount = quoteList.filter(
    (quote) =>
      quote.contract_cancel_reason === "expired" && quote.contract_cancelled_at
  ).length;

  const totalCount = quoteList.length;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      if (orderBy === "status") {
        // Sort by contract cancel status
        aValue = a?.contract_cancel_reason ? "Canceled" : "Active";
        bValue = b?.contract_cancel_reason ? "Canceled" : "Active";
      } else if (orderBy === "daysUntilExpiration") {
        // Sort by days until expiration
        aValue =
          a.daysUntilExpiration === null ? Infinity : a.daysUntilExpiration;
        bValue =
          b.daysUntilExpiration === null ? Infinity : b.daysUntilExpiration;

        // Numeric comparison for days
        if (order === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        aValue =
          orderBy === "id"
            ? a.id
            : orderBy === "customer"
            ? a?.user?.name
            : a[orderBy];
        bValue =
          orderBy === "id"
            ? b.id
            : orderBy === "customer"
            ? b?.user?.name
            : b[orderBy];
      }

      if (orderBy !== "daysUntilExpiration") {
        if (order === "desc") {
          [aValue, bValue] = [bValue, aValue];
        }
        return (aValue || "")
          .toString()
          .localeCompare((bValue || "").toString());
      }
      return 0;
    });
  };

  const sortedData = sortData(quoteList);

  const sortLabelStyles = {
    "& .MuiTableSortLabel-icon": {
      opacity: 1, // Make arrows always visible
      width: "20px", // Slightly larger arrows
      height: "20px",
    },
  };

  // Function to render expiration warning style
  const getExpirationStyle = (days) => {
    if (days === null) return {};
    if (days < -60) return { color: "#dc2626", fontWeight: "bold" }; // More than 2 months overdue
    if (days < 0) return { color: "#f59e0b", fontWeight: "bold" }; // Expired but less than 2 months
    if (days <= 30) return { color: "#f59e0b", fontWeight: "bold" }; // Expires within a month
    return {};
  };

  // Function to render expiration text
  const getExpirationText = (days) => {
    if (days === null) return "No expiration date";
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    return `Expires in ${days} days`;
  };

  const handleDownloadPDF = (pdfUrl, customerName) => {
    if (!pdfUrl) return;

    // Create an anchor element and set properties for download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Contract_${customerName || "document"}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download the entire table data as PDF
  const downloadTableAsPDF = () => {
    if (!sortedData || sortedData.length === 0) {
      alert("No data available to download");
      return;
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF("landscape");

      // Add title
      doc.setFontSize(18);
      doc.text("Contracts Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), "yyyy-MM-dd")}`, 14, 30);

      // Filter period if available
      if (startDate && endDate) {
        doc.text(`Period: ${startDate} to ${endDate}`, 14, 38);
      }

      // Prepare table data
      const tableData = sortedData.map((row, index) => [
        index + 1,
        row?.user?.name || "",
        row?.jobs[0]?.total_jobs || 0,
        row?.jobs?.length || 0,
        row.billing_method || "",
        row.quote_title || "",
        row?.treatment_methods?.map((method) => method.name).join(", ") ||
          "N/A",
        row.contract_end_date || "",
        getExpirationText(row.daysUntilExpiration),
        row.sub_total || "",
        row.grand_total || "",
        !row?.contract_cancel_reason ? "Active" : "Canceled",
      ]);

      // Set column headers
      const headers = [
        "Sr No",
        "Customer",
        "Total Jobs",
        "Completed Jobs",
        "Billing Method",
        "Quote Title",
        "Treatment Methods",
        "Contract End Date",
        "Expiration Status",
        "Sub Total",
        "Grand Total",
        "Status",
      ];

      // Generate the table
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 45,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [50, 169, 46], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 45 },
      });

      // Save the PDF
      doc.save(`Contracts_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customer"}
                  direction={orderBy === "customer" ? order : "asc"}
                  onClick={() => handleRequestSort("customer")}
                  sx={sortLabelStyles}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>Total Jobs</TableCell>
              <TableCell>Completed Jobs</TableCell>
              <TableCell>Billing Method</TableCell>
              <TableCell>Quote Title</TableCell>
              <TableCell>Treatment Method Name</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "daysUntilExpiration"}
                  direction={orderBy === "daysUntilExpiration" ? order : "asc"}
                  onClick={() => handleRequestSort("daysUntilExpiration")}
                  sx={sortLabelStyles}
                >
                  Expire At
                </TableSortLabel>
              </TableCell>
              <TableCell>Sub Total</TableCell>
              <TableCell>Grand Total</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                  sx={sortLabelStyles}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>PDF</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width="80%"
                      height={40}
                      sx={{ margin: "8px auto" }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.user?.name}</TableCell>
                  <TableCell>{row?.jobs[0]?.total_jobs}</TableCell>
                  <TableCell>{row?.jobs?.length}</TableCell>
                  <TableCell>{row.billing_method}</TableCell>
                  <TableCell>{row.quote_title}</TableCell>
                  <TableCell>
                    {row?.treatment_methods
                      ?.map((method) => method.name)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div>{row.contract_end_date}</div>
                    <div style={getExpirationStyle(row.daysUntilExpiration)}>
                      {getExpirationText(row.daysUntilExpiration)}
                    </div>
                  </TableCell>
                  <TableCell>{row.sub_total}</TableCell>
                  <TableCell>{row.grand_total}</TableCell>
                  <TableCell>
                    {!row?.contract_cancel_reason ? (
                      <div style={{ color: "green", fontWeight: "bold" }}>
                        Active
                      </div>
                    ) : (
                      <div style={{ color: "#dc2626" }}>
                        Contract is Canceled
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {row?.pdf_url ? (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={() =>
                          handleDownloadPDF(row.pdf_url, row?.user?.name)
                        }
                        sx={{
                          backgroundColor: "#2563eb",
                          "&:hover": {
                            backgroundColor: "#1d4ed8",
                          },
                          fontWeight: "bold",
                          fontSize: "12px",
                          padding: "6px 12px",
                        }}
                      >
                        Download
                      </Button>
                    ) : (
                      <span style={{ color: "#666" }}>No PDF</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!row?.contract_cancel_reason ? (
                      <Link href={`/contractCancel?id=${row.id}`}>
                        <span style={{ color: "#dc2626", cursor: "pointer" }}>
                          Contract Cancel
                        </span>
                      </Link>
                    ) : (
                      <Link href={`/contractCancel?id=${row.id}`}>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#dc2626",
                            cursor: "pointer",
                          }}
                        >
                          Cancel Contract
                        </span>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "1rem" }}
        >
          Contracts
        </div>

        {/* Quote Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-gray-600">In Process</p>
              <p className="text-2xl font-bold text-blue-600">
                {inProcessCount}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
            gap: "12px",
          }}
        >
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={downloadTableAsPDF}
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": {
                backgroundColor: "#15803d",
              },
              fontWeight: "600",
              height: "44px",
              width: "180px",
              fontSize: "14px",
            }}
          >
            EXPORT PDF
          </Button>

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
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>
    </div>
  );
};

export default Contracts;
