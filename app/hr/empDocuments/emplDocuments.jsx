"use client";

import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import InputWithTitle2 from "@/components/generic/InputWithTitle2";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import "../employee/index.css";
import Dropdown from "../../../components/generic/Dropdown";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";

const EmployeeDocuments = () => {
  // Add state management for form data
  const [data, setData] = useState({
    hi_start: "",
    hi_expiry: "",
    ui_start: "",
    ui_expiry: "",
    dm_card: "",
    dm_start: "",
    dm_expiry: "",
  });

  const [productImage, setProductForImage] = useState();

  // Add state for insurance status
  const [healthInsured, setHealthInsured] = useState(false);
  const [unemployed, setUnemployed] = useState(false);

  // Handle general form changes
  const onChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle health insurance status changes
  const handleHealthIsuredState = (value) => {
    setHealthInsured(value === "Active");
  };

  // Handle unemployment insurance status changes
  const handleUnEmpoyedState = (value) => {
    setUnemployed(value === "Active");
  };

  const handleFileSelect = (file) => {
    setProductForImage(file);
    onChange("profile_image", file);
  };

  return (
    <div>
      {/* Health Insurance Section */}
      <Typography variant="h6" gutterBottom className="health-head">
        Employee Documents
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1000px" }}>
        <Grid item xs={4}>
          <Dropdown
            options={["Active", "Inactive"]}
            title={"Health Insurance Status"}
            onChange={handleHealthIsuredState}
          />
        </Grid>
        {healthInsured ? (
          <>
            <Grid className="mt-5" item xs={4} md={4}>
              <InputWithTitle3
                title="Insurance Start"
                type="date"
                placeholder="Insurance Start"
                value={data.hi_start}
                onChange={(name, value) => onChange("hi_start", value)}
              />
            </Grid>
            <Grid className="mt-5" item xs={4} md={4}>
              <InputWithTitle3
                title="Insurance Expiry"
                type="date"
                placeholder="Insurance Expiry"
                value={data.hi_expiry}
                onChange={(name, value) => onChange("hi_expiry", value)}
              />
            </Grid>
            <Grid className="" item xs={12} md={12}>
              <UploadImagePlaceholder
                onFileSelect={handleFileSelect}
                title={"Health Insurance Document"}
              />
            </Grid>
          </>
        ) : null}
      </Grid>

      {/* Unemployment Insurance Section */}
      <Typography
        variant="h6"
        gutterBottom
        className="health-head"
        style={{ marginTop: "2rem" }}
      >
        Unemployment Insurance
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1000px" }}>
        <Grid item xs={4}>
          <Dropdown
            options={["Active", "Inactive"]}
            title={"Unemployment Insurance Status"}
            onChange={handleUnEmpoyedState}
          />
        </Grid>
        {unemployed ? (
          <>
            <Grid className="mt-5" item xs={4} md={4}>
              <InputWithTitle3
                title="Insurance Start"
                type="date"
                placeholder="Insurance Start"
                value={data.ui_start}
                onChange={(name, value) => onChange("ui_start", value)}
              />
            </Grid>
            <Grid className="mt-5" item xs={4} md={4}>
              <InputWithTitle3
                title="Insurance Expiry"
                type="date"
                placeholder="Insurance Expiry"
                value={data.ui_expiry}
                onChange={(name, value) => onChange("ui_expiry", value)}
              />
            </Grid>
            <Grid className="" item xs={12} md={12}>
              <UploadImagePlaceholder
                onFileSelect={handleFileSelect}
                title={"Unemployment Insurance Document"}
              />
            </Grid>
          </>
        ) : null}

        <Grid item xs={4}>
          <InputWithTitle2
            title="DM Card"
            type="text"
            placeholder="DM Card"
            value={data.dm_card}
            onChange={(name, value) => onChange("dm_card", value)}
          />
        </Grid>
        <Grid className="mt-2" item lg={4} xs={4} md={4}>
          <InputWithTitle3
            title="Card Start"
            type="date"
            placeholder="Card Start"
            value={data.dm_start}
            onChange={(name, value) => onChange("dm_start", value)}
          />
        </Grid>
        <Grid className="mt-2" item lg={4} xs={4} md={4}>
          <InputWithTitle3
            title="Card Expiry"
            type="date"
            placeholder="Card Expiry"
            value={data.dm_expiry}
            onChange={(name, value) => onChange("dm_expiry", value)}
          />
        </Grid>
        <Grid className="" item xs={12} md={12}>
          <UploadImagePlaceholder
            onFileSelect={handleFileSelect}
            title={"DM Card Document"}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default EmployeeDocuments;
