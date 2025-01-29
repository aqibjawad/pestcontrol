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
import { serviceInvoice } from "../../../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import DateFilters2 from "@/components/generic/DateFilters2";

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
    } else {
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

  // Calculate summary statistics
  const summary = vendorsData?.reduce(
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

  return (
    <Box sx={{ p: 3 }}>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        {/* Parent Flex Container */}
        <div className="flex justify-between items-center mb-6">
          {/* Heading */}
          <div
            style={{
              fontSize: "20px",
              fontFamily: "semibold",
              marginBottom: "1rem",
            }}
          >
            All Recoveries
          </div>

          {/* Date Filter */}
          <div className="bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg">
            <DateFilters2 onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
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
                  </TableRow>
                ))
              : vendorsData?.map((row, index) => {
                  const lastHistory =
                    row.assigned_histories?.[
                      row?.assigned_histories?.length - 1
                    ];
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.user?.name}</TableCell>
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
    </Box>
  );
};

export default Page;
