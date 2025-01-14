"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
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
          // Refresh the employee list after successful payment
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

  return (
    <>
      <MonthPicker onDateChange={handleDateChange} />

      {fetchingData ? (
        <CircularProgress />
      ) : (
        <>
          <hr />
          <div className="mt-10 mb-10">
            <div className="pageTitle">Sales By Employees</div>
            <div className="mt-5"></div>
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
                        style={{ width: "25%" }}
                        className="py-2 px-4 border-b border-gray-200 text-left"
                      >
                        Employee Name
                      </th>
                      <th
                        style={{ width: "15%" }}
                        className="py-2 px-4 border-b border-gray-200 text-left"
                      >
                        Commission %
                      </th>
                      <th
                        style={{ width: "15%" }}
                        className="py-2 px-4 border-b border-gray-200 text-left"
                      >
                        Target Achieved %
                      </th>
                      <th
                        style={{ width: "10%" }}
                        className="py-2 px-4 border-b border-gray-200 text-left"
                      >
                        Sale
                      </th>
                      <th
                        style={{ width: "10%" }}
                        className="py-2 px-4 border-b border-gray-200 text-left"
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
                      {employeeList?.map((row, index) => (
                        <tr key={row.id} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            {index + 1}
                          </td>
                          <td style={{ width: "25%" }} className="py-5 px-4">
                            {row?.referencable?.name}
                          </td>
                          <td style={{ width: "15%" }} className="py-5 px-4">
                            {row.commission_per}%
                          </td>
                          <td style={{ width: "15%" }} className="py-5 px-4">
                            {row.target && row.sale
                              ? isNaN((row.sale / row.target) * 100)
                                ? 0
                                : ((row.sale / row.target) * 100).toFixed(2)
                              : 0}
                            %
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.sale}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.target}
                          </td>
                          <td
                            style={{ width: "20%" }}
                            className="py-5 px-4 text-center"
                          >
                            {row?.paid_amt}
                          </td>
                          <td
                            style={{ width: "20%" }}
                            className="py-5 px-4 text-center"
                          >
                            {row?.status}
                          </td>
                          <td
                            style={{ width: "20%" }}
                            className="py-5 px-4 text-center"
                          >
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
      )}
    </>
  );
};

export default withAuth(SalaryCal);
