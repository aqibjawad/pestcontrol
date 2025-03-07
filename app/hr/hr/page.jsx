"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/tabs.module.css";
import dynamic from "next/dynamic";
import withAuth from "@/utils/withAuth";

import {
  Tabs,
  Tab,
  Box,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";

import Agreement from "../../accountant/agreements";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

import { getDocumentsByProfession } from "../../../Helper/documents";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useRouter } from "next/navigation";
import APICall from "@/networkUtil/APICall";

const AllEmployees = dynamic(
  () => import("@/app/operations/viewEmployees/allEmployees"),
  { ssr: false }
);
const SalarCal = dynamic(() => import("../salaryCal/page"), { ssr: false });
const CommissionCal = dynamic(() => import("../comCal/page"), { ssr: false });
const SalaryTotal = dynamic(() => import("../salaryTotal/page"), {
  ssr: false,
});
const Ledger = dynamic(() => import("../employeeLedger/ledger"), {
  ssr: false,
});
const EmpLeaves = dynamic(() => import("../empLeaves/empLeaves"), {
  ssr: false,
});

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
      {value === index && <div className="py-3">{children}</div>}
    </div>
  );
};

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [profession, setProfession] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [requiredDocs, setRequiredDocs] = useState([]);
  const [missingDocs, setMissingDocs] = useState([]);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    router.push(`/hr/employeeDetails?id=${employee.id}`);
  };

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const [selectedIndexTabs, setSelectedIndexTabs] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setSelectedIndexTabs(newIndex);
  };

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

  useEffect(() => {
    getAllExpenses();
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

  const getDocumentsByProfession = (profession) => {
    return ["Passport", "EID", "Labour Card", "Health Insurance", "Visa"];
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={9}>
        <div>
          <div className="mt-5">
            <div className={styles.tabContainer}>
              <div
                className={`${styles.tabPaymentButton} ${
                  activeTab === 0 ? styles.active : ""
                }`}
                onClick={() => handleTabClick(0)}
              >
                All Employees
              </div>
              <div
                className={`${styles.tabPaymentButton} ${
                  activeTab === 1 ? styles.active : ""
                }`}
                onClick={() => handleTabClick(1)}
              >
                Salary Calculation
              </div>
              <div
                className={`${styles.tabPaymentButton} ${
                  activeTab === 2 ? styles.active : ""
                }`}
                onClick={() => handleTabClick(2)}
              >
                Commission Calculation
              </div>
              <div
                className={`${styles.tabPaymentButton} ${
                  activeTab === 3 ? styles.active : ""
                }`}
                onClick={() => handleTabClick(3)}
              >
                Total Salary
              </div>
              <div
                className={`${styles.tabPaymentButton} ${
                  activeTab === 4 ? styles.active : ""
                }`}
                onClick={() => handleTabClick(4)}
              >
                Employee Ledger
              </div>
              <div
                className={`${styles.tabPaymentButton} ${
                  activeTab === 5 ? styles.active : ""
                }`}
                onClick={() => handleTabClick(5)}
              >
                Employee Leaves
              </div>
            </div>
          </div>

          <TabPanel value={activeTab} index={0}>
            <AllEmployees />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <SalarCal />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <CommissionCal />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <SalaryTotal />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Ledger />
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <EmpLeaves />
          </TabPanel>
        </div>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Tabs
          value={selectedIndexTabs}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Main tabs"
        >
          <Tab label="Employee Documents" />
          <Tab label="Agreements" />
        </Tabs>

        <Box className="mt-3">
          {selectedIndexTabs === 0 && (
            <Box>
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
            </Box>
          )}

          {selectedIndexTabs === 1 && (
            <Box sx={{ p: 2 }}>
              <Agreement />
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default withAuth(Page);
