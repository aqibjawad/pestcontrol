"use client";

import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress,
  Skeleton,
  TextField,
} from "@mui/material";
import withAuth from "@/utils/withAuth";
import MonthPicker from "../monthPicker";

const SalaryCal = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };

  const getEmployeeCommissions = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/commission/get?commission_month=${selectedMonth}`
      );
      setEmployeeList(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch employee data",
      });
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getEmployeeCommissions(selectedMonth);
  }, [selectedMonth]);

  const handleAdvePay = async (employeeId) => {
    setLoadingSubmit(true);
    const obj = { employee_commission_id: employeeId };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/commission/paid`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment has been processed successfully!",
        }).then(() => {
          getEmployeeCommissions(selectedMonth);
        });
      } else {
        throw new Error(response.error?.message || "Failed to process payment");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unexpected error occurred",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = employeeList.filter((employee) =>
        employee?.referencable?.name?.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employeeList); 
    }
  };

  return (
    <div className="mt-10 mb-10">
      <div className="pageTitle">Sales By Employees</div>
      <div className="mt-5"></div>
      <MonthPicker onDateChange={handleDateChange} />

      <TableContainer
        component={Paper}
        style={{ maxHeight: "500px", overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Sr.</TableCell>
              <TableCell align="center">
                {/* Employee Name Header with Search */}
                <div>
                  <div>Employee Name</div>
                  <TextField
                    placeholder="Search"
                    size="small"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    fullWidth
                  />
                </div>
              </TableCell>
              <TableCell align="center">Commission %</TableCell>
              <TableCell align="center">Target Achieved %</TableCell>
              <TableCell align="center">Sale</TableCell>
              <TableCell align="center">Target</TableCell>
              <TableCell align="center">Commission Amount</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : filteredEmployees.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      {row?.referencable?.name}
                    </TableCell>
                    <TableCell align="center">{row.commission_per}%</TableCell>
                    <TableCell align="center">
                      {row.target > 0 && row.sale
                        ? ((row.sale / row.target) * 100).toFixed(2)
                        : 0}
                      %
                    </TableCell>
                    <TableCell align="center">{row.sale}</TableCell>
                    <TableCell align="center">{row.target}</TableCell>
                    <TableCell align="center">{row?.paid_amt}</TableCell>
                    <TableCell align="center">{row?.status}</TableCell>
                    <TableCell align="center">
                      {row.paid_amt > 0 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAdvePay(row.id)}
                          disabled={loadingSubmit || row.status === "paid"}
                        >
                          {loadingSubmit ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Pay"
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default withAuth(SalaryCal);
