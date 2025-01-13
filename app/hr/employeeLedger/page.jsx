"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Skeleton } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import withAuth from "@/utils/withAuth";
import MonthPicker from "../monthPicker";
import Link from "next/link";
import "./index.css";

const SalaryCal = () => {
  const api = new APICall();
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [allEmployees, setAllEmployees] = useState();

  // Separate state for vehicle fines
  const [vehicleFines, setVehicleFines] = useState([]);
  const [filteredVehicleFines, setFilteredVehicleFines] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get?salary_month=${selectedMonth}`
      );
      if (response?.data) {
        // Handle advance payments (keeping original logic)
        const employeesWithAdvance = response.data.filter(
          (employee) =>
            employee.employee_advance_payment &&
            employee.employee_advance_payment.length > 0
        );

        setEmployeeList(employeesWithAdvance);
        setAllEmployees(response.data);
        setEmployeeCompany(response.data.captain_jobs || []);

        // Extract and handle vehicle fines separately
        const allFines = [];
        response.data.forEach((employee) => {
          if (employee.vehicle_fines && employee.vehicle_fines.length > 0) {
            allFines.push(
              ...employee.vehicle_fines.map((fine) => ({
                ...fine,
                employeeName: employee.user?.name,
                employeeId: employee.user?.id,
              }))
            );
          }
        });
        setVehicleFines(allFines);
        setFilteredVehicleFines(allFines);
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

  const handleFinesNameFilter = (value) => {
    if (value === "") {
      setFilteredVehicleFines(vehicleFines);
    } else {
      const filtered = vehicleFines.filter((fine) =>
        fine.employeeName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVehicleFines(filtered);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [selectedMonth, refreshComponent]);

  return (
    <div>
      <div className="mt-10 mb-10">
        <div className="pageTitle">Employee Financial Records</div>
        <div className="mt-5"></div>
        <MonthPicker onDateChange={handleDateChange} />

        {/* Original Advance Payments Table */}
        <div className="mt-5">
          <h2 className="text-xl font-bold mb-4">Advance Payments</h2>
          <div className={tableStyles.tableContainer}>
            <div
              style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                maxHeight: "500px",
              }}
            >
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
                      style={{ width: "5%" }}
                      className="py-5 px-4 border-b border-gray-200 text-left"
                    >
                      Employee Id.
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
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      View Details
                    </th>
                  </tr>
                </thead>
              </table>

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
                            <td style={{ width: "5%" }} className="py-5 px-4">
                              {row?.user?.employee?.id}
                            </td>
                            <td style={{ width: "20%" }} className="py-5 px-4">
                              {row?.user?.name}
                            </td>
                            <td style={{ width: "10%" }} className="py-5 px-4">
                              {row?.user?.employee?.current_adv_balance}
                            </td>
                            <td style={{ width: "10%" }} className="py-5 px-4">
                              <Link
                                href={`/hr/singleEmployeeLedger?id=${row?.user?.id}&month=${row?.month}`}
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Separate Vehicle Fines Table */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Vehicle Fines</h2>
          <div className={tableStyles.tableContainer}>
            <div
              style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                maxHeight: "500px",
              }}
            >
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
                        onChange={handleFinesNameFilter}
                      />
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Fine Amount
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Fine Date
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
              </table>

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
                            <td style={{ width: "15%" }} className="py-5 px-4">
                              <Skeleton variant="rectangular" height={30} />
                            </td>
                          </tr>
                        ))
                      : filteredVehicleFines.map((fine, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td style={{ width: "5%" }} className="py-5 px-4">
                              {index + 1}
                            </td>
                            <td style={{ width: "20%" }} className="py-5 px-4">
                              {fine.employeeName}
                            </td>
                            <td style={{ width: "10%" }} className="py-5 px-4">
                              {fine.fine}
                            </td>
                            <td style={{ width: "15%" }} className="py-5 px-4">
                              {fine.fine_date}
                            </td>
                            <td style={{ width: "10%" }} className="py-5 px-4">
                              <Link
                                href={`/hr/singleEmployeeFines?id=${fine?.employeeId}&month=${fine?.month}`}
                              >
                                View Details
                              </Link>
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
    </div>
  );
};

export default withAuth(SalaryCal);
