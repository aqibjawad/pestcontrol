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
  Skeleton,
  Button,
  Modal,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import PhotoIcon from "@mui/icons-material/Photo";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import APICall from "@/networkUtil/APICall";
import { inspectionReport } from "@/networkUtil/Constants";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import DateFilters from "@/components/generic/DateFilters";

import { format } from "date-fns";

const Page = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // States for image modal
  const [openModal, setOpenModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
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
        `${inspectionReport}/get?${queryParams.join("&")}`
      );
      setSalesData(response?.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [startDate, endDate]);

  const renderSkeletonRows = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" width={80} />
          </TableCell>
        </TableRow>
      ));
  };

  // Handle opening image modal - FIX HERE: directly accept the pictures array
  const handleOpenImageModal = (pictures) => {
    if (pictures && pictures.length > 0) {
      setCurrentImages(pictures);
      setCurrentImageIndex(0); // Reset to first image
      setOpenModal(true);
    }
  };

  // Handle closing image modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Functions for carousel navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle PDF generation with correct logo aspect ratio
  const downloadPDF = () => {
    const doc = new jsPDF();
    const formattedRange =
      startDate && endDate
        ? `${format(new Date(startDate), "MMM dd, yyyy")} - ${format(
            new Date(endDate),
            "MMM dd, yyyy"
          )}`
        : format(new Date(), "MMMM yyyy");

    const title = `Inspection Report - ${formattedRange}`;

    // Add company logo with proper aspect ratio
    const img = new Image();
    img.src = "/logo.jpeg"; // Update with your actual logo path

    img.onload = function () {
      // Calculate aspect ratio to avoid stretching
      const imgWidth = 40;
      const imgHeight = (img.height * imgWidth) / img.width;

      // Add logo with correct proportions
      doc.addImage(img, "PNG", 15, 10, imgWidth, imgHeight);

      // Add company name
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ACCURATE", 60, 20);
      doc.setFontSize(14);
      doc.text("PEST CONTROL SERVICES LLC", 60, 28);

      // Add title with month/year
      doc.setFontSize(16);
      doc.text(title, 15, imgHeight + 20);

      // Add current date
      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${date}`, 15, imgHeight + 30);

      // Create table data to match the displayed table
      const tableColumn = ["ID", "Client Name", "Client Remarks"];

      const tableRows = salesData.map((row, index) => {
        return [
          index + 1,
          row?.user_client?.name || "",
          row?.client_remarks || "",
        ];
      });

      // Convert table to PDF
      doc.autoTable({
        startY: imgHeight + 35,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [76, 175, 80] },
        columnStyles: {
          0: { cellWidth: 15 }, // ID column width
          1: { cellWidth: 70 }, // Client Name column width
          2: { cellWidth: 105 }, // Client Remarks column width
        },
        didDrawPage: function (data) {
          // Add page numbers
          doc.setFontSize(10);
          doc.text(
            `Page ${doc.internal.getNumberOfPages()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      // Save PDF
      const fileDate = startDate
        ? format(new Date(startDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM");
      doc.save(`accurate_inspection_report_${fileDate}.pdf`);
    };

    // Handle potential error
    img.onerror = function () {
      console.error("Error loading logo image");
      // Generate PDF without logo
      generatePDFWithoutLogo(doc, title);
    };
  };

  // Backup function if logo can't be loaded
  const generatePDFWithoutLogo = (doc, title) => {
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ACCURATE PEST CONTROL", 15, 20);
    doc.text(title, 15, 40);

    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 15, 50);

    // Create table data to match the displayed table
    const tableColumn = ["ID", "Client Name", "Client Remarks"];

    const tableRows = salesData.map((row, index) => {
      return [
        index + 1,
        row?.user_client?.name || "",
        row?.client_remarks || "",
      ];
    });

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [76, 175, 80] },
    });

    const fileDate = startDate
      ? format(new Date(startDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM");
    doc.save(`accurate_inspection_report_${fileDate}.pdf`);
  };

  return (
    <div>
      <div className="pageTitle"> Inspection Details </div>

      <div className="flex justify-between items-center mb-4 mt-5">
        <div
          style={{
            border: "1px solid #38A73B",
            borderRadius: "8px",
            height: "40px",
            width: "150px",
            alignItems: "center",
            display: "flex",
          }}
        >
          <img
            src="/Filters lines.svg"
            height={20}
            width={20}
            className="ml-2 mr-2"
            alt="filter"
          />
          <DateFilters onDateChange={handleDateChange} />
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={downloadPDF}
          disabled={fetchingData}
          style={{ backgroundColor: "#4CAF50" }}
        >
          Download PDF
        </Button>
      </div>

      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>ID</TableCell>
              <TableCell style={{ color: "white" }}>Client Name</TableCell>
              <TableCell style={{ color: "white" }}>Client Remarks</TableCell>
              <TableCell style={{ color: "white" }}>General Remarks</TableCell>
              <TableCell style={{ color: "white" }}>
                Inspection Remarks
              </TableCell>
              <TableCell style={{ color: "white" }}>
                {" "}
                Recommendations for Operations{" "}
              </TableCell>
              <TableCell style={{ color: "white" }}> Nesting Area </TableCell>
              <TableCell style={{ color: "white" }}> Pictures </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell> {row?.user_client?.name} </TableCell>
                    <TableCell> {row?.client_remarks} </TableCell>
                    <TableCell> {row?.general_comment} </TableCell>
                    <TableCell>
                      {" "}
                      {row?.inspection_remarks || "No Remarks"}{" "}
                    </TableCell>
                    <TableCell> {row?.recommendation_for_operation} </TableCell>
                    <TableCell> {row?.nesting_area} </TableCell>
                    <TableCell>
                      {row.pictures?.length > 0 ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleOpenImageModal(row.pictures)}
                        >
                          <img
                            src={row.pictures[0]}
                            alt="Visit"
                            width="50"
                            height="50"
                            style={{ borderRadius: "5px" }}
                          />
                          {row.pictures.length > 1 && (
                            <div className="text-xs text-blue-600 mt-1">
                              +{row.pictures.length - 1} more
                            </div>
                          )}
                        </div>
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Modal with Carousel */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 id="image-modal-title">Inspection Images</h2>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </div>

          {/* Carousel Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {/* Current Image Display */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {currentImages.length > 0 && (
                <img
                  src={currentImages[currentImageIndex]}
                  alt={`Inspection image ${currentImageIndex + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              )}
            </div>

            {/* Navigation Arrows */}
            {currentImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  style={{
                    position: "absolute",
                    left: 0,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    marginLeft: "10px",
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  style={{
                    position: "absolute",
                    right: 0,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    marginRight: "10px",
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}
          </div>

          {/* Image Counter */}
          <div style={{ textAlign: "center" }}>
            <p>
              {currentImages.length > 0
                ? `Image ${currentImageIndex + 1} of ${currentImages.length}`
                : "No images available"}
            </p>
          </div>

          {/* Thumbnails for quick navigation */}
          {currentImages.length > 1 && (
            <ImageList
              sx={{ width: "100%", marginTop: 2 }}
              cols={Math.min(currentImages.length, 5)}
              rowHeight={80}
            >
              {currentImages.map((img, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    cursor: "pointer",
                    opacity: index === currentImageIndex ? 1 : 0.6,
                    border:
                      index === currentImageIndex
                        ? "2px solid #4CAF50"
                        : "none",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Page;
