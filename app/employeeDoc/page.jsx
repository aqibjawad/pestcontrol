"use client";

import React, { useState } from "react";
import {
  Box,
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
} from "@mui/material";
import { Upload } from "lucide-react";

const tabData = [
  "Offer Letter",
  "Labour Insurance",
  "Labour Payment",
  "Entry Permit Inside",
  "Change Status",
  "Medical",
  "Finger Print",
  "Emirates ID",
  "Contract Submission",
  "Visa Stamping",
  "Towjeeh",
  "ILOE Insurance",
];

const InsuranceForm = () => {
  const [formDaata, setFormData] = useState({
    name: "",
    employment_letter: "",
    offer_letter: "",
    labor_insurance: "",
    labor_payment: "",
    entry_permit_inside: "",
    change_status: "",
    medical: "",
    finger_print: "",
    emirates_id: "",
    contract_submission: "",
    visa_stamping: "",
    towjeeh: "",
    iloe_insurance: "",
  });

  const [activeTab, setActiveTab] = useState(0);
  const [statusCompleted, setStatusCompleted] = useState(
    Array(tabData.length).fill(false)
  );

  const handleUpdate = () => {
    const updatedStatus = [...statusCompleted];
    updatedStatus[activeTab] = true;
    setStatusCompleted(updatedStatus);

    // Automatically activate the next tab if available
    if (activeTab < tabData.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleTabChange = (event, newValue) => {
    if (newValue <= activeTab && statusCompleted[newValue]) {
      setActiveTab(newValue);
    }
  };

  return (
    <Box className="p-6">
      <Grid container spacing={3}>
        {/* Tabs Section */}
        <Grid item xs={12} md={3}>
          <Card className="p-4-500">
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

        {/* Form Section */}
        <Grid item xs={12} md={9}>
          <Box className="space-y-6">
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4">
                {tabData[activeTab]}
              </Typography>
              <Box className="mb-4">
                <Typography className="mb-2">Status</Typography>
                <RadioGroup row defaultValue="pending">
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Date" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Amount" variant="outlined" />
                </Grid>
                {activeTab === tabData.length - 1 && (
                  <Grid item xs={12}>
                    <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Typography className="mb-2">Upload Picture</Typography>
                      <Typography className="text-sm text-gray-500">
                        Browse and choose the files you want to upload from your
                        computer
                      </Typography>
                      <IconButton color="primary" className="mt-2">
                        <Upload />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsuranceForm;
