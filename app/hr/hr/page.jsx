"use client";

import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import AllEmployees from "@/app/operations/viewEmployees/allEmployees";
import SalarCal from "../salaryCal/page";
import CommissionCal from "../comCal/page";
import SalaryTotal from "../salaryTotal/page";
import withAuth from "@/utils/withAuth";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Page = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="employee management tabs"
          variant="fullWidth"
        >
          <Tab label="All Employees" />
          <Tab label="Salary Calculation" />
          <Tab label="Commission Calculation" />
          <Tab label="Total Salary" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <AllEmployees />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SalarCal />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <CommissionCal />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <SalaryTotal />
      </TabPanel>
    </Box>
  );
};

export default withAuth(Page);
