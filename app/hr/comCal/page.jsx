"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import { CircularProgress, Skeleton } from "@mui/material";
import withAuth from "@/utils/withAuth";
import MonthPicker from "../monthPicker";

const SalaryCal = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const initialMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    const monthStr = dates.startDate.slice(0, 7);
    if (monthStr !== selectedMonth) {
      setSelectedMonth(monthStr);
    }
  };

  const getEmployeeCommissions = async () => {
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
    getEmployeeCommissions(selectedMonth);
  }, [selectedMonth]);

  const handleAdvePay = async (employeeId) => {
    setLoadingSubmit(true);
    const obj = {
      employee_commission_id: employeeId,
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
          text: "Payment has been processed successfully!",
          customClass: {
            popup: "my-custom-popup-class",
          },
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
        customClass: {
          popup: "my-custom-popup-class",
        },
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const cellStyle = "py-5 px-4 text-center";

  // Skeleton row component
  const SkeletonRow = () => (
    <tr className="border-b border-gray-200">
      <td style={{ width: "5%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "25%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "15%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "15%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "10%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "10%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "20%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "20%" }} className={cellStyle}>
        <Skeleton variant="text" width="100%" />
      </td>
      <td style={{ width: "20%" }} className={cellStyle}>
        <Skeleton variant="rounded" width="80%" height={36} />
      </td>
    </tr>
  );

  return (
    <>
      <div className="mt-10 mb-10">
        <div className="pageTitle">Sales By Employees</div>
        <div className="mt-5"></div>
        <div className="mt-5"></div>
        <MonthPicker onDateChange={handleDateChange} />

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
                    className="py-5 px-4 border-b border-gray-200 text-center"
                  >
                    Sr.
                  </th>
                  <th
                    style={{ width: "25%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Employee Name
                  </th>
                  <th
                    style={{ width: "15%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Commission %
                  </th>
                  <th
                    style={{ width: "15%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Target Achieved %
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Sale
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Target
                  </th>
                  <th
                    style={{ width: "20%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Commission Amount
                  </th>
                  <th
                    style={{ width: "20%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Status
                  </th>
                  <th
                    style={{ width: "20%" }}
                    className="py-2 px-4 border-b border-gray-200 text-center"
                  >
                    Pay
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
                    ? // Show skeleton rows while loading
                      Array.from(new Array(5)).map((_, index) => (
                        <SkeletonRow key={index} />
                      ))
                    : employeeList?.map((row, index) => (
                        <tr key={row.id} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className={cellStyle}>
                            {index + 1}
                          </td>
                          <td style={{ width: "25%" }} className={cellStyle}>
                            {row?.referencable?.name}
                          </td>
                          <td style={{ width: "15%" }} className={cellStyle}>
                            {row.commission_per}%
                          </td>
                          <td style={{ width: "15%" }} className={cellStyle}>
                            {row.target > 0 && row.sale
                              ? ((row.sale / row.target) * 100).toFixed(2)
                              : 0}
                            %
                          </td>
                          <td style={{ width: "10%" }} className={cellStyle}>
                            {row.sale}
                          </td>
                          <td style={{ width: "10%" }} className={cellStyle}>
                            {row.target}
                          </td>
                          <td style={{ width: "20%" }} className={cellStyle}>
                            {row?.paid_amt}
                          </td>
                          <td style={{ width: "20%" }} className={cellStyle}>
                            {row?.status}
                          </td>
                          <td style={{ width: "20%" }} className={cellStyle}>
                            {row.paid_amt > 0 && (
                              <button
                                onClick={() => handleAdvePay(row.id)}
                                disabled={
                                  loadingSubmit || row.status === "paid"
                                }
                                className={`${
                                  loadingSubmit || row.status === "paid"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                } text-white py-2 px-4 rounded`}
                              >
                                {loadingSubmit ? "Processing..." : "Pay"}
                              </button>
                            )}
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

export default withAuth(SalaryCal);
