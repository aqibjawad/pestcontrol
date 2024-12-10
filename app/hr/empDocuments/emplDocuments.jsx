"use client";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import Dropdown from "../../../components/generic/Dropdown";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import APICall from "../../../networkUtil/APICall"; // Import your API utility
import { getAllEmpoyesUrl } from "../../../networkUtil/Constants"; // Assuming you have constants defined

const EmployeeDocuments = () => {
  const api = new APICall();

  const [userId, setUserId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState({
    type: "",
    start_date: "",
    end_date: "",
    image: null,
    description: "",
  });

  const documents = [
    "Labor Card",
    "Employment Letter",
    "Offer Letter",
    "Joining Letter",
    "Visa",
    "Medical Insurance",
    "Driving License",
    "DM Card",
    "EHOC",
    "Asset and Vehicle Policy Confirmation",
  ];

  useEffect(() => {
    const getIdFromUrl = (url) => {
      const parts = url.split("?");
      if (parts.length > 1) {
        const queryParams = parts[1].split("&");
        for (const param of queryParams) {
          const [key, value] = param.split("=");
          if (key === "id") {
            return value;
          }
        }
      }
      return null;
    };

    const id = getIdFromUrl(window.location.href);
    setUserId(id);
  }, []);

  const handleDropdownChange = (value) => {
    setSelectedDocument({
      type: value,
      start_date: "",
      end_date: "",
      image: null,
      description: "",
    });
  };

  const handleFieldChange = (field, value) => {
    setSelectedDocument((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file) => {
    setSelectedDocument((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("User ID not found!");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("name", selectedDocument.type);
    formData.append("status", "active");
    formData.append("start", selectedDocument.start_date);
    formData.append("expiry", selectedDocument.end_date);
    formData.append("desc", selectedDocument.description);
    if (selectedDocument.image) {
      formData.append("file", selectedDocument.image);
    }

    try {
      const response = await api.postDataWithTokn(
        `${getAllEmpoyesUrl}/update_docs`,
        formData
      );

      if (response.status === "success") {
        alert("Document uploaded successfully!");
        // Reset form
        setSelectedDocument({
          type: "",
          start_date: "",
          end_date: "",
          image: null,
          description: "",
        });
      } else {
        alert("Failed to upload document");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Error uploading document");
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom className="health-head">
        Employee Documents
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1000px" }}>
        <Grid item xs={6}>
          <Dropdown
            options={documents}
            title="Select Document"
            value={selectedDocument.type}
            onChange={handleDropdownChange}
          />
        </Grid>
      </Grid>

      {selectedDocument.type && (
        <Grid
          container
          spacing={3}
          style={{ maxWidth: "1000px", marginTop: "1rem" }}
        >
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "20px" }}
              variant="subtitle1"
              gutterBottom
            >
              {selectedDocument.type}
            </Typography>
          </Grid>
          <Grid className="mt-2" item xs={6}>
            <InputWithTitle3
              title="Start Date"
              type="date"
              placeholder="Start Date"
              value={selectedDocument.start_date}
              onChange={(name, value) => handleFieldChange("start_date", value)}
            />
          </Grid>
          <Grid className="mt-2" item xs={6}>
            <InputWithTitle3
              title="End Date"
              type="date"
              placeholder="End Date"
              value={selectedDocument.end_date}
              onChange={(name, value) => handleFieldChange("end_date", value)}
            />
          </Grid>
          {/* <Grid className="mt-2" item xs={12}>
            <InputWithTitle3
              title="Description"
              type="text"
              placeholder="Enter document description"
              value={selectedDocument.description}
              onChange={(name, value) =>
                handleFieldChange("description", value)
              }
            />
          </Grid> */}
          <Grid item xs={12}>
            <UploadImagePlaceholder
              onFileSelect={handleFileSelect}
              title={`${selectedDocument.type} Document`}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                !selectedDocument.type ||
                !selectedDocument.start_date ||
                !selectedDocument.end_date ||
                !selectedDocument.image
              }
            >
              Submit Document
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default EmployeeDocuments;
