"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/dashboard.module.css";
import Operations from "../dashboard/components/Operations";
import AllJobs from "../../allJobs/page";
import Vendors from "../../allVendors/page";
import Quotation from "../../viewQuote/page";
import Contracts from "../../../components/Contracts";
import Reports from "./components/Reports";

import dynamic from "next/dynamic";

const Finance = dynamic(() => import("../dashboard/components/Finance"));
const Schedule = dynamic(() => import("./components/Schedule"));

import RescheduleJobs from "../../rescheduleJobs/reschedule";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl, payments } from "@/networkUtil/Constants";
import withAuth from "@/utils/withAuth";

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
  CircularProgress,
} from "@mui/material";

// Import the correct icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import EmployeeUpdateModal from "../../../components/employeeUpdate";
import { Router } from "lucide-react";

import { useRouter } from "next/navigation";

const Page = () => {
  const [tabNames, setTabNames] = useState([
    "Work management",
    "Finance Management",
    "Schedule",
    "Reports",
  ]);

  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexTabs, setSelectedIndexTabs] = useState(0);
  const [paymentList, setPaymentsList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    router.push(`/hr/employeeDetails?id=${employee.id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const tabs = () => {
    return (
      <div className={styles.topTabConainer}>
        <div className="flex gap-4">
          {tabNames.map((item, index) => (
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
          ))}
        </div>
      </div>
    );
  };

  const handleTabChange = (event, newIndex) => {
    setSelectedIndexTabs(newIndex);
  };

  const api = new APICall();

  const getAllExpenses = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);

      // Sort the employee list by the earliest expiry date
      const sortedEmployees = response.data.sort((a, b) => {
        // Extract the dates for both employees and parse them to Date objects
        const getDates = (emp) =>
          [
            emp.employee.eid_expiry,
            emp.employee.passport_expiry,
            emp.employee.hi_expiry,
            emp.employee.ui_expiry,
            emp.employee.dm_expiry,
            emp.employee.labour_card_expiry,
          ]
            .map((date) => new Date(date))
            .filter((date) => !isNaN(date.getTime()));

        const datesA = getDates(a);
        const datesB = getDates(b);

        // Get the earliest date for each employee
        const earliestDateA = datesA.length ? Math.min(...datesA) : Infinity;
        const earliestDateB = datesB.length ? Math.min(...datesB) : Infinity;

        return earliestDateA - earliestDateB;
      });

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

  useEffect(() => {
    getAllExpenses();
    getAllPayments();
  }, []);

  const getStatusStyle = (daysLeft) => {
    if (daysLeft === null)
      return {
        backgroundColor: "#F3F4F6",
        textColor: "#6B7280",
        icon: null,
      };

    if (daysLeft < 0)
      return {
        backgroundColor: "#FEE2E2",
        textColor: "#DC2626",
        icon: <ErrorOutlineIcon sx={{ fontSize: 16, color: "#DC2626" }} />,
      };

    if (daysLeft <= 30)
      return {
        backgroundColor: "#FEF3C7",
        textColor: "#D97706",
        icon: <WarningAmberIcon sx={{ fontSize: 16, color: "#D97706" }} />,
      };

    return {
      backgroundColor: "#DCFCE7",
      textColor: "#15803D",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#15803D" }} />,
    };
  };

  const fullList = [
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

  // Dynamic function to check and match missing items
  const matchAndHighlightMissing = (providedList) => {
    // Find missing items
    const missingItems = fullList.filter(
      (item) => !providedList.includes(item)
    );
    // Example: You can dynamically show missing items
    if (missingItems.length > 0) {
      console.log(`These items are missing: ${missingItems.join(", ")}`);
    } else {
      console.log("All items are matched!");
    }
  };

  return (
    <div className="w-full">
      {tabs()}

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-12 md:col-span-9">
          <div className={selectedIndex === 0 ? `block` : "hidden"}>
            <Operations />
            <AllJobs />
            {/* <Vendors /> */}
            <Quotation />
            <Contracts />
          </div>

          <div className={selectedIndex === 1 ? `block` : "hidden"}>
            <Finance isVisible={selectedIndex === 1} />
          </div>

          <div className={selectedIndex === 2 ? `block` : "hidden"}>
            <Schedule isVisible={selectedIndex === 2} />
          </div>

          <div className={selectedIndex === 3 ? `block` : "hidden"}>
            <Reports />
          </div>
        </div>

        <div
          className="col-span-12 md:col-span-3"
          style={{
            height: "2000px",
            overflowY: "auto", 
          }}
        >
          <style>
            {`
              .scroll-container::-webkit-scrollbar {
                width: 8px;
              }

              .scroll-container::-webkit-scrollbar-track {
                background-color: #f1f1f1;
                border-radius: 10px;
              }

              .scroll-container::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 10px;
                border: 2px solid transparent;
                background-clip: content-box;
              }

              .scroll-container::-webkit-scrollbar-thumb:hover {
                background-color: #555;
              }
            `}
          </style>

          <Tabs
            value={selectedIndexTabs}
            onChange={handleTabChange}
            orientation="horizontal"
            variant="scrollable"
            aria-label="Main tabs"
          >
            <Tab label="Employees" />
            <Tab label="Payment Collected" />
            <Tab label="Reschedule" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {selectedIndexTabs === 0 && (
              <div className="space-y-4">
                {fetchingData ? (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress />
                  </Box>
                ) : (
                  employeeList.map((employeess) => (
                    <Card
                      key={employeess.id}
                      sx={{
                        mb: 2,
                        p: 2,
                        boxShadow: 1,
                        "&:hover": { boxShadow: 3 },
                        transition: "box-shadow 0.3s",
                      }}
                    >
                      <CardContent
                        onClick={() => handleEditClick(employeess)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          sx={{ mb: 1 }}
                        >
                          <Avatar
                            src={employeess?.employee?.profile_image}
                            alt={`${employeess.name} Image`}
                            sx={{ width: 48, height: 48 }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {employeess.name}
                          </Typography>
                        </Stack>

                        {/* Documents Display */}
                        <Box sx={{ mt: 2 }}>
                          {fullList.map((item) => {
                            // Check if the current item is present in the employee's documents
                            const document =
                              employeess?.employee?.documents?.find(
                                (doc) => doc.name === item
                              );

                            if (document) {
                              // If document exists, display its details
                              const expiryDate = document?.expiry
                                ? new Date(document.expiry)
                                : null;
                              const today = new Date();
                              const diffTime = expiryDate
                                ? expiryDate - today
                                : null;
                              const daysLeft = diffTime
                                ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                : null;

                              const { backgroundColor, textColor, icon } =
                                getStatusStyle(daysLeft);

                              return (
                                <Box
                                  key={item}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 1.5,
                                    borderRadius: 1,
                                    mb: 1,
                                    backgroundColor,
                                    color: textColor,
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    {icon}
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: "medium" }}
                                    >
                                      <strong>{item}:</strong>
                                    </Typography>
                                  </Stack>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography variant="body2">
                                      {document.expiry
                                        ? new Date(
                                            document.expiry
                                          ).toLocaleDateString()
                                        : "Not set"}
                                    </Typography>
                                    {daysLeft !== null && (
                                      <Typography variant="caption">
                                        {daysLeft < 0
                                          ? "Expired"
                                          : daysLeft === 0
                                          ? "Expires today"
                                          : `${daysLeft} days left`}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              );
                            } else {
                              // If document is missing, display as missing
                              return (
                                <Box
                                  key={item}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 1.5,
                                    borderRadius: 1,
                                    mb: 1,
                                    backgroundColor: "lightgray",
                                    color: "red",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: "medium" }}
                                  >
                                    <strong>{item}:</strong> Missing
                                  </Typography>
                                </Box>
                              );
                            }
                          })}
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {selectedIndexTabs === 1 && (
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
                      paymentList?.map((row, index) => (
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

            {selectedIndexTabs === 2 && <RescheduleJobs />}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
