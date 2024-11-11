"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Button } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const CommissionCal = () => {

  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [processingPayments, setProcessingPayments] = useState({});

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/commission/get`
      );
      setEmployeeList(response.data);
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
    getAllEmployees();
  }, []);

  const handleSubmit = async (employee) => {
    // Set loading state for specific employee
    setProcessingPayments((prev) => ({
      ...prev,
      [employee.id]: true,
    }));

    const obj = {
      employee_commission_id: employee.id, // Use the correct employee commission ID
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/commission/paid`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Commission has been paid successfully!",
        }).then(() => {
          getAllEmployees(); // Refresh the data instead of full page reload
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error?.message || "Error processing payment",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unexpected error occurred",
      });
    } finally {
      setProcessingPayments((prev) => ({
        ...prev,
        [employee.id]: false,
      }));
    }
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="mt-10 mb-10">
        <div className="pageTitle"> Sales By Employees </div>

        <div className={tableStyles.tableContainer}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-5 px-4 border-b border-gray-200 text-left">
                  Sr.
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Employee Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Commission
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Sale
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Target
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((row, index) => (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-5 px-4">{row?.referencable?.name}</td>
                  <td className="py-5 px-4">{row.commission_per}%</td>
                  <td className="py-5 px-4">{row.sale}</td>
                  <td className="py-5 px-4">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionCal;
