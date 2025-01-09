"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { salaries } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import { CircularProgress, Skeleton } from "@mui/material";
import withAuth from "@/utils/withAuth";

import MonthPicker from "../monthPicker";

const SalaryTotal = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [salaryList, setSalaryList] = useState([]);

  const initialMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;

    // Ensure we're only taking YYYY-MM format
    const monthStr = dates.startDate.slice(0, 7);
    if (monthStr !== selectedMonth) {
      setSelectedMonth(monthStr);
    }
  };

  const getSalarySummary = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${salaries}/detail/${selectedMonth}`
      );
      setSalaryList(response.data);
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
    getSalarySummary(selectedMonth);
  }, [selectedMonth]);

  return (
    <>
      <div className="pageTitle"> Salary Summary </div>
      <div className="mt-5"></div>
      <MonthPicker onDateChange={handleDateChange} />
      <div className="mt-5"></div>
      <div className="mt-10 mb-10">
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
                    style={{ width: "25%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Description
                  </th>
                  <th
                    style={{ width: "15%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Amount
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
                            <div className="bg-gray-200 h-4 w-6 rounded"></div>
                          </td>
                          <td style={{ width: "25%" }} className="py-5 px-4">
                            <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                          </td>
                          <td style={{ width: "15%" }} className="py-5 px-4">
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                          </td>
                        </tr>
                      ))
                    : salaryList?.map((row, index) => (
                        <tr key={row.id} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            {index + 1}
                          </td>
                          <td style={{ width: "25%" }} className="py-5 px-4">
                            {row?.name}
                          </td>
                          <td style={{ width: "15%" }} className="py-5 px-4">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(SalaryTotal);
