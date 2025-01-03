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
  "Employment Letter",
  "Job Offer Letter/Joining Letter APCS",
  "Passport Handover Form",
  "Passport",
  "EID",
  "DM Card",
  "Driving Licence",
  "Personal Photo",
  "MOHRE Letter",
  "Labour Card",
  "Change Status",
  "Visa",
  "EHOC",
  "Medical Report",
  "Visa Stamping",
  "Health Insurance",
  "Vehicle Policy",
  "Asset Policy",
  "ILOE Insurance",
  "Bank Detail/Salary Transfer",
];

const getVisibleDocuments = (profession) => {
  const baseDocuments = tabData.filter(
    (doc) => doc !== "DM Card" && doc !== "EHOC" && doc !== "Vehicle Policy"
  );

  if (["HR Manager", "Accountant", "Receptionist"].includes(profession)) {
    return baseDocuments;
  }

  if (profession === "Sales Manager" || profession === "Sales Officer") {
    return [...baseDocuments, "DM Card", "EHOC"];
  }

  return tabData;
};

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
  const [profession, setProfession] = useState("");
  const [visibleDocuments, setVisibleDocuments] = useState([]);

  const [formState, setFormState] = useState({
    status: "pending",
    startDate: "",
    expiryDate: "",
    processDate: "",
    processAmount: "",
    description: "",
    entryPermitStatus: "Entry Permit",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [statusCompleted, setStatusCompleted] = useState([]);
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
    if (profession) {
      const docs = getVisibleDocuments(profession);
      setVisibleDocuments(docs);
      setStatusCompleted(Array(docs.length).fill(false));
    }
  }, [profession]);

  useEffect(() => {
    const currentDoc = employeeList.find(
      (doc) => doc.name === visibleDocuments[activeTab]
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
        entryPermitStatus: currentDoc.entryPermitStatus || "Entry Permit",
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
        entryPermitStatus: "Entry Permit",
      });
    }
  }, [activeTab, employeeList, visibleDocuments]);

  const getAllEmployees = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/${employeeId}`
      );
      if (response?.data?.employee) {
        setProfession(response.data.employee.profession);

        if (response.data.employee.documents) {
          const documents = response.data.employee.documents;
          setEmployeeList(documents);

          // Get visible documents based on profession
          const docs = getVisibleDocuments(response.data.employee.profession);
          setVisibleDocuments(docs);

          // Find first document status
          const firstDoc = documents.find((doc) => doc.name === docs[0]);
          const isFirstDone = firstDoc?.status === "done";

          if (isFirstDone) {
            const completedDocs = documents.filter(
              (doc) => doc.status === "done"
            );
            const completedIndices = completedDocs
              .map((doc) => docs.indexOf(doc.name))
              .filter((index) => index !== -1);

            setCompletedTabs(completedIndices);

            const maxCompletedIndex = Math.max(...completedIndices, 0);
            const activeTabsList = [...completedIndices];
            if (maxCompletedIndex + 1 < docs.length) {
              activeTabsList.push(maxCompletedIndex + 1);
            }
            setActiveTabs(activeTabsList);
          } else {
            setCompletedTabs([]);
            setActiveTabs([0]);
          }

          const updatedStatus = docs.map(
            (docName) =>
              documents.find((doc) => doc.name === docName)?.status === "done"
          );
          setStatusCompleted(updatedStatus);
        }
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
        name: visibleDocuments[activeTab],
        status: formState.status,
        file: selectedFile,
        start: formState.startDate,
        expiry: formState.expiryDate,
        process_date: formState.processDate,
        process_amt: formState.processAmount,
        desc: formState.description,
      };

      if (visibleDocuments[activeTab] === "Entry Permit Inside") {
        obj.entryPermitStatus = formState.entryPermitStatus;
      }

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

        await getAllEmployees(id);

        const updatedStatus = [...statusCompleted];
        updatedStatus[activeTab] = true;
        setStatusCompleted(updatedStatus);

        if (formState.status === "done") {
          const isFirstTab = activeTab === 0;
          const previousTabsCompleted =
            isFirstTab || completedTabs.includes(activeTab - 1);

          if (previousTabsCompleted) {
            const newCompletedTabs = [...completedTabs, activeTab].sort(
              (a, b) => a - b
            );
            setCompletedTabs(newCompletedTabs);

            const nextTab = activeTab + 1;
            if (nextTab < visibleDocuments.length) {
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

    return (
      <Box className="space-y-6">
        <Paper className="p-4">
          <Typography variant="h6" className="mb-4">
            {tabData[activeTab]}
          </Typography>

          {/* Main Status Section */}
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

          {/* Additional RadioGroup for "Entry Permit Inside" */}
          {tabData[activeTab] === "Entry Permit Inside" && (
            <RadioGroup
              row
              value={formState.entryPermitStatus}
              onChange={handleFormChange("entryPermitStatus")}
            >
              <FormControlLabel
                value="Entry Permit"
                control={<Radio />}
                label="Entry Permit"
              />
              <FormControlLabel
                value="Change Status"
                control={<Radio />}
                label="Change Status"
              />
            </RadioGroup>
          )}

          {/* Status-specific sections */}
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
                    accept="image/*, .pdf"
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
