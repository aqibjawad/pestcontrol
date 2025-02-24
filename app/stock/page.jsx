"use client";

import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Button,
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import withAuth from "@/utils/withAuth";
import DateFilters2 from "@/components/generic/DateFilters2";
import { parseISO, isWithinInterval } from "date-fns";

const Page = () => {
  const api = new APICall();
  const [personId, setPersonId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [stock, setStock] = useState();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredStockData, setFilteredStockData] = useState([]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl.split("?")[1]);

    const personIdFromUrl = urlParams.get("id");
    const productIdFromUrl = urlParams.get("product_id");

    setPersonId(personIdFromUrl);
    setProductId(productIdFromUrl);
  }, []);

  useEffect(() => {
    if (personId && productId) {
      handleSubmit();
    }
  }, [personId, productId]);

  // New effect to handle filtering when dates or stock data changes
  useEffect(() => {
    if (stock?.used_stock) {
      const filtered = filterDataByDate(stock.used_stock);
      setFilteredStockData(filtered);
    }
  }, [startDate, endDate, stock]);

  const filterDataByDate = (data) => {
    if (!startDate || !endDate || !data) return data;

    return data.filter((item) => {
      const itemDate = parseISO(item.updated_at);
      return isWithinInterval(itemDate, { start: startDate, end: endDate });
    });
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        user_id: personId,
        product_id: productId,
      };

      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/stock/used`,
        submissionData
      );

      setStock(response.data);
      setFilteredStockData(response.data.used_stock); // Initialize with all data
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDownloadPDF = () => {
    if (!filteredStockData) return;

    const columns = [
      { header: "Sr No", key: "srNo" },
      { header: "Client Name", key: "clientName" },
      { header: "Firm Name", key: "firmName" },
      { header: "Date", key: "date" },
      { header: "Dose", key: "dose" },
      { header: "Quantity", key: "qty" },
    ];

    const tableData = filteredStockData.map((row, index) => ({
      srNo: (index + 1).toString(),
      clientName: row?.job?.user?.name || "N/A",
      firmName: row?.job?.user?.client?.firm_name || "N/A",
      date: formatDate(row?.updated_at),
      dose: row.dose.toString(),
      qty: row.qty.toString(),
    }));

    const doc = new jsPDF();

    // Add logo
    const logoWidth = 45;
    const logoHeight = 30;
    const logoX = 15;
    const logoY = 15;
    doc.addImage("/logo.jpeg", "PNG", logoX, logoY, logoWidth, logoHeight);

    // Page width calculation
    const pageWidth = doc.internal.pageSize.width;

    // Add product and user details on the right
    const detailsX = pageWidth - 80;
    const detailsY = logoY + 5;
    const lineHeight = 6;

    // Add product details
    doc.setFontSize(13);
    doc.text(
      `Product Name: ${(stock?.product?.product_name || "N/A").toUpperCase()}`,
      detailsX,
      detailsY,
      { align: "left" }
    );

    doc.setFontSize(11);
    doc.text(
      `Employee Name: ${stock?.user?.name || "N/A"}`,
      detailsX,
      detailsY + lineHeight,
      { align: "left" }
    );
    doc.text(
      `Email: ${stock?.user?.email || "N/A"}`,
      detailsX,
      detailsY + 2 * lineHeight,
      { align: "left" }
    );

    // Add date range if present
    if (startDate && endDate) {
      doc.text(
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        15,
        60
      );
    }

    // Add title
    doc.setFontSize(18);
    doc.text("Product Usage Report", 15, 70);

    // Table Headers and Data
    const headers = columns.map((col) => col.header);
    const data = tableData.map((row) => columns.map((col) => row[col.key]));

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74], textColor: 255 },
    });

    doc.save("stock-usage-report.pdf");
  };

  return (
    <div>
      <Grid container spacing={2} style={{ padding: "20px" }}>
        {loading ? (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" width={100} height={100} />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                style={{ marginTop: "1rem" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" width={100} height={100} />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                style={{ marginTop: "1rem" }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                style={{ marginTop: "1rem" }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
                src={stock?.product?.product_picture}
                alt={stock?.product?.product_name}
              />
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                {stock?.product?.product_name}
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
                src={stock?.user?.employee?.profile_image}
                alt={stock?.user?.name}
              />
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                {stock?.user?.name}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                {stock?.user?.email}
              </div>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handleDownloadPDF}
                style={{ marginBottom: "20px" }}
              >
                Download PDF
              </Button>
            </Grid>
            <Grid item xs={2}>
              <div className="flex items-center bg-green-600 text-white font-semibold text-base h-11 px-4 py-3 rounded-lg">
                <DateFilters2 onDateChange={handleDateChange} />
              </div>
            </Grid>
          </>
        )}
      </Grid>

      <TableContainer>
        {loading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Dose</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStockData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.job?.user?.name}</TableCell>
                  <TableCell>{row?.job?.user?.client?.firm_name}</TableCell>
                  <TableCell>{formatDate(row?.updated_at)}</TableCell>
                  <TableCell>{row.dose}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default withAuth(Page);
