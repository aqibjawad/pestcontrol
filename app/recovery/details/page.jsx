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
} from "@mui/material";
import { serviceInvoice } from "../../../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${serviceInvoice}/assign_invoice/states`
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
            {vendorsData?.map((row, index) => {
              const lastHistory =
                row.assigned_histories?.[row?.assigned_histories?.length - 1];
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
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6">
                {summary?.totalAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Paid Amount
              </Typography>
              <Typography variant="h6">
                {summary?.paidAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Invoices
              </Typography>
              <Typography variant="h6">{summary?.totalInvoices}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Paid Invoices
              </Typography>
              <Typography variant="h6">{summary?.paidInvoices}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Promise Invoices
              </Typography>
              <Typography variant="h6">{summary?.promiseInvoices}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Other Invoices
              </Typography>
              <Typography variant="h6">{summary?.otherInvoices}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Page;
