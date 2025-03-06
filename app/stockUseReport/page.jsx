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
  Button,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import DateFilters from "../../components/generic/DateFilters";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import ProductReport from "../allServiceReports/serviceProduct";

const Page = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [data, setData] = useState();
  const [mappedContent, setMappedContent] = useState();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    getAllProducts();
  }, [startDate, endDate]);

  const getAllProducts = async () => {
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
        `${job}/service_report/all?${queryParams.join("&")}`
      );

      setData(response.data);

      // Extract all used_products from all service reports
      const allProducts = [];
      if (response?.data && Array.isArray(response.data)) {
        response.data.forEach((report) => {
          if (report.used_products && Array.isArray(report.used_products)) {
            allProducts.push(...report.used_products);
          }
        });
      } else if (response?.data?.used_products) {
        // Handle the single report case as shown in your example
        allProducts.push(...response.data.used_products);
      }

      setProductsList(allProducts);
    } catch (error) {
      console.error("Error fetching products data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (data) {
      const productMap = new Map();
      data.forEach((report) => {
        report.used_products.forEach((usedProduct) => {
          const {
            product_id,
            qty,
            product: { product_name, per_item_qty, latest_delivery_stock },
          } = usedProduct;

          if (!productMap.has(product_id)) {
            productMap.set(product_id, {
              product_id,
              product_name,
              per_item_qty,
              avg_price: latest_delivery_stock?.avg_price || 0,
              total_qty: 0,
            });
          }

          const product = productMap.get(product_id);
          product.total_qty += qty;
        });
      });
      const mappedData = Array.from(productMap.values());
      setMappedContent(mappedData);
    }
  }, [data]);

  const calculateUsedPrice = (item) => {
    const perItemQty = parseFloat(item.per_item_qty) || 0;
    const totalQty = parseFloat(item.total_qty) || 0;
    const avgPrice = parseFloat(item.avg_price) || 0;
    if (perItemQty === 0) return 0;
    const usageRatio = totalQty / perItemQty;
    const usedPrice = usageRatio * avgPrice;
    return Number(usedPrice.toFixed(2));
  };

  // Calculate total consumed amount
  const calculateTotalConsumedAmount = () => {
    if (!mappedContent) return 0;

    return mappedContent.reduce((total, item) => {
      return total + calculateUsedPrice(item);
    }, 0);
  };

  // Generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Product Use Report", 14, 20);

    // Add date range if available
    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);
    }

    // Define the green color for header (#32A92E)
    const headerColor = [50, 169, 46];

    // Define the table columns and rows
    const tableColumn = [
      "Sr No",
      "Product Name",
      "Consumed Quantity",
      "Average Price",
      "Consumed Amount",
    ];
    const tableRows = [];

    // Add data to rows
    mappedContent?.forEach((item, index) => {
      const consumedAmount = calculateUsedPrice(item);
      const rowData = [
        index + 1,
        item.product_name || "N/A",
        item.total_qty || 0,
        item.avg_price || 0,
        consumedAmount,
      ];
      tableRows.push(rowData);
    });
    doc.setFontSize(8);
    doc.setTextColor(0);

    const logoPath = "/logo.jpeg";
    const logoWidth = 35;
    const logoHeight = 20;

    doc.addImage(
      logoPath,
      "PNG",
      170,
      10,
      logoWidth,
      logoHeight,
      logoWidth * logoHeight
    );

    // Generate the table with green header
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10 },
      margin: { top: 10 },
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Calculate total consumed amount
    const totalConsumedAmount = calculateTotalConsumedAmount();

    // Add total row
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Total Consumed Amount: ${totalConsumedAmount.toFixed(2)}`,
      14,
      finalY + 10
    );

    // Get current date for filename
    const date = new Date();
    const dateStr = format(date, "yyyy-MM-dd");

    // Save document
    doc.save(`Product_Use_Report_${dateStr}.pdf`);
  };

  const listProductsTable = () => {
    const totalConsumedAmount = calculateTotalConsumedAmount();

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#32A92E" }}>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Sr No
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Product Name
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Consumed Quantity
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Average Price
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Consumed Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {mappedContent?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.product_name || "N/A"}</TableCell>
                    <TableCell>{row.total_qty || 0}</TableCell>
                    <TableCell>{row?.avg_price || 0}</TableCell>
                    <TableCell>{calculateUsedPrice(row)}</TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ fontWeight: "bold", textAlign: "right" }}
                  >
                    Total Consumed Amount:
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {totalConsumedAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </>
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
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "-4rem" }}
        >
          Product Use Report
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={downloadPDF}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              marginRight: "1rem",
            }}
            disabled={fetchingData || !mappedContent}
          >
            Download PDF
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
              marginLeft: "1rem",
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listProductsTable()}</div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ProductReport />
        </div>
      </div>
    </div>
  );
};

export default Page;
