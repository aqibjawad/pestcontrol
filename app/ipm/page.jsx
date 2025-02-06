"use client";

import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import "jspdf-autotable";

const initialImages = [
  {
    id: 1,
    src: "https://worldcitizenconsultants.com/wp-content/uploads/sb-instagram-feed-images/475112712_122269245788179403_7328766855650196834_nlow.webp",
    description: "Image 2",
  },
  {
    id: 2,
    src: "https://worldcitizenconsultants.com/wp-content/uploads/sb-instagram-feed-images/475184712_122269906364179403_7093659696345052302_nlow.webp",
    description: "Image 3",
  },
];

const Page = () => {
  const [images, setImages] = useState(initialImages);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (image) => {
    setSelectedImages([...selectedImages, image]);
    setImages(images.filter((img) => img.id !== image.id));
  };

  const handleDelete = (id) => {
    const removedImage = selectedImages.find((img) => img.id === id);
    setImages([...images, removedImage]);
    setSelectedImages(selectedImages.filter((img) => img.id !== id));
  };

  const addHeader = (doc) => {
    doc.setFontSize(12);
    doc.text("Accurate Pest Control Services", 20, 15);
    doc.setFontSize(9);
    doc.text(
      "Head Office: Warehouse No.1, Plot No. 247-289, Al Qusais Industrial Area 4 – Dubai, United Arab Emirates",
      20,
      20
    );
    doc.text(
      "Tel: 043756435 - 0521528725 Email: info@accuratepestcontrol.ae, operations@accuratepestcontrol.ae",
      20,
      25
    );
  };

  const addFooter = (doc) => {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.text("Thanks for your Business with", 20, pageHeight - 40);
    doc.text(
      "APCS will ensure to suppress all pest during the tenure of the contract and ready to attend any genuine",
      20,
      pageHeight - 35
    );
    doc.text(
      "complaint from the client at any time during the tenure of this contract however, if repetitive complaints are due",
      20,
      pageHeight - 30
    );
    doc.text(
      "to non- compliance to the above-mentioned recommendations and suggestions the client will have limited",
      20,
      pageHeight - 25
    );
    doc.text(
      "coverage until recommendations has been met or carried out.",
      20,
      pageHeight - 20
    );
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yPosition = 40;
    const pageHeight = doc.internal.pageSize.height;
    let currentPage = 1;

    // Add header to first page
    addHeader(doc);

    // Add images and descriptions
    for (const [index, image] of selectedImages.entries()) {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        currentPage++;
        yPosition = 20;
        addHeader(doc);
      }

      // Add description (Left column)
      doc.setFontSize(10);
      const issueText =
        image.description ||
        "Holes were observed in the walls, creating entry points for rats and increasing the risk of infestation.";
      const recommendationText =
        "Seal all wall holes effectively to block rat entry and maintain a pest-free environment. Regular inspections are recommended to ensure durability.";

      // Add the issue text in a box
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.rect(20, yPosition, 80, 30, "FD");
      doc.text(issueText, 25, yPosition + 10, { maxWidth: 70 });

      // Add the recommendation text in a box
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.rect(110, yPosition, 80, 30, "FD");
      doc.text(recommendationText, 115, yPosition + 10, { maxWidth: 70 });

      yPosition += 40;
    }

    // Add footer to last page
    addFooter(doc);

    // Save PDF
    doc.save("inspection-report.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Top Section: Image Grid */}
      <Grid container spacing={2} justifyContent="center">
        {images.map((image) => (
          <Grid
            item
            key={image.id}
            xs="auto"
            onClick={() => handleImageClick(image)}
            style={{ cursor: "pointer" }}
          >
            <Card>
              <CardMedia
                component="img"
                width="50"
                height="50"
                image={image.src}
                alt={image.description}
                style={{ objectFit: "cover" }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Section: Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedImages.map((image, index) => (
              <TableRow key={image.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={image.src}
                    alt={image.description}
                    width="150"
                    height="150"
                    style={{ objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{image.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(image.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Generate PDF Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        style={{ marginTop: 20 }}
      >
        Generate PDF Report
      </Button>
    </div>
  );
};

export default Page;
