"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Skeleton, Card } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import withAuth from "@/utils/withAuth";
import MonthPicker from "../monthPicker";
import Link from "next/link";
import "./index.css";

const Ledger = () => {
  const api = new APICall();
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [allEmployees, setAllEmployees] = useState();
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
        // Handle advance payments
        const employeesWithAdvance = response.data.filter(
          (employee) => employee.user?.employee?.current_adv_balance > 0
        );
        setEmployeeList(employeesWithAdvance);

        // Handle vehicle fines - only show employees with fines
        const employeesWithFines = response.data.filter(
          (employee) => employee.user?.employee?.current_fine_balance > 0
        );
        setVehicleFines(employeesWithFines);
        setFilteredVehicleFines(employeesWithFines);

        setAllEmployees(response.data);
        setEmployeeCompany(response.data.captain_jobs || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleEmployeeNameChange = (value) => {
    if (!value.trim()) {
      setEmployeeList(
        allEmployees?.filter(
          (emp) => emp.user?.employee?.current_adv_balance > 0
        ) || []
      );
    } else {
      const filteredList =
        allEmployees?.filter(
          (employee) =>
            employee.user?.name.toLowerCase().includes(value.toLowerCase()) &&
            employee.user?.employee?.current_adv_balance > 0
        ) || [];
      setEmployeeList(filteredList);
    }
  };

  const handleFinesNameFilter = (value) => {
    if (!value.trim()) {
      setFilteredVehicleFines(vehicleFines);
    } else {
      const filtered = vehicleFines.filter((employee) =>
        employee.user?.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVehicleFines(filtered);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [selectedMonth, refreshComponent]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Advance Payments</h2>
      <Card sx={{ mb: 4, p: 3 }}>
        <div>
          <div className="overflow-x-auto"> 
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Sr.</th>
                  <th className="p-4 text-left">Employee Id</th>
                  <th className="p-4 text-left">
                    <InputWithTitle
                      title="Employee Name"
                      placeholder="Filter by Name"
                      onChange={handleEmployeeNameChange}
                    />
                  </th>
                  <th className="p-4 text-left">Advance Balance</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchingData
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                      </tr>
                    ))
                  : employeeList.map((employee, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{employee.user?.employee?.id}</td>
                        <td className="p-4">{employee.user?.name}</td>
                        <td className="p-4">
                          {employee.user?.employee?.current_adv_balance}
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/hr/singleEmployeeLedger?id=${employee.user?.id}&month=${employee.month}`}
                            className="text-blue-600 hover:underline"
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
      </Card>

      <Card sx={{ p: 3 }}>
        <div>
          <h2 className="text-xl font-bold mb-4">Vehicle Fines</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Sr.</th>
                  <th className="p-4 text-left">Employee Id</th>
                  <th className="p-4 text-left">
                    <InputWithTitle
                      title="Employee Name"
                      placeholder="Filter by Name"
                      onChange={handleFinesNameFilter}
                    />
                  </th>
                  <th className="p-4 text-left">Fine Balance</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchingData
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                      </tr>
                    ))
                  : filteredVehicleFines.map((employee, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{employee.user?.employee?.id}</td>
                        <td className="p-4">{employee.user?.name}</td>
                        <td className="p-4">
                          {employee.user?.employee?.current_fine_balance}
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/hr/singleEmployeeFines?id=${employee.user?.id}&month=${employee.month}`}
                            className="text-blue-600 hover:underline"
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
      </Card>
    </div>
  );
};

export default Ledger;
