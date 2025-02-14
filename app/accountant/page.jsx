"use client";

import React, { useState, useEffect } from "react";
import All from "./all/all";
import Transactions from "./viewTransactions/transactions";
import Invoices from "../invoice/invoices";
import Vehicles from "../account/viewVehicles/vehciles";
import Pending from "./payments/pending";
import CommissionCal from "../hr/comCal/page";

import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
} from "@mui/material";

import { Cheques } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import { startOfMonth, endOfMonth, format } from "date-fns";
import dayjs from "dayjs";
const Page = () => {
  const api = new APICall();

  const [selectedIndexTabs, setSelectedIndexTabs] = useState(0);

  const [advanceList, setAdvanceList] = useState([]);
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
        `${Cheques}/pending?${queryParams.join("&")}`
      );

      setAdvanceList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    getAllCheques();
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleTabChange = (event, newIndex) => {
    setSelectedIndexTabs(newIndex);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Left Grid Section */}
      <div className="col-span-2 space-y-4">
        <All />
        <Pending />
        <Transactions />
        <Invoices />
        <CommissionCal />
        <Vehicles />
      </div>

      {/* Right Grid Section (Tabs) */}
      <div className="col-span-1 p-2 border rounded-lg bg-gray-100">
        {/* Tabs Section */}
        <Tabs
          value={selectedIndexTabs}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Main tabs"
        >
          <Tab label="Advance Recieveable" />
          <Tab label="Advance Payments" />
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
                  bgColor = "#FF6347"; // Expired (Red)
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
                      marginTop:"1rem"
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: bgColor,
                          color: "black",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              Amount
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium", textAlign: "center" }}
                            >
                              {vehicle.cheque_amount}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium", textAlign: "center" }}
                            >
                              Date
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.cheque_date}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium", textAlign: "center" }}
                            >
                              Bank Name
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium", textAlign: "center" }}
                            >
                              {vehicle?.bank?.bank_name}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium", textAlign: "center" }}
                            >
                              Client Name
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium", textAlign: "center" }}
                            >
                              {vehicle?.user?.name}
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

          {selectedIndexTabs === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Remaining Content</Typography>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Page;
