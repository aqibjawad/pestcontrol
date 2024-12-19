"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Button } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import MonthPicker from "../monthPicker";

const CommissionCal = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [processingPayments, setProcessingPayments] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    // Convert the start date to YYYY-MM format for the API
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/commission/get?commission_month=${selectedMonth}`
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
  }, [selectedMonth]);

  // useEffect(() => {
  //   if (isVisible) {
  //     getAllEmployees();
  //   }
  // }, [isVisible]);

  return (
    <>
      {fetchingData ? (
        <CircularProgress />
      ) : (
        <>
          <hr />
          <div className="mt-10 mb-10">
            <div className="pageTitle"> Sales By Employees </div>
            <div className="mt-5"></div>
            <MonthPicker onDateChange={handleDateChange} />
            <div className="mt-5"></div>
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
                      Target %
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
                  {employeeList?.map((row, index) => (
                    <tr key={row.id} className="border-b border-gray-200">
                      <td className="py-5 px-4">{index + 1}</td>
                      <td className="py-5 px-4">{row?.referencable?.name}</td>
                      <td className="py-5 px-4">{row.commission_per}%</td>
                      <td className="py-5 px-4">
                        {row.target && row.sale
                          ? isNaN((row.sale / row.target) * 100)
                            ? 0
                            : ((row.sale / row.target) * 100).toFixed(2)
                          : 0}
                        %
                      </td>
                      <td className="py-5 px-4">{row.sale}</td>
                      <td className="py-5 px-4">{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CommissionCal;
