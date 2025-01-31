"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import {
  serviceInvoice,
  getAllEmpoyesUrl,
} from "../../../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import DateFilters2 from "@/components/generic/DateFilters2";
import Dropdown from "@/components/generic/Dropdown";

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [salesManagers, setSalesManagers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [allRecoveryList, setAllRecoveryList] = useState([]);
  const [selectedRecoveryId, setSelectedRecoveryId] = useState("");

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    fetchVendors();
  }, [startDate, endDate]);

  const fetchVendors = async () => {
    setFetchingData(true);
    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_promise_date=${startDate}`);
      queryParams.push(`end_promise_date=${endDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${serviceInvoice}/assign_invoice/states?${queryParams.join("&")}`
      );
      setVendorsData(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
    setFetchingData(false);
  };

  const getAllSalesManagers = async () => {
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/recovery_officer/get`
      );
      setAllRecoveryList(response.data);

      // Store the full data in a separate state for reference
      const formattedManagersWithIds = response.data.map((officer) => ({
        name: officer.name,
        id: officer.id,
      }));
      setAllRecoveryList(formattedManagersWithIds);

      // Only names for the dropdown
      const managerNames = response.data.map((officer) => officer.name);
      setSalesManagers(managerNames);
    } catch (error) {
      console.error("Error fetching sales managers:", error);
    }
  };

  const handleOfficerChange = (name, index) => {
    // Get the ID from allRecoveryList using the index
    const idAtIndex = allRecoveryList[index]?.id;
    setSelectedRecoveryId(idAtIndex);
  };
  useEffect(() => {
    getAllSalesManagers();
  }, []);

  const getFilteredData = () => {
    if (!selectedRecoveryId) return vendorsData;

    return vendorsData?.filter((row) => {
      const lastHistory =
        row.assigned_histories?.[row.assigned_histories?.length - 1];
      return lastHistory?.employee_user?.id === selectedRecoveryId;
    });
  };

  // Calculate summary statistics
  const getSummary = () => {
    const dataToUse = getFilteredData(); // Use filtered data instead of vendorsData directly

    return dataToUse?.reduce(
      (acc, row) => {
        acc.totalAmount += parseFloat(row.total_amt || 0);
        acc.paidAmount += parseFloat(row.paid_amt || 0);
        acc.totalInvoices += 1;
        if (row.status === "paid") acc.paidInvoices += 1;

        const lastHistory =
          row.assigned_histories?.[row.assigned_histories.length - 1];
        if (lastHistory?.promise_date) acc.promiseInvoices += 1;
        if (lastHistory?.other) acc.otherInvoices += 1;

        return acc;
      },
      {
        totalAmount: 0,
        paidAmount: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        promiseInvoices: 0,
        otherInvoices: 0,
      }
    );
  };

  // Then in your JSX, use getSummary() instead of summary directly:
  const summary = getSummary();

  return (
    <Box sx={{ p: 3 }}>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div className="flex justify-between items-center mb-6">
          <div
            style={{
              fontSize: "20px",
              fontFamily: "semibold",
              marginBottom: "1rem",
            }}
          >
            All Recoveries
          </div>

          <div style={{ width: "200px" }}>
            <Dropdown
              value={selectedOfficer}
              onChange={handleOfficerChange}
              title="Recovery Officers"
              options={salesManagers}
              className="w-full"
            />
          </div>

          <div className="bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg">
            <DateFilters2 onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={3}>
            {fetchingData
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Skeleton variant="text" width={120} />
                    </Typography>
                    <Typography variant="h6">
                      <Skeleton variant="text" width={80} />
                    </Typography>
                  </Grid>
                ))
              : [
                  {
                    label: "Total Amount",
                    value: summary?.totalAmount.toFixed(2),
                  },
                  {
                    label: "Paid Amount",
                    value: summary?.paidAmount.toFixed(2),
                  },
                  {
                    label: "Total Invoices",
                    value: summary?.totalInvoices,
                  },
                  {
                    label: "Paid Invoices",
                    value: summary?.paidInvoices,
                  },
                  {
                    label: "Promise Invoices",
                    value: summary?.promiseInvoices,
                  },
                  {
                    label: "Other Invoices",
                    value: summary?.otherInvoices,
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6">{item.value}</Typography>
                  </Grid>
                ))}
          </Grid>
        </CardContent>
      </Card>

      <TableContainer className="mt-5" component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Firm Name</TableCell>
              <TableCell>Recovery Officer Name</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Promise</TableCell>
              <TableCell>Other</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={30} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={70} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={70} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={50} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={50} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={50} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={50} />
                    </TableCell>
                  </TableRow>
                ))
              : getFilteredData()?.map((row, index) => {
                  const lastHistory =
                    row.assigned_histories?.[
                      row?.assigned_histories?.length - 1
                    ];
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.user?.name}</TableCell>
                      <TableCell>
                        {lastHistory?.employee_user?.name || "-"}
                      </TableCell>
                      <TableCell>{row?.paid_amt}</TableCell>
                      <TableCell>{row?.total_amt}</TableCell>
                      <TableCell>{row?.status}</TableCell>
                      <TableCell>{lastHistory?.promise_date || "-"}</TableCell>
                      <TableCell>{lastHistory?.other || "-"}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Page;
