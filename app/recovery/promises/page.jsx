"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Button,
} from "@mui/material";
import {
  serviceInvoice,
  getAllEmpoyesUrl,
} from "../../../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import DateFilters from "@/components/generic/DateFilters";
import Dropdown from "@/components/generic/Dropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Page = () => {
  const api = new APICall();

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [fetchingData, setFetchingData] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [salesManagers, setSalesManagers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("All");
  const [allRecoveryList, setAllRecoveryList] = useState([]);
  const [selectedRecoveryId, setSelectedRecoveryId] = useState("");

  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    fetchVendors();
  }, [startDate, endDate]);

  const fetchVendors = async () => {
    setFetchingData(true);
    const queryParams = [];

    // Always include date parameters since they're initialized with today's date
    queryParams.push(`start_promise_date=${startDate}`);
    queryParams.push(`end_promise_date=${endDate}`);

    try {
      const response = await api.getDataWithToken(
        `${serviceInvoice}?${queryParams.join("&")}`
      );
      setVendorsData(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
    setFetchingData(false);
  };

  const getAllSalesManagers = async () => {
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/recovery_officer/get`
      );

      // Add "All" option at the beginning
      const formattedManagersWithIds = [
        { name: "All", id: "" },
        ...response.data.map((officer) => ({
          name: officer.name,
          id: officer.id,
        })),
      ];

      setAllRecoveryList(formattedManagersWithIds);
      setSalesManagers(formattedManagersWithIds.map((officer) => officer.name));
    } catch (error) {
      console.error("Error fetching sales managers:", error);
    }
  };

  const handleOfficerChange = (name, index) => {
    const idAtIndex = allRecoveryList[index]?.id || ""; // If "All" is selected, set to empty string
    setSelectedRecoveryId(idAtIndex);
    setSelectedOfficer(name);
  };

  useEffect(() => {
    getAllSalesManagers();
  }, []);

  const getFilteredData = () => {
    if (!selectedRecoveryId) return vendorsData;

    return vendorsData?.filter((row) => {
      const lastHistory =
        row.assigned_histories?.[row.assigned_histories?.length - 1];
      return lastHistory?.employee_user?.id === selectedRecoveryId;
    });
  };

  const summary = getFilteredData()?.reduce(
    (acc, row) => {
      acc.totalAmount += parseFloat(row.total_amt || 0);
      acc.paidAmount += parseFloat(row.paid_amt || 0);
      acc.totalInvoices += 1;
      if (row.status === "paid") acc.paidInvoices += 1;

      // Check if promise_date exists
      if (row.promise_date) acc.promiseInvoices += 1;

      return acc;
    },
    {
      totalAmount: 0,
      paidAmount: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      promiseInvoices: 0,
    }
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const logo = "/logo.jpeg";
    const pageWidth = doc.internal.pageSize.width;

    // Add logo with reduced height
    doc.addImage(logo, "PNG", pageWidth / 2 - 20, 10, 40, 20); // Height reduced from 30 to 20

    // Add title
    doc.text("Recovery Officers Data", pageWidth / 2, 35, { align: "center" });

    // Add filters in a single line
    let currentY = 45;
    doc.setFontSize(11);

    let filterText = `Recovery Officer: ${selectedOfficer}`;
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toLocaleDateString();
      const formattedEndDate = new Date(endDate).toLocaleDateString();
      filterText += ` | Date Range: ${formattedStartDate} - ${formattedEndDate}`;
    }
    doc.text(filterText, 20, currentY);
    currentY += 8;

    // Add summary heading
    doc.setFontSize(12);
    doc.text("Summary", 20, currentY);
    currentY += 5;

    // Create summary table
    autoTable(doc, {
      startY: currentY,
      head: [["Metric", "Value"]],
      body: [
        ["Total Amount", `${summary.totalAmount.toFixed(2)}`],
        ["Paid Amount", `${summary.paidAmount.toFixed(2)}`],
        ["Total Invoices", `${summary.totalInvoices}`],
        ["Paid Invoices", `${summary.paidInvoices}`],
        ["Promise Invoices", `${summary.promiseInvoices}`],
        ["Other Invoices", `${summary.otherInvoices}`],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { left: 20 },
      tableWidth: 160,
    });

    // Add main data table
    const filteredData = getFilteredData();
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [
        [
          "ID",
          "Firm Name",
          "Recovery Officer",
          "Paid Amount",
          "Total Amount",
          "Status",
          "Promise",
          "Other",
        ],
      ],
      body: filteredData.map((row, index) => {
        const lastHistory =
          row.assigned_histories?.[row.assigned_histories?.length - 1];
        return [
          index + 1,
          row?.user?.name || "-",
          lastHistory?.employee_user?.name || "-",
          row?.paid_amt || "-",
          row?.total_amt || "-",
          row?.status || "-",
          lastHistory?.promise_date || "-",
          lastHistory?.other || "-",
        ];
      }),
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { top: 0 },
      styles: { cellPadding: 2 },
    });

    doc.save("Recovery_Officers_Data.pdf");
  };

  // Export to Excel/CSV
  const exportToExcelOrCSV = (format) => {
    const data = vendorsData.map((row, index) => {
      const lastHistory =
        row.assigned_histories?.[row.assigned_histories?.length - 1];
      return {
        ID: index + 1,
        "Firm Name": row?.user?.name || "-",
        "Recovery Officer": lastHistory?.employee_user?.name || "-",
        "Paid Amount": row?.paid_amt || "-",
        "Total Amount": row?.total_amt || "-",
        Status: row?.status || "-",
        Promise: lastHistory?.promise_date || "-",
        Other: lastHistory?.other || "-",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recovery Officers Data");

    if (format === "xlsx") {
      XLSX.writeFile(workbook, "Recovery_Officers_Data.xlsx");
    } else {
      XLSX.writeFile(workbook, "Recovery_Officers_Data.csv");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div className="flex justify-between items-center mb-6">
          <div
            style={{
              fontSize: "20px",
              fontFamily: "semibold",
              marginBottom: "1rem",
            }}
          >
            Invoice Promises
          </div>

          <div className="flex items-center gap-4">
            <div style={{ width: "250px" }}>
              <Dropdown
                value={selectedOfficer}
                onChange={handleOfficerChange}
                title="Recovery Officers"
                options={salesManagers}
                className="w-full"
              />
            </div>

            <div className="bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg mt-8">
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4 space-x-2 mt-5">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          PDF
        </button>

        <button
          onClick={() => exportToExcelOrCSV("xlsx")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Excel
        </button>

        <button
          onClick={() => exportToExcelOrCSV("csv")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          CSV
        </button>
      </div>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={3}>
            {fetchingData
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Skeleton variant="text" width={120} />
                    </Typography>
                    <Typography variant="h6">
                      <Skeleton variant="text" width={80} />
                    </Typography>
                  </Grid>
                ))
              : [
                  {
                    label: "Total Amount",
                    value: summary?.totalAmount.toFixed(2),
                  },
                  { label: "Total Invoices", value: summary?.totalInvoices },
                  {
                    label: "Promise Invoices",
                    value: summary?.promiseInvoices,
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6">{item.value}</Typography>
                  </Grid>
                ))}
          </Grid>
        </CardContent>
      </Card>

      <TableContainer className="mt-5" component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#16A34A" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Firm Name</TableCell>
              <TableCell sx={{ color: "white" }}>
                Recovery Officer Name
              </TableCell>
              <TableCell sx={{ color: "white" }}>Paid Amount</TableCell>
              <TableCell sx={{ color: "white" }}>Total Amount</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
              <TableCell sx={{ color: "white" }}>Promise</TableCell>
              <TableCell sx={{ color: "white" }}>Other</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array(8)
                      .fill(null)
                      .map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              : getFilteredData()?.map((row, index) => {
                  const lastHistory =
                    row.assigned_histories?.[
                      row.assigned_histories?.length - 1
                    ];
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.user?.name}</TableCell>
                      <TableCell>
                        {lastHistory?.employee_user?.name || "-"}
                      </TableCell>
                      <TableCell>{row?.paid_amt}</TableCell>
                      <TableCell>{row?.total_amt}</TableCell>
                      <TableCell>{row?.status}</TableCell>
                      <TableCell>{lastHistory?.promise_date || "-"}</TableCell>
                      <TableCell>{lastHistory?.other || "-"}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Page;
