"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [advancePayments, setAdvancePayments] = useState([]);
  const [userDetails, setUserDetails] = useState(null); // To store user details
  const [month, setMonth] = useState(null);

  const getQueryParam = (url, param) => {
    const searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getQueryParam(currentUrl, "id");
    const urlMonth = getQueryParam(currentUrl, "month");
    setId(urlId);
    setMonth(urlMonth);
  }, []);

  useEffect(() => {
    if (id && month) {
      getAllQuotes(id);
    }
  }, [id, month]);

  const getAllQuotes = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get?employee_user_id=${employeeId}&salary_month=${month}`
      );
      const employeeData = response?.data?.[0];
      if (employeeData) {
        setAdvancePayments(employeeData.vehicle_fines || []);
        setUserDetails({
          name: employeeData?.user?.name || "N/A",
          email: employeeData?.user?.email || "N/A",
        }); 
      }
    } catch (error) {
      console.error("Error fetching advance payments:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold mb-4">Advance Payments</h2>

      {/* User Details Section */}
      {fetchingData ? (
        <div className="mb-4">
          <Skeleton variant="rectangular" width={200} height={30} />
          <Skeleton variant="rectangular" width={300} height={30} />
        </div>
      ) : userDetails ? (
        <div className="mb-4">
          <p className="text-lg font-medium">Name: {userDetails.name}</p>
          <p className="text-lg font-medium">Email: {userDetails.email}</p>
        </div>
      ) : (
        <p className="text-lg text-gray-500 mb-4">No user details found.</p>
      )}

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
                  Date
                </th>
                <th
                  style={{ width: "15%" }}
                  className="py-2 px-4 border-b border-gray-200 text-left"
                >
                  Fine
                </th>
                <th
                  style={{ width: "15%" }}
                  className="py-2 px-4 border-b border-gray-200 text-left"
                >
                  Balance
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
                        <td style={{ width: "15%" }} className="py-5 px-4">
                          <Skeleton variant="rectangular" height={30} />
                        </td>
                        <td style={{ width: "15%" }} className="py-5 px-4">
                          <Skeleton variant="rectangular" height={30} />
                        </td>
                        <td style={{ width: "15%" }} className="py-5 px-4">
                          <Skeleton variant="rectangular" height={30} />
                        </td>
                        <td style={{ width: "25%" }} className="py-5 px-4">
                          <Skeleton variant="rectangular" height={30} />
                        </td>
                        <td style={{ width: "15%" }} className="py-5 px-4">
                          <Skeleton variant="rectangular" height={30} />
                        </td>
                      </tr>
                    ))
                  : advancePayments.map((payment, index) => (
                      <tr key={payment.id} className="border-b border-gray-200">
                        <td style={{ width: "5%" }} className="py-5 px-4">
                          {index + 1}
                        </td>
                        <td style={{ width: "5%" }} className="py-5 px-4">
                          {new Date(payment?.fine_date).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td style={{ width: "15%" }} className="py-5 px-4">
                          {payment.fine}
                        </td>
                        <td style={{ width: "15%" }} className="py-5 px-4">
                          {payment.balance}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
