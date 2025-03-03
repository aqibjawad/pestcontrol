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
} from "@mui/material";

import APICall from "@/networkUtil/APICall";
import { stock } from "@/networkUtil/Constants";

const Page = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${stock}`);

      // Process data to merge by product_id
      const mergedData = mergeProductData(response?.data);
      console.log("Merged Data:", mergedData);

      setSalesData(mergedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // Function to merge data by product_id
  const mergeProductData = (data) => {
    if (!data || !Array.isArray(data)) return [];

    const productMap = new Map();

    // Group data by product_id
    data.forEach((item) => {
      const productId = item.product_id;

      if (!productMap.has(productId)) {
        // First time seeing this product, add it to the map
        productMap.set(productId, {
          product_id: productId,
          total_remaining: parseFloat(item.total_remaining),
          total_quantity: parseFloat(item.total_quantity),
          person_ids: [item.person_id], // Track which persons have this product
          product: item.product,
        });
      } else {
        // Product already exists, update quantities
        const existingItem = productMap.get(productId);
        existingItem.total_remaining += parseFloat(item.total_remaining);
        existingItem.total_quantity += parseFloat(item.total_quantity);
        existingItem.person_ids.push(item.person_id);
      }
    });

    // Convert map back to array
    return Array.from(productMap.values());
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

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
    <div>
      <div className="pageTitle">Stock Report</div>
      {/* <MonthPicker onDateChange={handleDateChange} /> */}
      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Sr No</TableCell>
              <TableCell style={{ color: "white" }}>Product Name</TableCell>
              <TableCell style={{ color: "white" }}>Product Type</TableCell>
              <TableCell style={{ color: "white" }}>Total Quantity</TableCell>
              <TableCell style={{ color: "white" }}>Total Remaining</TableCell>
              <TableCell style={{ color: "white" }}>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.product?.product_name}</TableCell>
                    <TableCell>{row.product?.product_type}</TableCell>
                    <TableCell>{row.total_quantity}</TableCell>
                    <TableCell>{row.total_remaining}</TableCell>
                    <TableCell>{row.product?.unit}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
