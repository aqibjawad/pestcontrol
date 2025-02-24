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
  Stack,
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { utils, write } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import DateFilters from "../../components/generic/DateFilters";
import { format } from "date-fns";

const ProductReport = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [data, setData] = useState();
  const [mappedContent, setMappedContent] = useState();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Export Utilities
  const exportToExcel = (data, fileName = "product_report") => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Products");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data, fileName = "product_report") => {
    const doc = new jsPDF();

    const logoUrl = "/logo.jpeg";
    const logoWidth = 40;
    const logoHeight = 20;

    const generatePDF = () => {
      try {
        // Add logo
        if (logoUrl) {
          doc.addImage(logoUrl, "PNG", 15, 10, logoWidth, logoHeight);
        }

        // Add company name or report title
        doc.setFontSize(16);
        doc.text("Product Use Report", doc.internal.pageSize.width / 2, 20, {
          align: "center",
        });

        // Add date range
        doc.setFontSize(10);
        const dateStr = new Date().toLocaleDateString();
        const fromDate = startDate
          ? format(new Date(startDate), "dd/MM/yyyy")
          : dateStr;
        const toDate = endDate
          ? format(new Date(endDate), "dd/MM/yyyy")
          : dateStr;
        doc.text(`Date: ${dateStr}`, 15, 35);
        doc.text(`Report Period: ${fromDate} to ${toDate}`, 15, 42);

        // Updated table columns to match the UI table
        doc.autoTable({
          startY: 50,
          head: [
            [
              "Sr No",
              "Product Name",
              "Consumed Quantity",
              "Consumed Units",
              "Average Price",
              "Consumed Amount",
            ],
          ],
          body: data.map((row, index) => [
            index + 1,
            row.product_name || "N/A",
            row.total_qty || 0,
            row.consumed_units.toFixed(2) || 0,
            row.avg_price || 0,
            calculateUsedPrice(row),
          ]),
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 50 },
        });

        // Calculate and add total at the bottom
        const totalAmount = data.reduce(
          (sum, row) => sum + calculateUsedPrice(row),
          0
        );
        const finalY = doc.previousAutoTable.finalY || 150;

        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Consumed Amount: ${totalAmount.toFixed(2)}`,
          15,
          finalY + 10
        );

        doc.save(`${fileName}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        // Fallback to generate PDF without logo if there's an error
        doc.autoTable({
          head: [
            [
              "Sr No",
              "Product Name",
              "Consumed Quantity",
              "Consumed Units",
              "Average Price",
              "Consumed Amount",
            ],
          ],
          body: data.map((row, index) => [
            index + 1,
            row.product_name || "N/A",
            row.total_qty || 0,
            row.consumed_units.toFixed(2) || 0,
            row.avg_price || 0,
            calculateUsedPrice(row),
          ]),
        });
        doc.save(`${fileName}.pdf`);
      }
    };

    // Handle logo loading
    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        generatePDF();
      };
      img.onerror = () => {
        console.error("Error loading logo");
        generatePDF();
      };
      img.src = logoUrl;
    } else {
      generatePDF();
    }
  };

  const exportToCSV = (data, fileName = "product_report") => {
    const headers = [
      "Sr No,Product Name,Consumed Quantity,Average Price,Consumed Amount\n",
    ];

    const csvContent = data
      .map(
        (row, index) =>
          `${index + 1},${row.product_name || "N/A"},${row.total_qty || 0},${
            row.avg_price || 0
          },${calculateUsedPrice(row)}`
      )
      .join("\n");

    const blob = new Blob([headers + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type) => {
    if (!mappedContent) return;

    const fileName = `product_report_${format(new Date(), "yyyy-MM-dd")}`;

    switch (type) {
      case "excel":
        exportToExcel(mappedContent, fileName);
        break;
      case "pdf":
        exportToPDF(mappedContent, fileName);
        break;
      case "csv":
        exportToCSV(mappedContent, fileName);
        break;
      default:
        break;
    }
  };

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
              consumed_units: 0, // New field for consumed units
            });
          }

          const product = productMap.get(product_id);
          product.total_qty += qty;
          // Calculate consumed units by dividing total quantity by per_item_qty
          product.consumed_units =
            product.total_qty / (product.per_item_qty || 1);
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

  const listProductsTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Consumed Quantity</TableCell>
              {/* <TableCell>Per Item Quantity</TableCell> */}
              <TableCell>Consumed Units</TableCell>
              <TableCell>Average Price</TableCell>
              <TableCell>Consumed Amount</TableCell>
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
              mappedContent?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.product_name || "N/A"}</TableCell>
                  <TableCell>{row.total_qty || 0}</TableCell>
                  {/* <TableCell>{row.per_item_qty || 1}</TableCell> */}
                  <TableCell>{row.consumed_units.toFixed(2) || 0}</TableCell>
                  <TableCell>{row?.avg_price || 0}</TableCell>
                  <TableCell>{calculateUsedPrice(row)}</TableCell>
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
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "-4rem" }}
        >
          Product Use Report
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
            gap: "1rem",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport("excel")}
              style={{ backgroundColor: "#1976d2" }}
            >
              Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport("pdf")}
              style={{ backgroundColor: "#dc004e" }}
            >
              PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport("csv")}
              style={{ backgroundColor: "#4caf50" }}
            >
              CSV
            </Button>
          </Stack>
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
    </div>
  );
};

export default ProductReport;
