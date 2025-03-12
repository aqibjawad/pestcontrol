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

import YearPicker from "../../../components/yearPicker";

import Link from "next/link";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

const YearSale = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Initialize with current year instead of month
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    // Extract only the year from the date
    const year = dates.startDate.slice(0, 4);
    setSelectedYear(year);
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      // Updated API call to pass only the year
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_man/get/${selectedYear}`
      );
      setSalesData(response?.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [selectedYear]);

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
      <div className="pageTitle"> YTD Sales </div>
      <YearPicker onDateChange={handleDateChange} />
      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>ID</TableCell>
              <TableCell style={{ color: "white" }}>Sales Man Name</TableCell>
              <TableCell style={{ color: "white" }}> MTD Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row?.completed_jobs_total}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default YearSale;
