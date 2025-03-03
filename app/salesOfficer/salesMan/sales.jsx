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

import MonthPicker from "../../hr/monthPicker";

import Link from "next/link";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

const Sales = () => {
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
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_man/get/${selectedMonth}`
      );
      // const response = await api.getDataWithToken(
      //   `${getAllEmpoyesUrl}/sales_man/get`
      // );
      setSalesData(response?.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [selectedMonth]);

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
      <div className="pageTitle">Sales Man Target</div>
      <MonthPicker onDateChange={handleDateChange} />
      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>ID</TableCell>
              <TableCell style={{ color: "white" }}>Salesman Name</TableCell>
              <TableCell style={{ color: "white" }}>Base Target</TableCell>
              <TableCell style={{ color: "white" }}>Remaining Target</TableCell>
              <TableCell style={{ color: "white" }}>Achieved Target</TableCell>
              <TableCell style={{ color: "white" }}> Target % </TableCell>
              <TableCell style={{ color: "white" }}>View Visits</TableCell>
              <TableCell style={{ color: "white" }}>View Jobs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row?.emp_contract_targets[0]?.base_target}
                    </TableCell>
                    <TableCell>
                      {row?.emp_contract_targets[0]?.achieved_target}
                    </TableCell>
                    <TableCell>
                      {row?.emp_contract_targets?.[0]?.achieved_target &&
                      row?.emp_contract_targets?.[0]?.base_target
                        ? (
                            (row.emp_contract_targets[0].achieved_target /
                              row.emp_contract_targets[0].base_target) *
                            100
                          ).toFixed(2)
                        : "0"}
                    </TableCell>

                    <TableCell>
                      {row?.emp_contract_targets[0]?.remaining_target}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/salesOfficer/viewVisits?id=${
                          row?.id
                        }&name=${encodeURIComponent(row?.name)}`}
                      >
                        View Visits
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/salesOfficer/viewJobs?id=${row?.id}`}>
                        View Jobs
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sales;
