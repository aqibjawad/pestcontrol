"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Button,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Upload } from "lucide-react";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";

const tabData = [
  "Offer Letter",
  "Labour Insurance",
  "Entry Permit Inside",
  "Medical",
  "Finger Print",
  "Emirates ID",
  "Contract Submission",
  "Visa Stamping",
  "Towjeeh",
  "ILOE Insurance",
];

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

const InsuranceForm = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formState, setFormState] = useState({
    status: "pending",
    startDate: "",
    expiryDate: "",
    processDate: "",
    processAmount: "",
    description: "",
  });

  const [activeTab, setActiveTab] = useState(0);
  const [statusCompleted, setStatusCompleted] = useState(
    Array(tabData.length).fill(false)
  );
  const [changeStatus, setChangeStatus] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = getParamsFromUrl(currentUrl);
    setId(urlParams.id);
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFormChange = (field) => (event) => {
    setFormState({
      ...formState,
      [field]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const obj = {
        user_id: id,
        name: tabData[activeTab],
        status: formState.status,
        image: selectedFile,
      };

      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/update_docs`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });

        // Update status and move to next tab
        const updatedStatus = [...statusCompleted];
        updatedStatus[activeTab] = true;
        setStatusCompleted(updatedStatus);

        if (activeTab < tabData.length - 1) {
          setActiveTab(activeTab + 1);
        }

        // Reset form state
        setFormState({
          status: "pending",
          startDate: "",
          expiryDate: "",
          processDate: "",
          processAmount: "",
          description: "",
        });
        setSelectedFile(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error.message,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while submitting the form",
      });
    }
  };

  // Rest of the component remains the same...

  const handleTabChange = (event, newValue) => {
    if (newValue <= activeTab && statusCompleted[newValue]) {
      setActiveTab(newValue);
    }
  };

  const renderGrids = () => {
    const showFirstGrid = activeTab === 1 || activeTab === 6;

    if (changeStatus && activeTab === 8) {
      return null;
    }

    return (
      <Box className="space-y-6">
        {showFirstGrid && (
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              {tabData[activeTab]}
            </Typography>
            <Box className="mb-4">
              <Typography className="mb-2">Status</Typography>
              <RadioGroup
                row
                value={formState.status}
                onChange={handleFormChange("status")}
              >
                <FormControlLabel
                  value="pending"
                  control={<Radio />}
                  label="Pending"
                />
                <FormControlLabel
                  value="done"
                  control={<Radio />}
                  label="Done"
                />
              </RadioGroup>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Process Date"
                  value={formState.processDate}
                  onChange={handleFormChange("processDate")}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Process Amount"
                  value={formState.processAmount}
                  onChange={handleFormChange("processAmount")}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formState.description}
              onChange={handleFormChange("description")}
              variant="outlined"
              className="mt-4"
            />

            <Button
              variant="contained"
              color="primary"
              className="mt-4"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Paper>
        )}

        <Paper className="p-4 mt-4">
          <Typography variant="h6" className="mb-4">
            {tabData[activeTab]}
          </Typography>

          <Box className="mb-4">
            <Typography className="mb-2">Status</Typography>
            <RadioGroup
              row
              value={formState.status}
              onChange={(e) => {
                handleFormChange("status")(e);
                setChangeStatus(e.target.value === "done");
              }}
            >
              <FormControlLabel
                value="pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="inProcess"
                control={<Radio />}
                label="In Process"
              />
              <FormControlLabel value="done" control={<Radio />} label="Done" />
            </RadioGroup>
          </Box>

          {formState.status === "inProcess" && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Process Date"
                  value={formState.processDate}
                  onChange={handleFormChange("processDate")}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Process Amount"
                  value={formState.processAmount}
                  onChange={handleFormChange("processAmount")}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}

          {formState.status === "done" && (
            <>
              <Grid item xs={12}>
                <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Typography className="mb-2">Upload Picture</Typography>
                  <Typography className="text-sm text-gray-500">
                    Browse and choose the files you want to upload from your
                    computer
                  </Typography>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label htmlFor="file-upload">
                    <IconButton
                      color="primary"
                      component="span"
                      className="mt-2"
                    >
                      <Upload />
                    </IconButton>
                  </label>
                  {selectedFile && (
                    <Typography className="mt-2 text-sm">
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid className="mt-5" container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={formState.startDate}
                    onChange={handleFormChange("startDate")}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Expiry Date"
                    value={formState.expiryDate}
                    onChange={handleFormChange("expiryDate")}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formState.description}
                onChange={handleFormChange("description")}
                variant="outlined"
                className="mt-4"
              />
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Paper>
      </Box>
    );
  };

  return (
    <Box className="p-6">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card className="p-4">
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              {tabData.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab}
                  disabled={!statusCompleted[index] && index > activeTab}
                />
              ))}
            </Tabs>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {renderGrids()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsuranceForm;
