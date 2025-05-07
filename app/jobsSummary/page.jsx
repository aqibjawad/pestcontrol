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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import Link from "next/link";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import DateFilters from "../../components/generic/DateFilters";
import { format, differenceInDays, parseISO } from "date-fns";

const Page = () => {
  const api = new APICall();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("daysUntilExpiration");

  const [fetchingData, setFetchingData] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Status filter state
  const [statusFilters, setStatusFilters] = useState({
    completed: false,
    pending: false,
    inProcess: false,
    rescheduled: false,
  });

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Handle status filter changes
  const handleFilterChange = (filterName, value) => {
    setStatusFilters((prev) => ({
      ...prev,
      [filterName]: value !== undefined ? value : !prev[filterName],
    }));
  };

  // Handle dropdown change for status filter
  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    if (value === "all") {
      setStatusFilters({
        completed: false,
        pending: false,
        inProcess: false,
        rescheduled: false,
      });
    } else {
      setStatusFilters({
        completed: value === "completed",
        pending: value === "pending",
        inProcess: value === "inProcess",
        rescheduled: value === "rescheduled",
      });
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [startDate, endDate]);

  useEffect(() => {
    // Apply all filters: search and status filters
    if (!Array.isArray(jobList)) {
      setFilteredJobList([]);
      return;
    }

    let filtered = [...jobList];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((job) => {
        // Check firm name
        const firmNameMatch = job?.user?.client?.firm_name
          ?.toLowerCase()
          ?.includes(searchLower);

        // Check reference name
        const referenceMatch = job?.user?.client?.referencable?.name
          ?.toLowerCase()
          ?.includes(searchLower);

        // Check job title
        const jobTitleMatch = job?.job_title
          ?.toLowerCase()
          ?.includes(searchLower);

        // Return true if any field matches
        return firmNameMatch || referenceMatch || jobTitleMatch;
      });
    }

    // Apply status filters if any is selected
    const hasActiveFilters = Object.values(statusFilters).some((val) => val);

    if (hasActiveFilters) {
      filtered = filtered.filter((job) => {
        // Check completed status (is_completed = 1)
        if (
          statusFilters.completed &&
          job.is_completed === 1 &&
          job.is_modified !== 1
        ) {
          return true;
        }

        // Check pending status (is_completed = 0)
        if (statusFilters.pending && job.is_completed === 0) {
          return true;
        }

        // Check in process status (is_completed = 2)
        if (statusFilters.inProcess && job.is_completed === 2) {
          return true;
        }

        // Check rescheduled status (is_modified = 1)
        if (statusFilters.rescheduled && job.is_modified === 1) {
          return true;
        }

        return false;
      });
    }

    setFilteredJobList(filtered);
  }, [searchTerm, jobList, statusFilters]);

  const getAllJobs = async () => {
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
      const [jobsResponse] = await Promise.all([
        api.getDataWithToken(`${job}/overall?${queryParams.join("&")}`),
      ]);

      // Ensure we're setting an array even if the API returns something else
      const responseArray = Array.isArray(jobsResponse?.data)
        ? jobsResponse.data
        : [];

      setJobList(responseArray);
      setFilteredJobList(responseArray); // Initialize filtered list with all data
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobList([]);
      setFilteredJobList([]);
    } finally {
      setFetchingData(false);
    }
  };

  // Calculate counts for different statuses based on filtered list
  const safeFilteredList = Array.isArray(filteredJobList)
    ? filteredJobList
    : [];

  const completedCount = safeFilteredList.filter(
    (job) => job.is_completed === 1 && job.is_modified !== 1
  ).length;

  const pendingCount = safeFilteredList.filter(
    (job) => job.is_completed === 0
  ).length;

  const inProcessCount = safeFilteredList.filter(
    (job) => job.is_completed === 2
  ).length;

  const rescheduledCount = safeFilteredList.filter(
    (job) => job.is_modified === 1
  ).length;

  const totalCount = safeFilteredList.length;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortData = (data) => {
    if (!orderBy || !Array.isArray(data)) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      if (orderBy === "status") {
        // Sort by job status
        aValue = getJobStatus(a);
        bValue = getJobStatus(b);
      } else if (orderBy === "job_date") {
        // Sort by job date
        aValue = a.job_date || "";
        bValue = b.job_date || "";
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

      if (order === "desc") {
        [aValue, bValue] = [bValue, aValue];
      }
      return (aValue || "").toString().localeCompare((bValue || "").toString());
    });
  };

  // Get job status text
  const getJobStatus = (job) => {
    if (job.is_modified === 1) return "Rescheduled";
    if (job.is_completed === 1) return "Completed";
    if (job.is_completed === 2) return "In Process";
    if (job.is_completed === 0) return "Pending";
    return "Unknown";
  };

  // Get job status style
  const getJobStatusStyle = (job) => {
    if (job.is_modified === 1) return { color: "#9333ea", fontWeight: "bold" }; // Purple for rescheduled
    if (job.is_completed === 1) return { color: "#16a34a", fontWeight: "bold" }; // Green for completed
    if (job.is_completed === 2) return { color: "#2563eb", fontWeight: "bold" }; // Blue for in process
    if (job.is_completed === 0) return { color: "#f59e0b", fontWeight: "bold" }; // Amber for pending
    return {};
  };

  const sortedData = sortData(safeFilteredList);

  const sortLabelStyles = {
    "& .MuiTableSortLabel-icon": {
      opacity: 1, // Make arrows always visible
      width: "20px", // Slightly larger arrows
      height: "20px",
    },
  };

  const handleDownloadPDF = (pdfUrl, customerName) => {
    if (!pdfUrl) return;

    // Create an anchor element and set properties for download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Job_${customerName || "document"}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download the entire table data as PDF
  const downloadTableAsPDF = () => {
    if (!Array.isArray(sortedData) || sortedData.length === 0) {
      alert("No data available to download");
      return;
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF("landscape");

      // Add title
      doc.setFontSize(18);
      doc.text("Jobs Report", 14, 22);

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
      if (statusFilters.completed) activeFilters.push("Completed");
      if (statusFilters.pending) activeFilters.push("Pending");
      if (statusFilters.inProcess) activeFilters.push("In Process");
      if (statusFilters.rescheduled) activeFilters.push("Rescheduled");

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
        row?.user?.client?.firm_name || "N/A",
        row?.user?.client?.referencable?.name || "N/A",
        row.job_title || "N/A",
        row.job_date || "N/A",
        row?.job_services
          ?.map((service) => service.service?.service_title)
          .join(", ") || "N/A",
        row.priority || "N/A",
        row.sub_total || "0.00",
        row.grand_total || "0.00",
        getJobStatus(row),
      ]);

      // Set column headers
      const headers = [
        "Sr No",
        "Customer",
        "Reference",
        "Job Title",
        "Job Date",
        "Services",
        "Priority",
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
        startY: 62, // Adjusted starting position
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
      doc.rect(14, finalY, pageWidth - 28, 80, "F");

      // Add bottom summary title
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text("Jobs Summary", 20, finalY + 10);

      // Add main summary content
      doc.setFontSize(10);
      doc.text(`Completed: ${completedCount}`, 20, finalY + 25);
      doc.text(`Pending: ${pendingCount}`, 20, finalY + 35);
      doc.text(`In Process: ${inProcessCount}`, 20, finalY + 45);
      doc.text(
        `Rescheduled: ${rescheduledCount}`,
        pageWidth / 2 - 30,
        finalY + 25
      );
      doc.text(`Total: ${totalCount}`, pageWidth / 2 - 30, finalY + 35);

      // Add a footer note
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      // Save the PDF
      doc.save(`Jobs_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
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
              <TableCell>Reference</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "job_date"}
                  direction={orderBy === "job_date" ? order : "asc"}
                  onClick={() => handleRequestSort("job_date")}
                  sx={sortLabelStyles}
                >
                  Job Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Priority</TableCell>
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
            ) : !Array.isArray(sortedData) || sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <div
                    style={{ padding: "20px", fontSize: "16px", color: "#666" }}
                  >
                    No jobs found matching your search criteria
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <React.Fragment key={row.id || index}>
                  <TableRow hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row?.user?.client?.firm_name ? (
                        <Link href={`/quotePdf?id=${row.id}`}>
                          {row.user.client.firm_name}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {row?.user?.client?.referencable?.name || "N/A"}
                    </TableCell>
                    <TableCell>{row?.job_title || "N/A"}</TableCell>
                    <TableCell>{row?.job_date || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={row?.priority || "Normal"}
                        color={row?.priority === "high" ? "error" : "primary"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row?.sub_total || "0.00"}</TableCell>
                    <TableCell>{row?.grand_total || "0.00"}</TableCell>
                    <TableCell>
                      <div style={getJobStatusStyle(row)}>
                        {getJobStatus(row)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/viewJob?id=${row.id}`}>
                        <span style={{ color: "#2563eb", cursor: "pointer" }}>
                          View Details
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                  {expandedRows[row.id] &&
                    row.job_services &&
                    row.job_services.length > 0 && (
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
                              <Table size="small" aria-label="job services">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Service Name</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row.job_services.map(
                                    (service, serviceIndex) => (
                                      <TableRow key={serviceIndex}>
                                        <TableCell>
                                          {service?.service?.service_title ||
                                            "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {service.rate || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            label={service.status || "N/A"}
                                            color={
                                              service.status === "completed"
                                                ? "success"
                                                : service.status ===
                                                  "in_progress"
                                                ? "info"
                                                : "default"
                                            }
                                            size="small"
                                          />
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
          Jobs Summary
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
            placeholder="Search by firm name, reference or job title..."
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

          {/* Status Filter Dropdown */}
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">Status Filter</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={
                Object.values(statusFilters).every((v) => !v)
                  ? "all"
                  : statusFilters.completed
                  ? "completed"
                  : statusFilters.pending
                  ? "pending"
                  : statusFilters.inProcess
                  ? "inProcess"
                  : "rescheduled"
              }
              onChange={handleStatusFilterChange}
              label="Status Filter"
              sx={{ height: "44px", backgroundColor: "#fff" }}
            >
              <MenuItem value="all">All Jobs</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inProcess">In Process</MenuItem>
              <MenuItem value="rescheduled">Rescheduled</MenuItem>
            </Select>
          </FormControl>

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
              <DateFilters onDateChange={handleDateChange} />
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
            {statusFilters.completed && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                Completed
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
            {statusFilters.rescheduled && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                Rescheduled
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      {/* Job Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {completedCount}
            </p>
          </div>

          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>

          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-gray-600">In Process</p>
            <p className="text-2xl font-bold text-blue-600">{inProcessCount}</p>
          </div>

          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <p className="text-sm text-gray-600">Rescheduled</p>
            <p className="text-2xl font-bold text-purple-600">
              {rescheduledCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
