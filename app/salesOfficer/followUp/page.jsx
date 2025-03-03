"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

import DateFilters from "../../../components/generic/DateFilters";

import { format } from "date-fns";

import APICall from "@/networkUtil/APICall";
import { visitFollowUps } from "@/networkUtil/Constants";

const FollowUps = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [allSalesData, setAllSalesData] = useState([]); // Store all data for filtering
  const [fetchingData, setFetchingData] = useState(true);
  const [clients, setClients] = useState([]); // Array of unique clients
  const [selectedClient, setSelectedClient] = useState(""); // Selected client for filtering

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClientChange = (event) => {
    const client = event.target.value;
    setSelectedClient(client);

    // Filter data based on selected client
    if (client === "") {
      // Show all data if "All Clients" is selected
      setSalesData(allSalesData);
    } else {
      // Filter data by selected client
      const filteredData = allSalesData.filter(
        (row) => row?.user_client?.name === client
      );
      setSalesData(filteredData);
    }
  };

  const getAllEmployees = async () => {
    setFetchingData(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`follow_up_start_date=${startDate}`);
      queryParams.push(`follow_up_end_date=${endDate}`); // Fixed typo in parameter name
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`follow_up_start_date=${currentDate}`);
      queryParams.push(`follow_up_end_date=${currentDate}`); // Fixed typo in parameter name
    }
    try {
      const response = await api.getDataWithToken(
        `${visitFollowUps}?${queryParams.join("&")}`
      );

      // Store all data
      setAllSalesData(response?.data);
      setSalesData(response?.data);

      // Extract unique clients from the data
      const uniqueClients = Array.from(
        new Set(
          response?.data
            .filter((item) => item?.user_client?.name)
            .map((item) => item?.user_client?.name)
        )
      );
      setClients(uniqueClients);

      // Reset selected client when data is refreshed
      setSelectedClient("");
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [startDate, endDate]);

  // Skeleton loader rows
  const renderSkeletonRows = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" width={80} />
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <div style={{marginTop:"5rem"}}>
      <div className="flex flex-row items-center justify-between mt-4 mb-4">
        <div className="pageTitle">Follow Up Details</div>

        <div className="flex flex-row items-center gap-4">
          <div className="font-medium">Filters:</div>
          {/* Date Filter Container */}
          <div
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
              alt="filter"
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>

          {/* Client Filter Dropdown */}
          <Box sx={{ minWidth: 180 }}>
            <FormControl
              fullWidth
              size="small"
              sx={{ border: "1px solid #38A73B", borderRadius: "8px" }}
            >
              <InputLabel id="client-filter-label">Client</InputLabel>
              <Select
                labelId="client-filter-label"
                id="client-filter"
                value={selectedClient}
                label="Client"
                onChange={handleClientChange}
                sx={{ height: "40px" }}
              >
                <MenuItem value="">All Clients</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client} value={client}>
                    {client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>

      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Sr No</TableCell>
              <TableCell style={{ color: "white" }}>Client</TableCell>
              <TableCell style={{ color: "white" }}>Follow Up Date</TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
              <TableCell style={{ color: "white" }}> Description </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.user_client?.name}</TableCell>
                    <TableCell>
                      {row?.follow_up_date
                        ? new Date(row.follow_up_date).toLocaleDateString(
                            "en-GB"
                          ) // Output: 01/05/2025
                        : "N/A"}
                    </TableCell>
                    <TableCell>{row?.status}</TableCell>
                    <TableCell>{row?.description}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FollowUps;
