"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/dashboard.module.css";
import Operations from "../dashboard/components/Operations";
import AllJobs from "../../allJobs/page";
import Vendors from "../../allVendors/page";
import Quotation from "../../viewQuote/page";
import Contracts from "../../../components/Contracts";
import Finance from "../dashboard/components/Finance";
import Reports from "./components/Reports";
import Scheduler from "./components/Scheduler";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl, payments } from "@/networkUtil/Constants";

import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Index = () => {
  const [tabNames, setTabNames] = useState([
    "Work management",
    "Finance Management",
    "Scheduler",
    "Reports",
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedIndexTabs, setSelectedIndexTabs] = useState(0);

  const [paymentList, setPaymentsList] = useState([]);

  const tabs = () => {
    return (
      <div className={styles.topTabConainer}>
        <div className="flex gap-4">
          {tabNames.map((item, index) => {
            return (
              <div
                onClick={() => setSelectedIndex(index)}
                className={`flex-grow ${
                  index === selectedIndex
                    ? styles.tabContainerSelected
                    : styles.tabContainer
                }`}
                key={index}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleTabChange = (event, newIndex) => {
    setSelectedIndexTabs(newIndex);
  };

  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState({});

  const getAllExpenses = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);

      // Sort the employee list by the earliest expiry date
      const sortedEmployees = response.data.sort((a, b) => {
        // Extract the dates for both employees and parse them to Date objects
        const datesA = [
          new Date(a.employee.eid_expiry),
          new Date(a.employee.passport_expiry),
          new Date(a.employee.hi_expiry),
          new Date(a.employee.ui_expiry),
          new Date(a.employee.dm_expiry),
          new Date(a.employee.labour_card_expiry),
        ].filter((date) => !isNaN(date)); // Filter out invalid dates

        const datesB = [
          new Date(b.employee.eid_expiry),
          new Date(b.employee.passport_expiry),
          new Date(b.employee.hi_expiry),
          new Date(b.employee.ui_expiry),
          new Date(b.employee.dm_expiry),
          new Date(b.employee.labour_card_expiry),
        ].filter((date) => !isNaN(date));

        // Get the earliest date for each employee
        const earliestDateA = Math.min(...datesA);
        const earliestDateB = Math.min(...datesB);

        // Sort in ascending order based on the earliest date
        return earliestDateA - earliestDateB;
      });

      // Set the sorted list in state
      setEmployeeList(sortedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllPayments = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${payments}`);
      setPaymentsList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // const getAllQuotes = async () => {
  //   setFetchingData(true);

  //   try {
  //     const response = await api.getDataWithToken(`${job}/all`);

  //     setJobsList(response.data);
  //   } catch (error) {
  //     console.error("Error fetching quotes:", error);
  //   } finally {
  //     setFetchingData(false);
  //   }
  // };

  useEffect(() => {
    getAllExpenses();
    // getAllQuotes();
    getAllPayments();
  }, []);

  return (
    <div className="w-full">
      {tabs()}

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-12 md:col-span-9">
          <div className={selectedIndex === 0 ? `block` : "hidden"}>
            <Operations />
            <AllJobs />
            <Vendors />
            <Quotation />
            <Contracts />
          </div>

          <div className={selectedIndex === 1 ? `block` : "hidden"}>
            <Finance />
          </div>

          <div className={selectedIndex === 2 ? `block` : "hidden"}>
            <Scheduler />
          </div>

          <div className={selectedIndex === 3 ? `block` : "hidden"}>
            <Reports />
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <Tabs
            value={selectedIndexTabs}
            onChange={handleTabChange}
            orientation="horizontal"
            variant="scrollable"
            aria-label="Main tabs"
          >
            <Tab label="Employee" />
            <Tab label="Jobs" />
            <Tab label="Payments" />
          </Tabs>

          {/* Content for each tab */}
          <Box sx={{ p: 3 }}>
            {selectedIndexTabs === 0 &&
              employeeList.map((employee) => (
                <Card key={employee.id} sx={{ mb: 2, p: 2 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mb: 1 }}
                    >
                      <Avatar
                        src={employee?.employee?.profile_image}
                        alt={`${employee.name} Image`}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {employee.name}
                      </Typography>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Eid Expiry:</strong>{" "}
                        {employee?.employee?.eid_expiry}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Passport Expiry:</strong>{" "}
                        {employee?.employee?.passport_expiry}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Insurance Expiry:</strong>{" "}
                        {employee?.employee?.hi_expiry}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Unemployment Expiry:</strong>{" "}
                        {employee?.employee?.ui_expiry}
                      </Typography>
                      <Typography variant="body2">
                        <strong>DM Card Expiry:</strong>{" "}
                        {employee?.employee?.dm_expiry}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Labour Expiry:</strong>{" "}
                        {employee?.employee?.labour_card_expiry}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            {selectedIndexTabs === 1 && (
              <Typography>Jobs Content goes here</Typography>
            )}
            {selectedIndexTabs === 2 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr No</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>Employee Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fetchingData ? (
                      <TableRow>
                        <TableCell colSpan={8} style={{ textAlign: "center" }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentList.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {new Date(row.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>{row?.client_user?.name}</TableCell>
                          <TableCell>{row?.employee_user?.name}</TableCell>
                          <TableCell>{row?.paid_amt}</TableCell>
                          <TableCell>{row?.status}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Index;
