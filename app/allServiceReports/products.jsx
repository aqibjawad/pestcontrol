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
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import DateFilters from "../../components/generic/DateFilters";
import { format } from "date-fns";

const ServiceProductReport = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [data, setData] = useState([]);
  const [consolidatedData, setConsolidatedData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const calculateTotalConsumedAmount = (data) => {
    return data
      .reduce((total, row) => total + (row.consumed_amount || 0), 0)
      .toFixed(2);
  };

  const handleExport = () => {
    if (!consolidatedData || consolidatedData.length === 0) {
      console.warn("No data available to export");
      return;
    }

    const exportData = consolidatedData.map((row, index) => {
      return {
        "Sr No": index + 1,
        "Product Name": row.product_name || "N/A",
        "Total Consumed Quantity": row.total_qty || 0,
        "Average Price": row.avg_price?.toFixed(2) || 0,
        "Total Consumed Amount": row.consumed_amount?.toFixed(2) || 0,
      };
    });

    const doc = new jsPDF();

    const logoPath = "/Logo Sharjah Ajman UAE.png";
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

    // Add title
    doc.setFontSize(16);
    doc.text("Consolidated Product Use Report", 14, 20);

    // Add date range
    doc.setFontSize(12);
    const dateText =
      startDate && endDate
        ? `Date: ${format(new Date(startDate), "dd/MM/yyyy")} - ${format(
            new Date(endDate),
            "dd/MM/yyyy"
          )}`
        : `Date: ${format(new Date(), "dd/MM/yyyy")}`;
    doc.text(dateText, 14, 30);

    // Get headers
    const headers = Object.keys(exportData[0]);

    // Add table
    doc.autoTable({
      head: [headers],
      body: exportData.map(Object.values),
      startY: 50,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: { fillColor: [22, 163, 74], textColor: 255 },
      didDrawPage: function (data) {
        // Calculate total
        const totalConsumedAmount =
          calculateTotalConsumedAmount(consolidatedData);

        // Add total row after the table
        const finalY = data.cursor.y + 10;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text(`Total Consumed Amount: ${totalConsumedAmount}`, 14, finalY);
      },
    });

    doc.save("consolidated-product-report.pdf");
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
    setNoDataFound(false);

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

      if (!response.data || response.data.length === 0) {
        setNoDataFound(true);
        setData([]);
        setConsolidatedData([]);
        setFetchingData(false);
        return;
      }

      setData(response.data);
    } catch (error) {
      console.error("Error fetching products data:", error);
      setNoDataFound(true);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      // First, map all products with their details
      const productMap = new Map();

      data.forEach((report) => {
        if (report.used_products && Array.isArray(report.used_products)) {
          report.used_products.forEach((usedProduct) => {
            if (!usedProduct || !usedProduct.product) return;

            const {
              product_id,
              qty,
              product: { product_name, per_item_qty, latest_delivery_stock },
            } = usedProduct;

            const avgPrice = latest_delivery_stock?.avg_price || 0;

            // Use only product_id as the key to consolidate the same products
            if (!productMap.has(product_id)) {
              productMap.set(product_id, {
                product_id,
                product_name,
                per_item_qty,
                avg_price: avgPrice,
                total_qty: 0,
                consumed_units: 0,
                consumed_amount: 0,
              });
            }

            const product = productMap.get(product_id);
            product.total_qty += qty;
            product.consumed_units =
              product.total_qty / (product.per_item_qty || 1);

            // Calculate consumed amount for each addition
            const usageRatio = qty / (per_item_qty || 1);
            const usedPrice = usageRatio * avgPrice;
            product.consumed_amount += Number(usedPrice.toFixed(2));
          });
        }
      });

      const consolidatedProducts = Array.from(productMap.values());
      setConsolidatedData(consolidatedProducts);
    } else {
      setConsolidatedData([]);
    }
  }, [data]);

  const listProductsTable = () => {
    if (fetchingData) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (noDataFound) {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          No data found for the selected date range. Try changing your date
          range.
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Total Consumed Quantity</TableCell>
              <TableCell>Average Price</TableCell>
              <TableCell>Total Consumed Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consolidatedData?.length > 0 ? (
              consolidatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.product_name || "N/A"}</TableCell>
                  <TableCell>{row.total_qty || 0}</TableCell>
                  <TableCell>{row?.avg_price || 0}</TableCell>
                  <TableCell>{row.consumed_amount || 0}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
            {consolidatedData?.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  style={{ fontWeight: "bold" }}
                >
                  Total Consumed Amount:
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  {calculateTotalConsumedAmount(consolidatedData)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <Typography variant="h5" fontWeight={600} mb={4}>
          Consolidated Product Use Report
        </Typography>

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              style={{ backgroundColor: "#dc004e" }}
              disabled={consolidatedData?.length === 0}
            >
              PDF
            </Button>

            <div
              style={{
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                height: "44px",
                paddingLeft: "16px",
                paddingRight: "16px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </Stack>
        </Box>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listProductsTable()}</div>
      </div>
    </div>
  );
};

export default ServiceProductReport;
