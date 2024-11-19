"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { vehciles } from "@/networkUtil/Constants";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllQuotes(id);
    }
  }, [id]);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${vehciles}/${id}`);
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  // Calculate total amount
  const totalAmount =
    invoiceList?.vehicle_expenses?.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0), // Ensure it's treated as a number
      0
    ) || 0;

  if (loadingDetails || fetchingData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <Card elevation={3}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Vehicle Details
              </Typography>
              <Typography color="text.secondary">
                Assign To: {invoiceList?.user?.name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "start", sm: "end" },
              }}
            >
              <Typography variant="h6" gutterBottom>
                {invoiceList?.vehicle_number}
              </Typography>
              <Chip
                label={invoiceList?.condition}
                color={invoiceList?.condition === "Good" ? "success" : "error"}
                size="small"
              />
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead style={{ backgroundColor: "#32A92E" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="subtitle2">Date</Typography>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="subtitle2">Maintenance</Typography>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="subtitle2">Oil Amount</Typography>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="subtitle2">Fuel Amount</Typography>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="subtitle2">
                      Oil Change Limit
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="subtitle2">Total</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceList?.vehicle_expenses?.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    hover
                  >
                    <TableCell>
                      {new Date(item.updated_at).toLocaleString("en-US", {
                        month: "long",
                        weekday: "long",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {item.maintenance_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{item.oil_amount.toLocaleString()}</TableCell>
                    <TableCell>{item.fuel_amount.toLocaleString()}</TableCell>
                    <TableCell>{item.oil_change_limit} km</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {item.total_amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Display total amount */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "right",
              width: "100%",
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              Total: {totalAmount.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Page;
