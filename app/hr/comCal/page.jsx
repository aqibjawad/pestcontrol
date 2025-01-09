"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import { CircularProgress, Skeleton } from "@mui/material";
import withAuth from "@/utils/withAuth";

import MonthPicker from "../monthPicker";
import InputWithTitle from "@/components/generic/InputWithTitle";

const SalaryCal = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

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
  const [allEmployees, setAllEmployees] = useState();

  const getEmployeeCommissions = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/commission/get?commission_month=${selectedMonth}`
      );
      setEmployeeList(response.data);
      setAllEmployees(response.data);
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
  }, [selectedMonth]); // Only depend on selectedMonth

  const handleEmployeeNameChange = (value) => {
    if (value === "") {
      setEmployeeList(allEmployees);
    } else {
      const filteredList = allEmployees.filter((employee) =>
        employee.referencable?.name.toLowerCase().includes(value.toLowerCase())
      );
      setEmployeeList(filteredList);
    }
  };

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
                        <InputWithTitle
                          title={"Employee Name"}
                          placeholder="Filter by Name"
                          onChange={(value) => {
                            handleEmployeeNameChange(value);
                          }}
                        />
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
