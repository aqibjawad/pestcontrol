"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Modal, Box, Button, Skeleton, Menu, MenuItem } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import styles from "../../../styles/salaryModal.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import withAuth from "@/utils/withAuth";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import the three-dots icon

import { useRouter } from "next/navigation";
import MonthPicker from "../monthPicker";
import Link from "next/link";

import "./index.css";
import { MoreVertical } from "lucide-react";

const SalaryCal = () => {
  const api = new APICall();

  const [refreshComponent, setRefreshComponent] = useState(false);

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [employeeCompany, setEmployeeCompany] = useState([]);

  const [filteredEmployees, setFilteredEmployees] = useState({
    advancePayments: [],
    vehicleFines: []
  });

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };
  const [allEmployees, setAllEmployees] = useState();

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get?salary_month=${selectedMonth}`
      );
      if (response?.data) {
        // Filter to only include employees who have advance payments
        const employeesWithAdvance = response.data.filter(
          (employee) =>
            employee.employee_advance_payment &&
            employee.employee_advance_payment.length > 0
        );

        setEmployeeList(employeesWithAdvance);
        setAllEmployees(response.data); // Keep the original full list if needed
        setEmployeeCompany(response.data.captain_jobs || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleEmployeeNameChange = (value) => {
    if (value === "") {
      setEmployeeList(allEmployees);
    } else {
      const filteredList = allEmployees.filter((employee) =>
        employee.user?.name.toLowerCase().includes(value.toLowerCase())
      );
      setEmployeeList(filteredList);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [selectedMonth]);

  useEffect(() => {
    getAllEmployees();
  }, [refreshComponent]);

  return (
    <div>
      <div className="mt-10 mb-10">
        <div className="pageTitle"> Employee Advance</div>
        <div className="mt-5"></div>
        <MonthPicker onDateChange={handleDateChange} />
        <div className="mt-5"></div>
        <div className={tableStyles.tableContainer}>
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "500px",
            }}
          >
            {/* Fixed Header Table */}
            <table
              className="min-w-full bg-white"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    className="py-5 px-4 border-b border-gray-200 text-left"
                  >
                    Sr.
                  </th>
                  <th
                    style={{ width: "20%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    <InputWithTitle
                      title={"Employee Name"}
                      placeholder="Filter by Name"
                      onChange={(value) => {
                        handleEmployeeNameChange(value);
                      }}
                    />
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Advance Balance
                  </th>
                </tr>
              </thead>
            </table>

            {/* Scrollable Body Table */}
            <div style={{ overflowY: "auto", maxHeight: "500px" }}>
              <table
                className="min-w-full bg-white"
                style={{ tableLayout: "fixed" }}
              >
                <tbody>
                  {fetchingData
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "20%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                        </tr>
                      ))
                    : employeeList.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            {index + 1}
                          </td>
                          <td style={{ width: "20%" }} className="py-5 px-4">
                            {row?.user?.name}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row?.user?.employee?.current_adv_balance}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SalaryCal);
