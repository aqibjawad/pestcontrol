"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import APICall from "@/networkUtil/APICall";
import { ipmReport } from "@/networkUtil/Constants";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImages, setProcessedImages] = useState([]);

  const getParamFromUrl = (url, param) => {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    return searchParams.get(param);
  };

  const getIpmReports = async () => {
    setFetchingData(true);
    const id = getParamFromUrl(window.location.href, "id");

    try {
      const url = `${ipmReport}/get/${id}`;
      const response = await api.getDataWithToken(url);

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
  }, []);

  const convertImageToBase64 = async (imageUrl) => {
    try {
      // Use proxy or CORS-anywhere service if direct fetch fails
      const proxiedUrl = `https://cors-anywhere.herokuapp.com/${imageUrl}`;
      
      const response = await fetch(proxiedUrl, {
        headers: {
          'Origin': window.location.origin // Required by some CORS services
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      
      // Fallback: Return original URL if base64 conversion fails
      return imageUrl;
    }
  };
  
  const handleExportPDF = async () => {
    const pdfContent = document.createElement("div");
    pdfContent.innerHTML = `<h1>IPM Report Images</h1>`;
  
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
  
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th style="border: 1px solid black; padding: 8px;">Image</th>
        <th style="border: 1px solid black; padding: 8px;">Description</th>
        <th style="border: 1px solid black; padding: 8px;">Recommendations</th>
      </tr>
    `;
    table.appendChild(thead);
  
    const tbody = document.createElement("tbody");
  
    for (const image of processedImages) {
      // Try multiple strategies for image rendering
      let displayImage = image.src;
      
      try {
        const base64Image = await convertImageToBase64(image.src);
        displayImage = base64Image;
      } catch (error) {
        console.warn("Image conversion failed, using original URL");
      }
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="border: 1px solid black; padding: 8px; text-align: center;">
          <img 
            src="${displayImage}" 
            style="max-width: 150px; max-height: 150px; object-fit: contain;" 
            onerror="this.src='fallback-image.png'; this.onerror=null;"
          />
        </td>
        <td style="border: 1px solid black; padding: 8px;">${image.description}</td>
        <td style="border: 1px solid black; padding: 8px;">${image.recommendations}</td>
      `;
      tbody.appendChild(row);
    }
  
    table.appendChild(tbody);
    pdfContent.appendChild(table);
  
    document.body.appendChild(pdfContent);
  
    const opt = {
      margin: 10,
      filename: "ipm_report_images.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, // Enable CORS
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
  
    html2pdf().set(opt).from(pdfContent).save();
    document.body.removeChild(pdfContent);
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleSaveImageDetails = () => {
    if (selectedImage) {
      // Add to processed images
      const updatedProcessedImages = [...processedImages, selectedImage];
      setProcessedImages(updatedProcessedImages);

      // Remove from available images
      const updatedAvailableImages = availableImages.filter(
        (img) => img.id !== selectedImage.id
      );
      setAvailableImages(updatedAvailableImages);

      handleCloseModal();
    }
  };

  // const handleExportPDF = async () => {
  //   // Create a container for PDF content
  //   const pdfContent = document.createElement("div");
  //   pdfContent.innerHTML = `<h1>IPM Report Images</h1>`;

  //   // Create a table for PDF
  //   const table = document.createElement("table");
  //   table.style.width = "100%";
  //   table.style.borderCollapse = "collapse";

  //   // Table header
  //   const thead = document.createElement("thead");
  //   thead.innerHTML = `
  //     <tr>
  //       <th style="border: 1px solid black; padding: 8px;">Image</th>
  //       <th style="border: 1px solid black; padding: 8px;">Description</th>
  //       <th style="border: 1px solid black; padding: 8px;">Recommendations</th>
  //     </tr>
  //   `;
  //   table.appendChild(thead);

  //   // Table body
  //   const tbody = document.createElement("tbody");

  //   // Convert images to base64 and create table rows
  //   for (const image of processedImages) {
  //     const base64Image = await convertImageToBase64(image.src);

  //     const row = document.createElement("tr");
  //     row.innerHTML = `
  //       <td style="border: 1px solid black; padding: 8px; text-align: center;">
  //         <img src="${base64Image}" style="max-width: 150px; max-height: 150px;" />
  //       </td>
  //       <td style="border: 1px solid black; padding: 8px;">${image.description}</td>
  //       <td style="border: 1px solid black; padding: 8px;">${image.recommendations}</td>
  //     `;
  //     tbody.appendChild(row);
  //   }

  //   table.appendChild(tbody);
  //   pdfContent.appendChild(table);

  //   // Add the content to the document
  //   document.body.appendChild(pdfContent);

  //   // PDF export options
  //   const opt = {
  //     margin: 10,
  //     filename: "ipm_report_images.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   // Generate PDF
  //   html2pdf().set(opt).from(pdfContent).save();

  //   // Remove the temporary content
  //   document.body.removeChild(pdfContent);
  // };

  return (
    <div>
      {/* Image Grid */}
      {availableImages.length > 0 && (
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
      )}

      {/* Modal for Image Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedImage && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Image Details
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedImage.src}
                    alt="Selected"
                    style={{
                      width: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={selectedImage.description}
                    onChange={(e) =>
                      setSelectedImage({
                        ...selectedImage,
                        description: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Recommendations"
                    multiline
                    rows={4}
                    value={selectedImage.recommendations}
                    onChange={(e) =>
                      setSelectedImage({
                        ...selectedImage,
                        recommendations: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button variant="contained" onClick={handleSaveImageDetails}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Processed Images Table */}
      {processedImages.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleExportPDF}>
            Export to PDF
          </Button>
        </Box>
      )}

      {processedImages.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Recommendations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedImages.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <img
                      src={image.src}
                      alt="Processed"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{image.description}</TableCell>
                  <TableCell>{image.recommendations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Page;
