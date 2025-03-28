"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Typography,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { ipmReport } from "@/networkUtil/Constants";

// URL Parameter Extraction Function
const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

// Function to convert image to base64
const convertImageToBase64 = async (imageUrl) => {
  console.log("Converting image:", imageUrl);
  try {
    // Try direct fetch first
    const response = await fetch(imageUrl, { mode: "no-cors" });

    if (response) {
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("Successfully converted to base64");
          resolve(reader.result);
        };
        reader.onerror = () => {
          console.error("FileReader error");
          resolve(imageUrl); // fallback
        };
        reader.readAsDataURL(blob);
      });
      return base64;
    }
    return imageUrl;
  } catch (error) {
    console.error("Conversion error:", error);
    return imageUrl;
  }
};

// Print-specific styles (same as before)
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    .table-cell-no-border {
      border: none !important;
    }
    .action-column {
      width: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      visibility: hidden !important;
    }
  }
`;

const Header = () => (
  <Grid
    container
    spacing={2}
    alignItems="center"
    sx={{
      width: "100%",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Grid item xs={12} sx={{ textAlign: "center", marginBottom: "20px" }}>
      <img
        src="/logo.png" // Change to .png if needed
        alt="Accurate Pest Control Logo"
        style={{
          height: "100px",
          width: "auto",
          objectFit: "contain",
        }}
      />
    </Grid>
    <Grid item xs={12} sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: "#37A730" }}>
        Accurate Pest Control Services LLC
      </Typography>
    </Grid>
  </Grid>
);

const Footer = () => (
  <div
    style={{
      position: "fixed",
      bottom: "20px",
      left: 0,
      right: 0,
      textAlign: "center",
      color: "#37A730",
      fontSize: "10px",
      padding: "10px",
    }}
  >
    <div>
      Head Office: Warehouse No.1, Plot No. 247-289, Al Qusais Industrial Area 4
      – Dubai, United Arab Emirates
    </div>
    <div>
      Tel: 043756435 - 0521528725 Email: info@accuratepestcontrol.ae,
      operations@accuratepestcontrol.ae
    </div>
  </div>
);

const IpmPdf = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [originalSupplierList, setOriginalSupplierList] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDescription, setImageDescription] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const reportRef = useRef();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add print styles to the document head
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getIpmReports = async () => {
    setFetchingData(true);
    const id = getParamFromUrl(window.location.href, "id");
    const startDate = getParamFromUrl(window.location.href, "start_date");
    const endDate = getParamFromUrl(window.location.href, "end_date");

    try {
      const queryParams = new URLSearchParams();
      if (id) queryParams.append("id", id);
      if (startDate) queryParams.append("start_date", startDate);
      if (endDate) queryParams.append("end_date", endDate);

      const url = `${ipmReport}/get/${id}`;
      const response = await api.getDataWithToken(url);
      setOriginalSupplierList(response.data);

      const images = response.data.flatMap((item, index) =>
        item.images.map((src, imgIndex) => ({
          id: `${index}-${imgIndex}`,
          src,
          description: "",
          recommendations: "",
        }))
      );
      setAvailableImages(images);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getIpmReports();
    setMounted(true);
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageDescription(image.description || "");
    setRecommendations(image.recommendations || "");
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedImage(null);
    setImageDescription("");
    setRecommendations("");
  };

  const handleAddDescription = async () => {
    if (selectedImage) {
      try {
        setLoading(true);

        const base64Image = await convertImageToBase64(selectedImage.src);

        const newSelectedImage = {
          ...selectedImage,
          base64Image: base64Image || selectedImage.src,
          description: imageDescription,
          recommendations: recommendations,
        };

        setSelectedImages((prev) => [...prev, newSelectedImage]);
        setAvailableImages((prev) =>
          prev.filter((img) => img.id !== selectedImage.id)
        );
        handleModalClose();
      } catch (error) {
        console.error("Error processing image:", error);
        alert(
          "Could not process this image. It will be included with its original URL."
        );

        // Add image anyway with original URL
        const newSelectedImage = {
          ...selectedImage,
          base64Image: selectedImage.src,
          description: imageDescription,
          recommendations: recommendations,
        };

        setSelectedImages((prev) => [...prev, newSelectedImage]);
        setAvailableImages((prev) =>
          prev.filter((img) => img.id !== selectedImage.id)
        );
        handleModalClose();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteImage = (id) => {
    const deletedImage = selectedImages.find((img) => img.id === id);
    setAvailableImages((prevImages) => [
      ...prevImages,
      {
        ...deletedImage,
        description: "",
        recommendations: "",
      },
    ]);
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img.id !== id)
    );
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const element = reportRef.current;
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [0.5, 0.5],
        filename: "inspection-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
    setLoading(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Available Images Grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {availableImages.map((image) => (
          <Grid item xs={4} sm={3} md={2} key={image.id}>
            <img
              src={image.src}
              alt={`Available ${image.id}`}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(image)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal for Image Description (same as before) */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="image-description-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedImage && (
            <>
              <img
                src={selectedImage.src}
                alt="Selected"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  mb: 2,
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Image Description"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Recommendations"
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleAddDescription}
                sx={{
                  mt: 2,
                  backgroundColor: "#37A730",
                  "&:hover": {
                    backgroundColor: "#2c8526",
                  },
                }}
              >
                Add Description
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* PDF Generation Button (same as before) */}
      <Button
        variant="contained"
        onClick={generatePDF}
        disabled={loading}
        sx={{
          mb: 2,
          backgroundColor: "#37A730",
          "&:hover": {
            backgroundColor: "#2c8526",
          },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Download PDF"}
      </Button>

      {/* PDF Content Reference */}
      <div ref={reportRef} style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Header />
          {/* Selected Images Table */}
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              mb: 2,
              width: "100%",
            }}
          >
            <MuiTable>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "25%" }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "37.5%" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "37.5%" }}>
                    Recommendations
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedImages.length > 0 ? (
                  selectedImages.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <img
                          src={image.base64Image || image.src}
                          alt={`Selected ${image.id}`}
                          style={{
                            width: "100px",
                            height: "80px",
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {image.description || "No description"}
                      </TableCell>
                      <TableCell>
                        {image.recommendations || "No recommendations"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        No images have been selected
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
          <Footer />
        </div>

        {/* Thank You Page (same as before) */}
        <div
          style={{
            pageBreakBefore: "always",
            height: "100vh",
            position: "relative",
          }}
        >
          <Header />

          <Paper
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 200px)",
              boxShadow: "none",
            }}
          >
            <Typography variant="h4" sx={{ color: "#37A730", marginBottom: 2 }}>
              Thank You
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", maxWidth: "600px" }}
            >
              Thank you for choosing Accurate Pest Control. We appreciate your
              trust in our services. For any queries or assistance, please don't
              hesitate to contact us.
            </Typography>
            <img
              style={{ width: "150px", height: "100px", marginTop: "2rem" }}
              src="/logo.jpeg"
              alt="Logo"
              crossOrigin="anonymous"
            />
          </Paper>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default IpmPdf;
