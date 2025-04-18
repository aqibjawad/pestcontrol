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
import {
  DownloadOutlined,
  CloseOutlined,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import APICall from "@/networkUtil/APICall";
import { visit } from "@/networkUtil/Constants";
import DateFilters from "@/components/generic/DateFilters";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import MapIcon from "@mui/icons-material/Map";

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

  // Calculate status summary whenever salesData changes
  useEffect(() => {
    calculateStatusSummary();
  }, [salesData]);

  const calculateStatusSummary = () => {
    const summary = {
      Contracted: 0,
      Quote: 0,
      Interested: 0,
      Total: salesData.length,
    };

    salesData.forEach((item) => {
      const status = item.status?.toLowerCase() || "";
      if (status.includes("contracted")) {
        summary.Contracted++;
      } else if (status.includes("quote")) {
        summary.Quote++;
      } else if (status.includes("interested")) {
        summary.Interested++;
      }
    });

    setStatusSummary(summary);
  };

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
        `${visit}/get/${id}?${queryParams.join("&")}`
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
    doc.text("Visit Details", 105, 30, { align: "center" });
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

    // Generate table
    const tableColumn = [
      "Sr No",
      "Client Name",
      "Description",
      "Status",
      "Visit Date",
      "Follow-up Date",
      "Contract End Date",
    ];
    const tableRows = [];

    salesData.forEach((item, index) => {
      const rowData = [
        (index + 1).toString(),
        item.user_client?.name || "N/A",
        item.description || "N/A",
        item.status || "N/A",
        item.visit_date?.split(" ")[0] || "N/A",
        item.follow_up_date?.split(" ")[0] || "N/A",
        item.current_contract_end_date || "N/A",
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

    // Add status summary
    const summaryY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0);
    doc.text("Status Summary", 105, summaryY, { align: "center" });

    // Draw summary table
    const summaryColumns = ["Status Type", "Count"];
    const summaryRows = [
      ["Contracted", statusSummary.Contracted.toString()],
      ["Quote", statusSummary.Quote.toString()],
      ["Interested", statusSummary.Interested.toString()],
      ["Total", statusSummary.Total.toString()],
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
    doc.save(`Visit_Details_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  // Handle opening image modal
  const handleOpenImageModal = (images) => {
    if (images && images.length > 0) {
      setCurrentImages(images);
      setCurrentImageIndex(0);
      setModalOpen(true);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handle navigation between images
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : currentImages.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < currentImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Function to open map in new tab
  const openMapInNewTab = (item) => {
    // Check if the item has valid latitude and longitude
    const hasValidCoordinates =
      item.latitude !== "null" &&
      item.longitude !== "null" &&
      item.latitude !== null &&
      item.longitude !== null;

    if (hasValidCoordinates) {
      // Create Google Maps URL with the coordinates
      const mapUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
      // Open the URL in a new tab
      window.open(mapUrl, "_blank");
    } else {
      // Alert if coordinates are not available
      alert("Location coordinates are not available for this visit.");
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <h2 className="text-xl font-semibold mb-4">Visit Details of {name} </h2>
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
          {/* Status Summary Section */}
          {salesData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                Status Summary
              </h3>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: "#E8F5E9", boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#2E7D32" }}>
                        Contracted
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, fontWeight: "bold" }}
                      >
                        {statusSummary.Contracted}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: "#E3F2FD", boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#1565C0" }}>
                        Quote
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, fontWeight: "bold" }}
                      >
                        {statusSummary.Quote}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: "#FFF8E1", boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#F57F17" }}>
                        Interested
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, fontWeight: "bold" }}
                      >
                        {statusSummary.Interested}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: "#EFEBE9", boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#5D4037" }}>
                        Total
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, fontWeight: "bold" }}
                      >
                        {statusSummary.Total}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          )}

          <TableContainer className="mt-5" component={Paper} ref={tableRef}>
            <Table>
              <TableHead style={{ backgroundColor: "#4CAF50" }}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>
                    <b>Sr No</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Client Name</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Description</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Status</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Visit Date</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Follow-up Date</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Contract End Date</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Location</b>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <b>Image</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData.length > 0 ? (
                  salesData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.user_client?.name || "N/A"}</TableCell>
                      <TableCell>{item.description || "N/A"}</TableCell>
                      <TableCell>{item.status || "N/A"}</TableCell>
                      <TableCell>
                        {item.visit_date?.split(" ")[0] || "N/A"}
                      </TableCell>
                      <TableCell>
                        {item.follow_up_date?.split(" ")[0] || "N/A"}
                      </TableCell>
                      <TableCell>
                        {item.current_contract_end_date || "N/A"}
                      </TableCell>
                      <TableCell>
                        <MapIcon
                          className="cursor-pointer text-blue-600"
                          onClick={() => openMapInNewTab(item)}
                        />
                      </TableCell>
                      <TableCell>
                        {item.images?.length > 0 ? (
                          <div
                            className="cursor-pointer"
                            onClick={() => handleOpenImageModal(item.images)}
                          >
                            <img
                              src={item.images[0]}
                              alt="Visit"
                              width="50"
                              height="50"
                              style={{ borderRadius: "5px" }}
                            />
                            {item.images.length > 1 && (
                              <div className="text-xs text-blue-600 mt-1">
                                +{item.images.length - 1} more
                              </div>
                            )}
                          </div>
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
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
        </>
      )}

      {/* Image Gallery Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="image-gallery-modal"
        aria-describedby="view all visit images"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Visit Images</h2>
            <IconButton onClick={handleCloseModal}>
              <CloseOutlined />
            </IconButton>
          </div>

          <div className="relative">
            {currentImages.length > 0 && (
              <div className="flex justify-center">
                <img
                  src={currentImages[currentImageIndex]}
                  alt={`Visit image ${currentImageIndex + 1}`}
                  style={{
                    maxHeight: "60vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {currentImages.length > 1 && (
              <div className="flex justify-between w-full absolute top-1/2 transform -translate-y-1/2">
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </div>
            )}
          </div>

          {currentImages.length > 1 && (
            <div className="mt-4">
              <div className="flex justify-center items-center gap-2 overflow-x-auto py-2">
                {currentImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer p-1 ${
                      idx === currentImageIndex
                        ? "border-2 border-green-500"
                        : "border border-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-16 w-16 object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                {currentImageIndex + 1} of {currentImages.length}
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Page;
