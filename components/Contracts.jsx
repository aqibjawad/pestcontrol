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
  TextField,
  InputAdornment,
  Collapse, 
  Box, 
  IconButton, 
  Typography,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon 
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import Link from "next/link";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import DateFilters from "./generic/DateFilters";
import { format, differenceInDays, parseISO } from "date-fns";

const Contracts = () => {
  const api = new APICall();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("daysUntilExpiration");

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [filteredQuoteList, setFilteredQuoteList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Add status filters state
  const [statusFilters, setStatusFilters] = useState({
    active: false,
    pending: false,
    inProcess: false,
    expired: false,
    canceled: false,
  });

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Handle status filter changes
  const handleFilterChange = (filterOptions) => {
    setStatusFilters(filterOptions);
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  useEffect(() => {
    // Apply all filters: search and status filters
    let filtered = quoteList;

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((quote) =>
        quote?.user?.client?.firm_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filters if any is selected
    const hasActiveFilters = Object.values(statusFilters).some((val) => val);

    if (hasActiveFilters) {
      filtered = filtered.filter((quote) => {
        // Check active status
        if (statusFilters.active && !quote.contract_cancel_reason) {
          return true;
        }

        // Check pending status
        if (statusFilters.pending && quote.is_contracted === 0) {
          return true;
        }

        // Check in process status
        if (statusFilters.inProcess && quote.is_contracted === 2) {
          return true;
        }

        // Check expired status
        if (
          statusFilters.expired &&
          quote.contract_cancel_reason === "expired" &&
          quote.contract_cancelled_at
        ) {
          return true;
        }

        // Check canceled status
        if (
          statusFilters.canceled &&
          quote.contract_cancel_reason &&
          quote.contract_cancel_reason !== "expired"
        ) {
          return true;
        }

        return false;
      });
    }

    setFilteredQuoteList(filtered);
  }, [searchTerm, quoteList, statusFilters]);

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
      setFilteredQuoteList(mergedData); // Initialize filtered list with all data
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // Calculate counts for different statuses based on filtered list
  const activeCount = filteredQuoteList.filter(
    (quote) => !quote.contract_cancel_reason
  ).length;
  const pendingCount = filteredQuoteList.filter(
    (quote) => quote.is_contracted === 0
  ).length;
  const inProcessCount = filteredQuoteList.filter(
    (quote) => quote.is_contracted === 2
  ).length;
  const expiredCount = filteredQuoteList.filter(
    (quote) =>
      quote.contract_cancel_reason === "expired" && quote.contract_cancelled_at
  ).length;
  const canceledCount = filteredQuoteList.filter(
    (quote) =>
      quote.contract_cancel_reason && quote.contract_cancel_reason !== "expired"
  ).length;

  const totalCount = filteredQuoteList.length;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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

  const sortedData = sortData(filteredQuoteList);

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

      // Add search filter info if applicable
      if (searchTerm) {
        doc.text(`Filtered by: "${searchTerm}"`, 14, 46);
      }

      // Add status filter information
      const activeFilters = [];
      if (statusFilters.active) activeFilters.push("Active");
      if (statusFilters.pending) activeFilters.push("Pending");
      if (statusFilters.inProcess) activeFilters.push("In Process");
      if (statusFilters.expired) activeFilters.push("Expired");
      if (statusFilters.canceled) activeFilters.push("Canceled");

      if (activeFilters.length > 0) {
        doc.text(`Status Filters: ${activeFilters.join(", ")}`, 14, 54);
      }

      // Add logo at the top right
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 45;
      const logoHeight = 30;
      const logoX = pageWidth - logoWidth - 15; // Position from right side
      const logoY = 15;
      doc.addImage("/logo.jpeg", "PNG", logoX, logoY, logoWidth, logoHeight);

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

      // Get the end Y position of table to know where to add the summary
      let finalY;

      // Generate the table
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 62, // Adjusted starting position for status filters
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [50, 169, 46], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 62 },
        didDrawPage: (data) => {
          finalY = data.cursor.y;
        },
      });

      // Add summary at the bottom of the table
      finalY = finalY || doc.autoTable.previous.finalY;
      finalY += 20; // Add some space after the table

      // Create bottom summary box
      doc.setFillColor(240, 240, 240);
      doc.rect(14, finalY, pageWidth - 28, 80, "F"); // Made taller to accommodate the main summary too

      // Add bottom summary title
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text("Contracts Summary", 20, finalY + 10);

      // Add main summary content
      doc.setFontSize(10);
      doc.text(`Active: ${activeCount}`, 20, finalY + 25);
      doc.text(`Pending: ${pendingCount}`, 20, finalY + 35);
      doc.text(`In Process: ${inProcessCount}`, 20, finalY + 45);
      doc.text(`Expired: ${expiredCount}`, pageWidth / 2 - 30, finalY + 25);
      doc.text(`Canceled: ${canceledCount}`, pageWidth / 2 - 30, finalY + 35);
      doc.text(`Total: ${totalCount}`, pageWidth / 2 - 30, finalY + 45);

      // Add a footer note
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      // Save the PDF
      doc.save(`Contracts_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const [expandedRows, setExpandedRows] = useState({});

  // Toggle accordion expansion for a specific row
  const toggleAccordion = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
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
              <TableCell>Quote Services</TableCell>
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
              <TableCell>View Details</TableCell>
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
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <div
                    style={{ padding: "20px", fontSize: "16px", color: "#666" }}
                  >
                    No contracts found matching your search criteria
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <React.Fragment key={row.id || index}>
                  <TableRow hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Link href={`/quotePdf?id=${row.id}`}>
                        {row?.user?.client?.firm_name}
                      </Link>
                    </TableCell>
                    <TableCell>{row?.jobs[0]?.total_jobs}</TableCell>
                    <TableCell>{row?.jobs?.length}</TableCell>
                    <TableCell
                      onClick={() => toggleAccordion(row.id)}
                      style={{
                        cursor: "pointer",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>{row.quote_services.length}</span>
                      {/* {row.quote_services.length > 0 && (
                        <IconButton size="small">
                          {expandedRows[row.id] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      )} */}
                    </TableCell>
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
                      <Link href={`/quotePdf?id=${row.id}`}>
                        <span style={{ color: "#2563eb", cursor: "pointer" }}>
                          View Details
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                  {expandedRows[row.id] && row.quote_services.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse
                          in={expandedRows[row.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 2 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Quote Services Details
                            </Typography>
                            <Table size="small" aria-label="quote services">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Service Name</TableCell>
                                  <TableCell>Job Type</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell>Service Cancel</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.quote_services.map(
                                  (service, serviceIndex) => (
                                    <TableRow key={serviceIndex}>
                                      <TableCell>
                                        {service?.service?.service_title || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {service.job_type || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {service.rate || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {service.service_cancel_reason || "N/A"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            gap: "12px",
          }}
        >
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search by firm name..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#fff",
                borderRadius: "8px",
                height: "44px",
                width: "300px",
              },
            }}
          />

          <div style={{ display: "flex", gap: "12px" }}>
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
              <DateFilters
                onDateChange={handleDateChange}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Display active filters */}
        {Object.values(statusFilters).some((val) => val) && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            <span style={{ fontWeight: "600" }}>Active filters:</span>
            {statusFilters.active && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                Active
              </span>
            )}
            {statusFilters.pending && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                Pending
              </span>
            )}
            {statusFilters.inProcess && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                In Process
              </span>
            )}
            {statusFilters.expired && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                Expired
              </span>
            )}
            {statusFilters.canceled && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                Canceled
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      {/* Quote Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-gray-600">In Process</p>
            <p className="text-2xl font-bold text-blue-600">{inProcessCount}</p>
          </div>
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-600">Canceled</p>
            <p className="text-2xl font-bold text-gray-600">{canceledCount}</p>
          </div>
        </div>

        <div className="mt-4 text-right">
          <span className="text-lg font-semibold">Total Contracts: </span>
          <span className="text-lg font-bold text-indigo-600">
            {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
