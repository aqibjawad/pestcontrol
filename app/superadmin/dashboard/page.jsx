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

import { Car, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Finance = dynamic(() => import("../dashboard/components/Finance"));
const Schedule = dynamic(() => import("./components/Schedule"));

import RescheduleJobs from "../../rescheduleJobs/reschedule";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl, payments, vehciles } from "@/networkUtil/Constants";
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

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import { getDocumentsByProfession } from "../../../Helper/documents";

import { useRouter } from "next/navigation";

const Page = () => {
  const [tabNames, setTabNames] = useState([
    "Work management",
    "Finance Management",
    "Reports",
  ]);

  const router = useRouter();

  // Initialize selectedIndex from localStorage if available
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("selectedTabIndex");
      return savedIndex ? parseInt(savedIndex) : 0;
    }
    return 0;
  });

  const [selectedIndexTabs, setSelectedIndexTabs] = useState(0);
  const [paymentList, setPaymentsList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [profession, setProfession] = useState("");
  const [documents, setDocuments] = useState([]);
  const [missingDocs, setMissingDocs] = useState([]);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [vehicleList, setVehicleList] = useState([]);

  // Update localStorage when selectedIndex changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedTabIndex", selectedIndex.toString());

      // Set schedule state in localStorage based on whether Schedule tab is selected
      const isScheduleTab = selectedIndex === 2;
      localStorage.setItem("isScheduleTab", isScheduleTab.toString());
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (profession) {
      const docs = getDocumentsByProfession(profession);
      setDocuments(docs);
    }
  }, [profession]);

  useEffect(() => {
    if (profession) {
      const docs = getDocumentsByProfession(profession);
      setRequiredDocs(docs);

      const missing = docs.filter(
        (doc) =>
          !employeeList?.employee?.documents?.some(
            (empDoc) => empDoc.name === doc
          )
      );
      setMissingDocs(missing);
    }
  }, [profession, employeeList]);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    router.push(`/hr/employeeDetails?id=${employee.id}`);
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

      const sortedEmployees = response.data.sort((a, b) => {
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

        const earliestDateA = datesA.length ? Math.min(...datesA) : Infinity;
        const earliestDateB = datesB.length ? Math.min(...datesB) : Infinity;

        return earliestDateA - earliestDateB;
      });

      const professions = response.data
        .map((employee) => employee.employee.profession)
        .filter(
          (profession, index, self) =>
            profession && self.indexOf(profession) === index
        );

      setEmployeeList(sortedEmployees);
      setProfession(professions);
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

  const getAllVehicle = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${vehciles}`);
      setVehicleList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllExpenses();
    getAllPayments();
    getAllVehicle();
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

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // More than 1 month
    if (daysLeft > 30) {
      return {
        backgroundColor: "#f0fdf4", // Light green background
        textColor: "#166534", // Dark green text
        icon: <CheckCircle className="h-5 w-5" color="#16a34a" />,
        message: `${daysLeft} days left`,
      };
    }
    // Less than 1 month but not expired
    else if (daysLeft > 0) {
      return {
        backgroundColor: "#fefce8", // Light yellow background
        textColor: "#854d0e", // Dark yellow text
        icon: <Clock className="h-5 w-5" color="#ca8a04" />,
        message: `${daysLeft} days left`,
      };
    }
    // Expired
    else {
      return {
        backgroundColor: "#fef2f2", // Light red background
        textColor: "#991b1b", // Dark red text
        icon: <AlertCircle className="h-5 w-5" color="#dc2626" />,
        message: "Expired",
      };
    }
  };

  return (
    <div className="w-full">
      {tabs()}

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-12 md:col-span-9">
          <div className={selectedIndex === 0 ? `block` : "hidden"}>
            {selectedIndex === 0 && (
              <>
                <Operations />
                <AllJobs />
                <Quotation />
                <Contracts />
              </>
            )}
          </div>

          <div className={selectedIndex === 1 ? `block` : "hidden"}>
            {selectedIndex === 1 && <Finance />}
          </div>

          {/* <div className={selectedIndex === 2 ? `block` : "hidden"}>
            {/* <Schedule isVisible={selectedIndex === 2} />
            {selectedIndex === 2 && <Schedule />}
          </div> */}

          <div className={selectedIndex === 2 ? `block` : "hidden"}>
            {selectedIndex === 2 && <Reports />}
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
            <Tab label="Vehicles" />
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

                        <Box sx={{ mt: 2 }}>
                          {documents.map((item) => {
                            const document =
                              employeess?.employee?.documents?.find(
                                (doc) => doc.name === item
                              );

                            if (document) {
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
                                    <strong>{item}: </strong> Missing
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
              <Box sx={{ p: 2 }}>
                {vehicleList.map((vehicle) => {
                  const status = getExpiryStatus(vehicle.expiry_date);

                  return (
                    <Card
                      key={vehicle.id}
                      sx={{
                        mb: 2,
                        boxShadow: 1,
                        "&:hover": {
                          boxShadow: 3,
                        },
                        transition: "box-shadow 0.3s",
                      }}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          sx={{ mb: 2 }}
                        >
                          <Avatar sx={{ bgcolor: "#e3f2fd" }}>
                            <DirectionsCarIcon sx={{ color: "#1976d2" }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="div">
                              {vehicle.vehicle_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {vehicle.modal_name}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            backgroundColor: status.backgroundColor,
                            color: status.textColor,
                            mb: 2,
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium" }}
                              >
                                Mulkia Expiry
                              </Typography>
                              {status.icon}
                            </Stack>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography variant="body2">
                                {new Date(
                                  vehicle.expiry_date
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption">
                                {status.message}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
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

            {selectedIndexTabs === 3 && <RescheduleJobs />}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
