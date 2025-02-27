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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dynamic from "next/dynamic";

const Ipm = dynamic(() => import("../ipm/ipm"), {
  ssr: false,
});

const initialImages = [
  {
    id: 1,
    src: "https://worldcitizenconsultants.com/wp-content/uploads/sb-instagram-feed-images/475112712_122269245788179403_7328766855650196834_nlow.webp",
    description: "",
  },
  {
    id: 2,
    src: "https://worldcitizenconsultants.com/wp-content/uploads/sb-instagram-feed-images/475184712_122269906364179403_7093659696345052302_nlow.webp",
    description: "",
  },
];

const Header = () => (
  <Grid
    container
    spacing={2}
    alignItems="center"
    sx={{ width: "100%", padding: "20px" }}
  >
    <Grid item xs={12} sx={{ textAlign: "center", marginBottom: "20px" }}>
      <img
        style={{ height: "80px" }}
        src="/logo.jpeg"
        alt="Accurate Pest Control Logo"
      />
    </Grid>
    <Grid item xs={12} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Accurate Pest Control
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
  const reportRef = useRef();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [availableImages, setAvailableImages] = useState(initialImages);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImages([...selectedImages, image]);
  };

  const handleDeleteImage = (id) => {
    const deletedImage = selectedImages.find((img) => img.id === id);
    const recycledImage = {
      ...deletedImage,
      description: "",
    };

    setAvailableImages([...availableImages, recycledImage]);
    setSelectedImages(selectedImages.filter((img) => img.id !== id));
  };

  const handleAvailableImagesChange = (newImages) => {
    setAvailableImages(newImages);
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
          useCORS: true, // Enable cross-origin image loading
          allowTaint: true, // Allow loading of cross-origin images
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
    <>
      <Ipm
        onImageSelect={handleImageSelect}
        availableImages={availableImages}
        onImagesChange={handleAvailableImagesChange}
      />
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

      <div ref={reportRef} style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Header />

          <TableContainer
            component={Paper}
            sx={{
              margin: "20px",
              marginBottom: "100px",
              width: "calc(100% - 40px)",
            }}
          >
            {mounted && (
              <MuiTable>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedImages.map((image, index) => (
                    <TableRow
                      key={image.id}
                      style={{ pageBreakInside: "avoid" }}
                    >
                      <TableCell style={{ width: "120px" }}>
                        <img
                          src={image.src}
                          alt={`Selected ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "70px",
                            objectFit: "cover",
                            display: "block", // Ensure image is properly displayed
                          }}
                          crossOrigin="anonymous" // Enable cross-origin image loading
                        />
                      </TableCell>
                      <TableCell>{image.description}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteImage(image.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            )}
          </TableContainer>

          <Footer />
        </div>

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
              trust in our services. For any queries or assistance, please dont
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
    </>
  );
};

export default IpmPdf;
