"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Modal,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import DateFilters from "@/components/generic/DateFilters";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const tableRef = useRef(null);

  // State for image modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for status summary
  const [statusSummary, setStatusSummary] = useState({
    Contracted: 0,
    Quote: 0,
    Interested: 0,
    Total: 0,
  });

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getQueryParam = (url, param) => {
    const searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const params = new URLSearchParams(new URL(currentUrl).search);

    const urlId = getQueryParam(currentUrl, "id");
    const urlName = params.get("name");

    setId(urlId);
    setName(urlName ? decodeURIComponent(urlName) : "");

    setCompanyLogo("/logo.jpeg");
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllEmployees();
    }
  }, [id, startDate, endDate]);

  const getAllEmployees = async () => {
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
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/reference/income/get/${id}?${queryParams.join(
          "&"
        )}`
      );
      setSalesData(response?.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add company logo
    if (companyLogo) {
      const imgProps = doc.getImageProperties(companyLogo);
      const originalWidth = imgProps.width;
      const originalHeight = imgProps.height;

      const desiredWidth = 40;
      const scaledHeight = (originalHeight * desiredWidth) / originalWidth;

      // Place the image with proper aspect ratio
      doc.addImage(companyLogo, "JPEG", 15, 10, desiredWidth, scaledHeight);
    }

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0); // Green header color
    doc.text("Income Details", 105, 30, { align: "center" });
    doc.text(`${name}`, 105, 40, { align: "center" });

    // Add date filter information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Date Range: ${startDate || format(new Date(), "yyyy-MM-dd")} to ${
        endDate || format(new Date(), "yyyy-MM-dd")
      }`,
      105,
      50,
      { align: "center" }
    );

    // Generate table matching the UI table
    const tableColumn = [
      "Sr No",
      "Invoice Id",
      "Client Name",
      "Paid Amount",
      "Total Amount",
      "Status",
    ];
    const tableRows = [];

    salesData.forEach((item, index) => {
      const rowData = [
        (index + 1).toString(),
        item.invoiceable_id || "N/A",
        item.user?.name || "N/A",
        item.paid_amt || "0",
        item.total_amt || "0",
        item.status || "N/A",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] }, // Green header
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 70 },
    });

    // Add total summary
    const summaryY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0);
    doc.text("Summary", 105, summaryY, { align: "center" });

    // Calculate totals
    const totalPaidAmount = salesData
      .reduce((sum, item) => sum + Number(item?.paid_amt || 0), 0)
      .toFixed(2);

    const totalAmount = salesData
      .reduce((sum, item) => sum + Number(item?.total_amt || 0), 0)
      .toFixed(2);

    // Draw summary table
    const summaryColumns = ["Description", "Amount"];
    const summaryRows = [
      ["Total Paid Amount", totalPaidAmount],
      ["Total Amount", totalAmount],
    ];

    doc.autoTable({
      head: [summaryColumns],
      body: summaryRows,
      startY: summaryY + 10,
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
      styles: { halign: "center" },
      margin: { left: 70, right: 70 },
      tableWidth: 100,
    });

    // Add date and time of generation
    const date = new Date();
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${format(date, "yyyy-MM-dd HH:mm:ss")}`,
      15,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF
    doc.save(`Income_Details_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <h2 className="text-xl font-semibold mb-4"> Income Details </h2>
        <div className="flex items-center justify-center bg-green-600 text-white font-semibold text-base h-11 px-4 py-3 rounded-lg max-w-xs mx-auto">
          <DateFilters onDateChange={handleDateChange} />
        </div>
        <div className="flex justify-end">
          <Button
            variant="contained"
            startIcon={<DownloadOutlined />}
            onClick={generatePDF}
            style={{ backgroundColor: "green", color: "white" }}
            disabled={fetchingData || salesData.length === 0}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {fetchingData ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer className="mt-5" component={Paper} ref={tableRef}>
            <Table>
              <TableHead style={{ backgroundColor: "#4CAF50" }}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>
                    <b>Sr No</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Invoice Id</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Client Name</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Paid Amount</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Total Amount</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Status</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData.length > 0 ? (
                  salesData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item?.id}</TableCell>
                      <TableCell>{item?.user?.name}</TableCell>
                      <TableCell>{item?.paid_amt}</TableCell>
                      <TableCell>{item?.total_amt}</TableCell>
                      <TableCell>{item?.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Add the sum calculations below the table */}
          {salesData.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <Typography variant="h6">
                <b>Summary</b>
              </Typography>
              <Typography>
                <b>Total Paid Amount:</b>{" "}
                {salesData
                  .reduce((sum, item) => sum + Number(item?.paid_amt || 0), 0)
                  .toFixed(2)}
              </Typography>

              <Typography>
                <b>Total Amount:</b>{" "}
                {salesData
                  .reduce((sum, item) => sum + Number(item?.total_amt || 0), 0)
                  .toFixed(2)}
              </Typography>

              <Typography>
                <b>Remaining Amount:</b>{" "}
                {(
                  salesData.reduce(
                    (sum, item) => sum + Number(item?.total_amt || 0),
                    0
                  ) -
                  salesData.reduce(
                    (sum, item) => sum + Number(item?.paid_amt || 0),
                    0
                  )
                ).toFixed(2)}
              </Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
