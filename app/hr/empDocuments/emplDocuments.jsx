"use client";

import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import Dropdown from "../../../components/generic/Dropdown";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";

const EmployeeDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState({
    type: "",
    start_date: "",
    end_date: "",
    image: null,
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

  const handleDropdownChange = (value) => {
    setSelectedDocument({
      type: value,
      start_date: "",
      end_date: "",
      image: null,
    });
  };

  const handleFieldChange = (field, value) => {
    setSelectedDocument((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file) => {
    setSelectedDocument((prev) => ({ ...prev, image: file }));
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
            <Typography sx={{fontWeight:"bold", fontSize:"20px"}} variant="subtitle1" gutterBottom>
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
          <Grid item xs={12}>
            <UploadImagePlaceholder
              onFileSelect={handleFileSelect}
              title={`${selectedDocument.type} Document`}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default EmployeeDocuments;
