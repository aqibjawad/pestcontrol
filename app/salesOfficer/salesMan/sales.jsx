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
} from "@mui/material";

import MonthPicker from "../../hr/monthPicker";

import Link from "next/link";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

const Sales = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      //   const response = await api.getDataWithToken(
      //     `${getAllEmpoyesUrl}/salary/get?salary_month=${selectedMonth}`
      //   );
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_man/get`
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
  }, []);

  return (
    <div>
      <div className="pageTitle">Sales Man Target</div>
      {/* <MonthPicker onDateChange={handleDateChange} /> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Salesman Name</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Achieved Target</TableCell>
              <TableCell>Remaining Target</TableCell>
              <TableCell>View Visits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((row, index) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sales;
