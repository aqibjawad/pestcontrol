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
  Typography,
  Box,
  Alert,
  Grid,
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { utils, write } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import APICall from "@/networkUtil/APICall";
import { job, sendEmail } from "@/networkUtil/Constants";
import DateFilters from "../../components/generic/DateFilters";
import { format } from "date-fns";

const ProductReport = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [data, setData] = useState();
  const [mappedContent, setMappedContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState("all");

  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState("all");
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  // New state for storing selected firm's client details
  const [selectedFirmClientDetails, setSelectedFirmClientDetails] =
    useState(null);

  // New state for product filtering
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("all");

  const [noDataFound, setNoDataFound] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Debug state to track data processing
  const [debugInfo, setDebugInfo] = useState({});

  const calculateTotalConsumedAmount = (data) => {
    return data
      .reduce((total, row) => total + calculateUsedPrice(row), 0)
      .toFixed(2);
  };

  const handleExport = (type) => {
    if (!filteredContent || filteredContent.length === 0) {
      console.warn("No data available to export");
      return;
    }

    const exportData = filteredContent.map((row, index) => {
      const baseData = {
        "Sr No": index + 1,
        "Product Name": row.product_name || "N/A",
        "Captain Name": row.captain_name || "Unknown",
        "Consumed Quantity": row.total_qty || 0,
        "Consumed Units": row.consumed_units.toFixed(2) || 0,
        "Firm Name": row.firm_name || "Unknown", // Added firm name to exports
      };

      // Only include price columns if firm is not selected
      if (selectedFirm === "all") {
        return {
          ...baseData,
          "Average Price": row.avg_price || 0,
          "Consumed Amount": calculateUsedPrice(row),
        };
      }

      return baseData;
    });

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

      // Add selected filters
      let filterText = "";
      if (selectedCaptain !== "all") {
        filterText += `Captain: ${selectedCaptain}`;
      }
      if (selectedFirm !== "all") {
        filterText += filterText
          ? `, Firm: ${selectedFirm}`
          : `Firm: ${selectedFirm}`;
      }
      if (selectedProduct !== "all") {
        filterText += filterText
          ? `, Product: ${selectedProduct}`
          : `Product: ${selectedProduct}`;
      }
      if (!filterText) {
        filterText = "All Data";
      }
      doc.text(filterText, 14, 40);

      // Get headers dynamically based on selected firm
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
          // Only show total if firm is not selected
          if (selectedFirm === "all") {
            // Calculate total
            const totalConsumedAmount =
              calculateTotalConsumedAmount(filteredContent);

            // Add total row after the table
            const finalY = data.cursor.y + 10;
            doc.setFontSize(10);
            doc.setFont(undefined, "bold");
            doc.text(
              `Total Consumed Amount: ${totalConsumedAmount}`,
              14,
              finalY
            );
          }
        },
      });

      doc.save("stock-report.pdf");
    } else if (type === "excel" || type === "csv") {
      // Create workbook with filtered data
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(exportData);
      utils.book_append_sheet(wb, ws, "Stock Report");

      // For Excel format
      if (type === "excel") {
        write(wb, "stock-report.xlsx");
      } else {
        // For CSV format
        write(wb, "stock-report.csv");
      }
    }
  };

  const generatePDFFile = () => {
    if (!filteredContent || filteredContent.length === 0) {
      console.warn("No data available to export");
      return null;
    }

    const doc = new jsPDF();

    const logoPath = "/logo.jpeg";
    const logoWidth = 35;
    const logoHeight = 20;

    // Add logo
    doc.addImage(logoPath, "JPEG", 170, 10, logoWidth, logoHeight);

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

    // Add selected filters
    let filterText = "";
    if (selectedCaptain !== "all") {
      filterText += `Captain: ${selectedCaptain}`;
    }
    if (selectedFirm !== "all") {
      filterText += filterText
        ? `, Firm: ${selectedFirm}`
        : `Firm: ${selectedFirm}`;
    }
    if (selectedProduct !== "all") {
      filterText += filterText
        ? `, Product: ${selectedProduct}`
        : `Product: ${selectedProduct}`;
    }
    if (!filterText) {
      filterText = "All Data";
    }
    doc.text(filterText, 14, 40);

    // Include client details if a specific firm is selected
    if (selectedFirmClientDetails) {
      const clientDetailsY = 50;
      doc.setFontSize(10);
      doc.text(
        `Firm Name: ${selectedFirmClientDetails.firmName || "N/A"}`,
        14,
        clientDetailsY
      );
      doc.text(
        `Address: ${selectedFirmClientDetails.address || "N/A"}`,
        14,
        clientDetailsY + 6
      );
      doc.text(
        `Contact: ${selectedFirmClientDetails.contactNumber || "N/A"}`,
        14,
        clientDetailsY + 12
      );
      doc.text(
        `Email: ${selectedFirmClientDetails.email || "N/A"}`,
        14,
        clientDetailsY + 18
      );
    }

    // Prepare export data like in the original handleExport function
    const exportData = filteredContent.map((row, index) => {
      const baseData = {
        "Sr No": index + 1,
        "Product Name": row.product_name || "N/A",
        "Captain Name": row.captain_name || "Unknown",
        "Consumed Quantity": row.total_qty || 0,
        "Consumed Units": row.consumed_units.toFixed(2) || 0,
        "Firm Name": row.firm_name || "Unknown",
      };

      // Only include price columns if firm is not selected
      if (selectedFirm === "all") {
        return {
          ...baseData,
          "Average Price": row.avg_price || 0,
          "Consumed Amount": calculateUsedPrice(row),
        };
      }

      return baseData;
    });

    // Get headers dynamically based on selected firm
    const headers = Object.keys(exportData[0]);

    // Add table
    doc.autoTable({
      head: [headers],
      body: exportData.map(Object.values),
      startY: selectedFirmClientDetails ? 80 : 50,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: { fillColor: [22, 163, 74], textColor: 255 },
      didDrawPage: function (data) {
        // Only show total if firm is not selected
        if (selectedFirm === "all") {
          // Calculate total
          const totalConsumedAmount =
            calculateTotalConsumedAmount(filteredContent);

          // Add total row after the table
          const finalY = data.cursor.y + 10;
          doc.setFontSize(10);
          doc.setFont(undefined, "bold");
          doc.text(`Total Consumed Amount: ${totalConsumedAmount}`, 14, finalY);
        }
      },
    });

    // Generate PDF as a Blob with PDF mime type
    const pdfBlob = new Blob([doc.output("arraybuffer")], {
      type: "application/pdf",
    });

    // Create File object with .pdf extension
    return new File([pdfBlob], "Product_Use_Report.pdf", {
      type: "application/pdf",
    });
  };

  const uploadToCloudinary = async () => {
    setIsPdfUploading(true);

    try {
      const file = generatePDFFile();
      if (!file) return;

      const data = {
        user_id: `${selectedFirmClientDetails.userId}`,
        subject: "Client Used Product Report",
        file: file,
        html: `
        <h1> ${selectedFirmClientDetails.firmName}</h1>
        <footer style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">        
          <div style="margin-top: 15px; font-size: 0.9em; color: #333;">
            <h4> Accurate Pest Control Services LLC </h4>
            <p style="margin: 5px 0;"> Office 12, Building # Greece K-12, International City Dubai </p>
            <p style="margin: 5px 0;">
              Email: accuratepestcontrolcl.ae | Phone: +971 52 449 6173
            </p>
          </div>
        </footer>
        `,
      };

      const response = await api.postFormDataWithToken(`${sendEmail}`, data);
      const testData = await response.json();

      console.log("Upload success:", testData);
      setPdfUrl(testData.secure_url);
      return testData.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    } finally {
      // Always set loading state back to false
      setIsPdfUploading(false);
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
        setProductsList([]);
        setMappedContent([]);
        setFilteredContent([]);
        setCaptains([]);
        setFirms([]);
        setUniqueProducts([]);
        setFetchingData(false);
        return;
      }

      setData(response.data);

      // Extract unique captains
      const uniqueCaptains = new Set();
      response.data.forEach((report) => {
        if (report.job?.captain?.name) {
          uniqueCaptains.add(report.job.captain.name);
        }
      });
      setCaptains(Array.from(uniqueCaptains));

      // Extract unique firms with proper case handling
      const uniqueFirms = new Set();
      response.data.forEach((report) => {
        if (report.job?.user?.client?.firm_name) {
          const firmName = report.job.user.client.firm_name.trim();
          uniqueFirms.add(firmName);
        }
      });
      setFirms(Array.from(uniqueFirms));

      // Extract all used_products from all service reports
      const allProducts = [];
      const uniqueProductNames = new Set();

      if (response?.data && Array.isArray(response.data)) {
        response.data.forEach((report) => {
          const firmName =
            report.job?.user?.client?.firm_name?.trim() || "Unknown";

          if (report.used_products && Array.isArray(report.used_products)) {
            const productsWithInfo = report.used_products.map((product) => {
              if (product && product.product && product.product.product_name) {
                uniqueProductNames.add(product.product.product_name);
              }

              return {
                ...product,
                captain_name: report.job?.captain?.name || "Unknown",
                firm_name: firmName,
              };
            });
            allProducts.push(...productsWithInfo);
          }
        });
      }

      setProductsList(allProducts);
      setUniqueProducts(Array.from(uniqueProductNames));
    } catch (error) {
      console.error("Error fetching products data:", error);
      setNoDataFound(true);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const productMap = new Map();

      data.forEach((report) => {
        const captainName = report.job?.captain?.name || "Unknown";
        const firmName =
          report.job?.user?.client?.firm_name?.trim() || "Unknown";

        if (report.used_products && Array.isArray(report.used_products)) {
          report.used_products.forEach((usedProduct) => {
            if (!usedProduct || !usedProduct.product) return;

            const {
              product_id,
              qty,
              product: { product_name, per_item_qty, latest_delivery_stock },
            } = usedProduct;

            const mapKey = `${product_id}-${captainName}-${firmName}`;

            if (!productMap.has(mapKey)) {
              productMap.set(mapKey, {
                product_id,
                product_name,
                per_item_qty,
                avg_price: latest_delivery_stock?.avg_price || 0,
                total_qty: 0,
                consumed_units: 0,
                captain_name: captainName,
                firm_name: firmName,
              });
            }

            const product = productMap.get(mapKey);
            product.total_qty += qty;
            product.consumed_units =
              product.total_qty / (product.per_item_qty || 1);
          });
        }
      });

      const mappedData = Array.from(productMap.values());
      setMappedContent(mappedData);
      setFilteredContent(mappedData);
    } else {
      setMappedContent([]);
      setFilteredContent([]);
    }
  }, [data]);

  useEffect(() => {
    if (mappedContent && mappedContent.length > 0) {
      let filtered = [...mappedContent];

      // Filter by captain if selected
      if (selectedCaptain !== "all") {
        filtered = filtered.filter(
          (item) => item.captain_name === selectedCaptain
        );
      }

      // Filter by firm - with client details capture
      if (selectedFirm !== "all") {
        filtered = filtered.filter((item) => {
          const normalizedItemFirm = (item.firm_name || "")
            .trim()
            .toLowerCase();
          const normalizedSelectedFirm = selectedFirm.trim().toLowerCase();
          const matches = normalizedItemFirm === normalizedSelectedFirm;

          // If this is the selected firm, find and log its client details
          if (matches) {
            const matchingReport = data.find(
              (report) =>
                report.job?.user?.client?.firm_name?.trim().toLowerCase() ===
                normalizedSelectedFirm
            );

            if (matchingReport) {
              const clientDetails = matchingReport.job.user.client;

              // Set the client details in state
              setSelectedFirmClientDetails({
                firmName: clientDetails.firm_name || "N/A",
                userId: clientDetails.user_id || "N/A",
              });

              // Log the client details
              console.log("Selected Firm Client Details:", {
                firmName: clientDetails.firm_name,
                userId: clientDetails.user_id,
              });
            }
          }

          return matches;
        });
      } else {
        // Reset client details when "All Firms" is selected
        setSelectedFirmClientDetails(null);
      }

      // Filter by product if selected
      if (selectedProduct !== "all") {
        filtered = filtered.filter((item) => {
          return item.product_name === selectedProduct;
        });
      }

      setFilteredContent(filtered);
      setNoDataFound(filtered.length === 0);
    } else {
      setFilteredContent([]);
      setNoDataFound(true);
    }
  }, [selectedCaptain, selectedFirm, selectedProduct, mappedContent, data]);

  const handleCaptainChange = (event) => {
    setSelectedCaptain(event.target.value);
  };

  const handleFirmChange = (event) => {
    setSelectedFirm(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
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
          No data found for the selected filters. Try changing your date range
          or filters.
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
              <TableCell>Captain Name</TableCell>
              <TableCell>Firm Name</TableCell>
              <TableCell>Consumed Quantity</TableCell>
              <TableCell>Consumed Units</TableCell>
              {selectedFirm === "all" && (
                <>
                  <TableCell>Average Price</TableCell>
                  <TableCell>Consumed Amount</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContent?.length > 0 ? (
              filteredContent.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.product_name || "N/A"}</TableCell>
                  <TableCell>{row?.captain_name || "Unknown"}</TableCell>
                  <TableCell>{row?.firm_name || "Unknown"}</TableCell>
                  <TableCell>{row.total_qty || 0}</TableCell>
                  <TableCell>{row.consumed_units.toFixed(2) || 0}</TableCell>
                  {selectedFirm === "all" && (
                    <>
                      <TableCell>{row?.avg_price || 0}</TableCell>
                      <TableCell>{calculateUsedPrice(row)}</TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={selectedFirm === "all" ? 8 : 6}
                  align="center"
                >
                  No data available with current filters
                </TableCell>
              </TableRow>
            )}
            {selectedFirm === "all" && filteredContent?.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="right"
                  style={{ fontWeight: "bold" }}
                >
                  Total Consumed Amount:
                </TableCell>
                <TableCell colSpan={2} style={{ fontWeight: "bold" }}>
                  {calculateTotalConsumedAmount(filteredContent)}
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
          Product Use Report By Firm and Client
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexWrap="wrap"
          gap={2}
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

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Firm</InputLabel>
            <Select
              value={selectedFirm}
              onChange={handleFirmChange}
              label="Filter by Firm"
            >
              <MenuItem value="all">All Firms</MenuItem>
              {firms.map((firm) => (
                <MenuItem key={firm} value={firm}>
                  {firm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Product</InputLabel>
            <Select
              value={selectedProduct}
              onChange={handleProductChange}
              label="Filter by Product"
            >
              <MenuItem value="all">All Products</MenuItem>
              {uniqueProducts.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Button
              variant="contained"
              startIcon={
                isPdfUploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <FileDownloadIcon />
                )
              }
              onClick={() => uploadToCloudinary()}
              style={{
                backgroundColor: "#0000FF",
                position: "relative",
                minWidth: "120px", // Ensure button width remains consistent
              }}
              disabled={filteredContent?.length === 0 || isPdfUploading}
            >
              {isPdfUploading ? "Uploading..." : "Send to Email"}
            </Button>

            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport("pdf")}
              style={{ backgroundColor: "#dc004e" }}
              disabled={filteredContent?.length === 0}
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

      {/* Client Details Section */}
      {selectedFirmClientDetails && (
        <Box
          mt={2}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          style={{ margin: "0 30px" }}
        >
          <Typography variant="h6" gutterBottom>
            Firm Client Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Firm Name:</strong> {selectedFirmClientDetails.firmName}
              </Typography>
              <Typography>
                <strong>Address:</strong> {selectedFirmClientDetails.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Contact Number:</strong>{" "}
                {selectedFirmClientDetails.contactNumber}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedFirmClientDetails.email}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listProductsTable()}</div>
      </div>
    </div>
  );
};

export default ProductReport;
