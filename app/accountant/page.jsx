"use client";

import React, { useState, useEffect } from "react";
import All from "./all/all";
// import Transactions from "./viewTransactions/transactions";
import Invoices from "../invoice/invoices";
import Vehicles from "../account/viewVehicles/vehciles";
import Pending from "./payments/pending";
import CommissionCal from "../hr/comCal/page";
import TotalRecieves from "./totalRecieves/recieves";
import TotalPayments from "./totalPayments/totalPayments";

import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import { Cheques, Agreements } from "@/networkUtil/Constants"; // Added Agreements import
import APICall from "@/networkUtil/APICall";

import PaymentsTotal from "./totalPayments";
import Agreement from "./agreements";

import { startOfMonth, endOfMonth, format } from "date-fns";
import dayjs from "dayjs";
const Page = () => {
  const api = new APICall();

  const [selectedIndexTabs, setSelectedIndexTabs] = useState(0);

  const [advanceList, setAdvanceList] = useState([]);
  const [payableList, setPayableList] = useState([]);
  const [agreementsList, setAgreementsList] = useState([]); // Added state for agreements
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const getAllCheques = async () => {
    setFetchingData(true);
    setLoadingDetails(true);

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = new Date();
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      queryParams.push(`start_date=${format(startDate, "yyyy-MM-dd")}`);
      queryParams.push(`end_date=${format(endDate, "yyyy-MM-dd")}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${Cheques}/receive/pending?${queryParams.join("&")}`
      );

      // Sort the cheques by date - closer dates first
      const sortedCheques = [...response.data].sort((a, b) => {
        const dateA = dayjs(a.cheque_date);
        const dateB = dayjs(b.cheque_date);
        const currentDate = dayjs();

        // Calculate absolute difference from current date
        const diffA = Math.abs(dateA.diff(currentDate, "day"));
        const diffB = Math.abs(dateB.diff(currentDate, "day"));

        // Return smaller difference first (closer to current date)
        return diffA - diffB;
      });

      setAdvanceList(sortedCheques);
    } catch (error) {
      console.error("Error fetching cheques:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

    const getAllPayableCheques = async () => {
    setFetchingData(true);
    setLoadingDetails(true);

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = new Date();
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      queryParams.push(`start_date=${format(startDate, "yyyy-MM-dd")}`);
      queryParams.push(`end_date=${format(endDate, "yyyy-MM-dd")}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${Cheques}/pay/pending?${queryParams.join("&")}`
      );
      setPayableList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  // New function to get renewable agreements
  const getRenewableAgreements = async () => {
    setFetchingData(true);
    
    try {
      const response = await api.getDataWithToken(`${Agreements}/renewable`);
      setAgreementsList(response.data || []);
    } catch (error) {
      console.error("Error fetching renewable agreements:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllCheques();
    getAllPayableCheques();
    getRenewableAgreements(); // Fetch agreements when component mounts
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleTabChange = (event, newIndex) => {
    setSelectedIndexTabs(newIndex);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {/* Left Grid Section - Now wider (3 columns instead of 2) */}
      <div className="col-span-3 space-y-4">
        <All />
        {/* <Transactions /> */}
        <TotalRecieves />
        <TotalPayments />
        <Pending />

        {/* <Invoices />
        <CommissionCal />
        <Vehicles /> */}
      </div>

      {/* Right Grid Section (Tabs) - Now narrower (1 column out of 4 instead of 1 out of 3) */}
      <div className="col-span-1 p-2 border rounded-lg bg-gray-100">
        {/* Tabs Section */}
        <Tabs
          value={selectedIndexTabs}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Main tabs"
        >
          <Tab label="Advance Recieveable" />
          <Tab label="Payable Cheques" />
          <Tab label="Renewable Agreements" />
        </Tabs>

        {/* Tab Panels */}
        <Box className="mt-3">
          {selectedIndexTabs === 0 && (
            <Box>
              {advanceList?.map((vehicle) => {
                const chequeDate = dayjs(vehicle.cheque_date);
                const currentDate = dayjs();
                const oneMonthLater = currentDate.add(1, "month");

                let bgColor = "#FFE4B5"; // Default (Yellow)
                let statusText = vehicle.status;

                if (chequeDate.isBefore(currentDate, "day")) {
                  bgColor = "#FFEBEE"; // Expired (Red)
                  statusText = "Expired";
                } else if (chequeDate.isAfter(oneMonthLater, "day")) {
                  bgColor = "#90EE90"; // More than one month ahead (Green)
                  statusText = "Valid";
                }

                return (
                  <Card
                    key={vehicle.id}
                    sx={{
                      boxShadow: 1,
                      "&:hover": { boxShadow: 3 },
                      transition: "box-shadow 0.3s",
                      marginTop: "1rem",
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: bgColor,
                          color: "black",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={3}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Amount
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {vehicle.cheque_amount}
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Date
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.cheque_date}
                            </Typography>
                          </Grid>

                          <Grid item xs={5}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Bank Name
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {vehicle?.bank?.bank_name}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid
                          className="mt-2"
                          container
                          spacing={2}
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Client Name
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {vehicle?.user?.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}

          {selectedIndexTabs === 1 && (
            <Box sx={{ p: 2 }}>
              <PaymentsTotal payableList={payableList} />
            </Box>
          )}

          {selectedIndexTabs === 2 && (
            <Box sx={{ p: 2 }}>
              {/* Either pass the data to the Agreement component */}
              <Agreement data={agreementsList} />
              
              {/* Or if the Agreement component doesn't accept data prop, render agreements here */}
              {!agreementsList || agreementsList.length === 0 ? (
                ""
              ) : (
                agreementsList.map((agreement) => (
                  <Card
                    key={agreement.id}
                    sx={{
                      boxShadow: 1,
                      "&:hover": { boxShadow: 3 },
                      transition: "box-shadow 0.3s",
                      marginTop: "1rem",
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: "#E3F2FD", // Light blue for agreements
                          color: "black",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Agreement ID
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {agreement.id || agreement.agreement_id}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Renewal Date
                            </Typography>
                            <Typography variant="body2">
                              {agreement.renewal_date || agreement.expiry_date}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid
                          className="mt-2"
                          container
                          spacing={2}
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Client Name
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {agreement?.client?.name || agreement?.user?.name || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Page;