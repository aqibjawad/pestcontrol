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
  const [fetchingData, setFetchingData] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [salesManagers, setSalesManagers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("All");
  const [allRecoveryList, setAllRecoveryList] = useState([]);
  const [selectedRecoveryId, setSelectedRecoveryId] = useState("");

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
    if (startDate && endDate) {
      queryParams.push(`start_promise_date=${startDate}`);
      queryParams.push(`end_promise_date=${endDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${serviceInvoice}/assign_invoice/states?${queryParams.join("&")}`
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

      const lastHistory =
        row.assigned_histories?.[row.assigned_histories.length - 1];
      if (lastHistory?.promise_date) acc.promiseInvoices += 1;
      if (lastHistory?.other) acc.otherInvoices += 1;

      return acc;
    },
    {
      totalAmount: 0,
      paidAmount: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      promiseInvoices: 0,
      otherInvoices: 0,
    }
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const logo = "/logo.jpeg"; // 🔹 Uploaded file path

    // 📌 Page Width Calculation for Centering
    const pageWidth = doc.internal.pageSize.width;

    // ✅ Adjusted Logo Size (Width = 40, Height = 30)
    doc.addImage(logo, "PNG", pageWidth / 2 - 20, 10, 40, 30);

    // ✅ Title Below Logo
    doc.text("Recovery Officers Data", pageWidth / 2, 50, { align: "center" });

    autoTable(doc, {
      startY: 60, // ⬆ Move table below logo
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
      body: vendorsData.map((row, index) => {
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
        fillColor: [0, 128, 0], // ✅ Green color (RGB format)
        textColor: [255, 255, 255], // ✅ White text for contrast
        fontStyle: "bold",
      },
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
            All Recoveries
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
                  {
                    label: "Paid Amount",
                    value: summary?.paidAmount.toFixed(2),
                  },
                  { label: "Total Invoices", value: summary?.totalInvoices },
                  { label: "Paid Invoices", value: summary?.paidInvoices },
                  {
                    label: "Promise Invoices",
                    value: summary?.promiseInvoices,
                  },
                  { label: "Other Invoices", value: summary?.otherInvoices },
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

      <div className="flex justify-end mb-4 space-x-2 mt-5">
        <Button variant="contained" color="primary" onClick={exportToPDF}>
          Download PDF
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => exportToExcelOrCSV("xlsx")}
        >
          Download Excel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => exportToExcelOrCSV("csv")}
        >
          Download CSV
        </Button>
      </div>

      <TableContainer className="mt-5" component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Firm Name</TableCell>
              <TableCell>Recovery Officer Name</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Promise</TableCell>
              <TableCell>Other</TableCell>
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
