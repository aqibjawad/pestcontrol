"use client";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import Dropdown from "../../../components/generic/Dropdown";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import APICall from "../../../networkUtil/APICall"; // Import your API utility
import { getAllEmpoyesUrl } from "../../../networkUtil/Constants"; // Assuming you have constants defined
import GreenButton from "@/components/generic/GreenButton";
import { AppAlerts } from "../../../Helper/AppAlerts";
import { useRouter } from "next/navigation";
const EmployeeDocuments = () => {
  const api = new APICall();

  const appAlerts = new AppAlerts();

  const router = useRouter();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [userId, setUserId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState({
    type: "",
    start_date: "",
    end_date: "",
    image: null,
    description: "",
  });

  const DOCUMENT_TYPES = [
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
    const getParamsFromUrl = (url) => {
      const parts = url.split("?");
      const params = {};
      if (parts.length > 1) {
        const queryParams = parts[1].split("&");
        for (const param of queryParams) {
          const [key, value] = param.split("=");
          params[key] = decodeURIComponent(value);
        }
      }
      return params;
    };

    const { id, name } = getParamsFromUrl(window.location.href);
    setUserId(id);

    // Preselect the dropdown if the name parameter exists and is valid
    if (name && DOCUMENT_TYPES.includes(name)) {
      setSelectedDocument((prev) => ({
        ...prev,
        type: name,
      }));
    }
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
    setLoadingSubmit(true);

    if (!userId) {
      appAlerts.errorAlert("User ID not found!");
      setLoadingSubmit(false);
      return;
    } else if (!selectedDocument.type) {
      appAlerts.errorAlert("Document type is required!");
      setLoadingSubmit(false);
      return;
    } else if (!selectedDocument.start_date) {
      appAlerts.errorAlert("Start date is required!");
      setLoadingSubmit(false);
      return;
    } else if (!selectedDocument.end_date) {
      appAlerts.errorAlert("End date is required!");
      setLoadingSubmit(false);
      return;
    } else if (!selectedDocument.image) {
      appAlerts.errorAlert("Document image is required!");
      setLoadingSubmit(false);
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
        appAlerts.successAlert("Document uploaded successfully!");
        router.back();
      } else {
        appAlerts.errorAlert("Failed to upload document.");
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
        {/* Option 1: Show Dropdown with Pre-Selected Value */}
        {!selectedDocument.type && (
          <Grid item xs={6}>
            <Dropdown
              options={DOCUMENT_TYPES}
              title="Select Document"
              value={selectedDocument.type}
              onChange={handleDropdownChange}
            />
          </Grid>
        )}

        {/* Option 2: Show the selected value directly (hide dropdown if pre-selected) */}
        {selectedDocument.type && (
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", fontSize: "18px" }}
            >
              {selectedDocument.type}
            </Typography>
          </Grid>
        )}
      </Grid>

      {selectedDocument.type && (
        <Grid
          container
          spacing={3}
          style={{ maxWidth: "1000px", marginTop: "1rem" }}
        >
          {/* <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "20px" }}
              variant="subtitle1"
              gutterBottom
            >
              {selectedDocument.type}
            </Typography>
          </Grid> */}
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
          <Grid item xs={12}>
            <UploadImagePlaceholder
              onFileSelect={handleFileSelect}
              title={`${selectedDocument.type} Document`}
            />
          </Grid>
          <Grid item xs={12}>
            <GreenButton
              onClick={handleSubmit}
              title={
                loadingSubmit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Submit"
                )
              }
            />

            {/* <Button
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
            </Button> */}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default EmployeeDocuments;
