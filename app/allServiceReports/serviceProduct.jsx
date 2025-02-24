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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  const [filteredContent, setFilteredContent] = useState();
  const [captains, setCaptains] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState("all");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const calculateTotalConsumedAmount = (data) => {
    return data
      .reduce((total, row) => total + calculateUsedPrice(row), 0)
      .toFixed(2);
  };

  const handleExport = (type) => {
    if (!filteredContent) return;

    const exportData = filteredContent.map((row, index) => ({
      "Sr No": index + 1,
      "Product Name": row.product_name || "N/A",
      "Captain Name": row.captain_name || "Unknown",
      "Consumed Quantity": row.total_qty || 0,
      "Consumed Units": row.consumed_units.toFixed(2) || 0,
      "Average Price": row.avg_price || 0,
      "Consumed Amount": calculateUsedPrice(row),
    }));

    if (type === "pdf") {
      const doc = new jsPDF();

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

      // Add title
      doc.setFontSize(16);
      doc.text("Stock Use Report", 14, 20);

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

      // Add selected captain
      const captainText = `Captain: ${
        selectedCaptain === "all" ? "All Captains" : selectedCaptain
      }`;
      doc.text(captainText, 14, 40);

      // Add table
      doc.autoTable({
        head: [Object.keys(exportData[0])],
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
            calculateTotalConsumedAmount(filteredContent);

          // Add total row after the table
          const finalY = data.cursor.y + 10;
          doc.setFontSize(10);
          doc.setFont(undefined, "bold");
          doc.text(`Total Consumed Amount: ${totalConsumedAmount}`, 14, finalY);
        },
      });

      doc.save("stock-report.pdf");
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

      // Extract unique captains
      const uniqueCaptains = new Set();
      response.data.forEach((report) => {
        if (report.job?.captain?.name) {
          uniqueCaptains.add(report.job.captain.name);
        }
      });
      setCaptains(Array.from(uniqueCaptains));

      // Extract all used_products from all service reports
      const allProducts = [];
      if (response?.data && Array.isArray(response.data)) {
        response.data.forEach((report) => {
          if (report.used_products && Array.isArray(report.used_products)) {
            // Add captain information to each product
            const productsWithCaptain = report.used_products.map((product) => ({
              ...product,
              captain_name: report.job?.captain?.name || "Unknown",
            }));
            allProducts.push(...productsWithCaptain);
          }
        });
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
        const captainName = report.job?.captain?.name || "Unknown";
        report.used_products.forEach((usedProduct) => {
          const {
            product_id,
            qty,
            product: { product_name, per_item_qty, latest_delivery_stock },
          } = usedProduct;

          const mapKey = `${product_id}-${captainName}`;

          if (!productMap.has(mapKey)) {
            productMap.set(mapKey, {
              product_id,
              product_name,
              per_item_qty,
              avg_price: latest_delivery_stock?.avg_price || 0,
              total_qty: 0,
              consumed_units: 0,
              captain_name: captainName,
            });
          }

          const product = productMap.get(mapKey);
          product.total_qty += qty;
          product.consumed_units =
            product.total_qty / (product.per_item_qty || 1);
        });
      });
      const mappedData = Array.from(productMap.values());
      setMappedContent(mappedData);
      setFilteredContent(mappedData);
    }
  }, [data]);

  useEffect(() => {
    if (mappedContent) {
      const filtered =
        selectedCaptain === "all"
          ? mappedContent
          : mappedContent.filter(
              (item) => item.captain_name === selectedCaptain
            );
      setFilteredContent(filtered);
    }
  }, [selectedCaptain, mappedContent]);

  const handleCaptainChange = (event) => {
    setSelectedCaptain(event.target.value);
  };

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
              <TableCell>Captain Name</TableCell>
              <TableCell>Consumed Quantity</TableCell>
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
              filteredContent?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.product_name || "N/A"}</TableCell>
                  <TableCell>{row?.captain_name || "Unknown"}</TableCell>
                  <TableCell>{row.total_qty || 0}</TableCell>
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
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2rem" }}
        >
          Product Use Report
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Captain</InputLabel>
            <Select
              value={selectedCaptain}
              onChange={handleCaptainChange}
              label="Filter by Captain"
            >
              <MenuItem value="all">All Captains</MenuItem>
              {captains.map((captain) => (
                <MenuItem key={captain} value={captain}>
                  {captain}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} alignItems="center">
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
              }}
            >
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </Stack>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listProductsTable()}</div>
      </div>
    </div>
  );
};

export default ProductReport;
