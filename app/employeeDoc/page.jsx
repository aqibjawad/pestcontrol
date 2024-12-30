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
  CircularProgress,
  Skeleton,
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
  const [selectedFile, setSelectedFile] = useState("");
  const [currentDocData, setCurrentDocData] = useState(null);

  const [formState, setFormState] = useState({
    status: "pending",
    startDate: "",
    expiryDate: "",
    processDate: "",
    processAmount: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [statusCompleted, setStatusCompleted] = useState(
    Array(tabData.length).fill(false)
  );
  const [changeStatus, setChangeStatus] = useState(false);
  const [completedTabs, setCompletedTabs] = useState([]);
  const [activeTabs, setActiveTabs] = useState([0]);
  const [employeeList, setEmployeeList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = getParamsFromUrl(currentUrl);

    if (urlParams.id) {
      setId(urlParams.id);
      getAllEmployees(urlParams.id);
    }
  }, []);

  useEffect(() => {
    const currentDoc = employeeList.find(
      (doc) => doc.name === tabData[activeTab]
    );
    if (currentDoc) {
      setCurrentDocData(currentDoc);
      setFormState({
        status: currentDoc.status || "pending",
        startDate: currentDoc.start || "",
        expiryDate: currentDoc.expiry || "",
        processDate: currentDoc.process_date || "",
        processAmount: currentDoc.process_amt || "",
        description: currentDoc.desc || "",
      });
    } else {
      setCurrentDocData(null);
      setFormState({
        status: "pending",
        startDate: "",
        expiryDate: "",
        processDate: "",
        processAmount: "",
        description: "",
      });
    }
  }, [activeTab, employeeList]);

  const getAllEmployees = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/${employeeId}`
      );
      if (response?.data?.employee?.documents) {
        const documents = response.data.employee.documents;
        setEmployeeList(documents);

        // Find the first document's status
        const firstDoc = documents.find((doc) => doc.name === tabData[0]);
        const isFirstDone = firstDoc?.status === "done";

        // Only set completed tabs and active tabs if first document is done
        if (isFirstDone) {
          const completedDocs = documents.filter(
            (doc) => doc.status === "done"
          );
          const completedIndices = completedDocs.map((doc) =>
            tabData.indexOf(doc.name)
          );
          setCompletedTabs(completedIndices);

          const maxCompletedIndex = Math.max(...completedIndices, 0);
          const activeTabsList = [...completedIndices];
          if (maxCompletedIndex + 1 < tabData.length) {
            activeTabsList.push(maxCompletedIndex + 1);
          }
          setActiveTabs(activeTabsList);
        } else {
          // If first document is not done, only first tab is active
          setCompletedTabs([]);
          setActiveTabs([0]);
        }

        const updatedStatus = documents.map((doc) => doc.status === "done");
        setStatusCompleted(updatedStatus);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch employee data",
      });
    } finally {
      setFetchingData(false);
    }
  };

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
    setLoading(true);
    try {
      const obj = {
        user_id: id,
        name: tabData[activeTab],
        status: formState.status,
        file: selectedFile,
        start: formState.startDate,
        expiry: formState.expiryDate,
        process_date: formState.processDate,
        process_amt: formState.processAmount,
        desc: formState.description,
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

        // Refresh employee data to get updated information
        await getAllEmployees(id);

        const updatedStatus = [...statusCompleted];
        updatedStatus[activeTab] = true;
        setStatusCompleted(updatedStatus);

        if (formState.status === "done") {
          // Only proceed to next tab if current tab is completed and it's either
          // the first tab or previous tabs are completed
          const isFirstTab = activeTab === 0;
          const previousTabsCompleted =
            isFirstTab || completedTabs.includes(activeTab - 1);

          if (previousTabsCompleted) {
            const newCompletedTabs = [...completedTabs, activeTab].sort(
              (a, b) => a - b
            );
            setCompletedTabs(newCompletedTabs);

            const nextTab = activeTab + 1;
            if (nextTab < tabData.length) {
              setActiveTabs([...new Set([...activeTabs, nextTab])]);
              setActiveTab(nextTab);
            }
          }
        }

        setSelectedFile("");
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
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    if (
      newValue === 0 ||
      (completedTabs.includes(0) &&
        (completedTabs.includes(newValue) || activeTabs.includes(newValue)))
    ) {
      setActiveTab(newValue);
    }
  };

  const getTabStyle = (index) => {
    const isFirstTabDone = completedTabs.includes(0);
    return {
      color: completedTabs.includes(index) ? "green" : "inherit",
      fontWeight: completedTabs.includes(index) ? "bold" : "normal",
      opacity:
        index === 0 ||
        (isFirstTabDone &&
          (activeTabs.includes(index) || completedTabs.includes(index)))
          ? 1
          : 0.5,
    };
  };

  const renderGrids = () => {
    if (fetchingData) {
      return (
        <Box className="space-y-6">
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={50} />
        </Box>
      );
    }

    const showFirstGrid = activeTab === 1 || activeTab === 6;

    if (changeStatus && activeTab === 8) {
      return null;
    }

    return (
      <Box className="space-y-6">
        {showFirstGrid ? (
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
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </Paper>
        ) : (
          <Paper className="p-4">
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
                <FormControlLabel
                  value="done"
                  control={<Radio />}
                  label="Done"
                />
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
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <Box className="p-6">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card className="p-4">
            {fetchingData ? (
              // Display skeleton loaders for tabs
              Array.from({ length: tabData.length }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={40}
                  className="mb-2"
                />
              ))
            ) : (
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
                    style={getTabStyle(index)}
                    disabled={
                      !activeTabs.includes(index) &&
                      !completedTabs.includes(index)
                    }
                  />
                ))}
              </Tabs>
            )}
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
