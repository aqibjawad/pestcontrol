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
  const [userDetails, setUserDetails] = useState(null);
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
        `${getAllEmpoyesUrl}/salary/get?employee_user_id=${employeeId}`
      );

      // Combine all advance payments from different salary records
      const allAdvancePayments = response?.data?.reduce((acc, curr) => {
        return [...acc, ...(curr.vehicle_fines || [])];
      }, []);
      setAdvancePayments(allAdvancePayments);

      // Set user details from the first record
      if (response?.data?.[0]) {
        const employeeData = response.data[0];
        setUserDetails({
          name: employeeData?.user?.name || "N/A",
          email: employeeData?.user?.email || "N/A",
          profession: employeeData?.user?.employee?.profession || "N/A",
          basicSalary: employeeData?.user?.employee?.basic_salary || "0",
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
          <Skeleton
            variant="rectangular"
            width={200}
            height={30}
            className="mb-2"
          />
          <Skeleton variant="rectangular" width={300} height={30} />
        </div>
      ) : userDetails ? (
        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-medium">Name: {userDetails.name}</p>
          <p className="text-lg font-medium">Email: {userDetails.email}</p>
          <p className="text-lg font-medium">
            Profession: {userDetails.profession}
          </p>
          <p className="text-lg font-medium">
            Basic Salary: AED {userDetails.basicSalary}
          </p>
        </div>
      ) : (
        <p className="text-lg text-gray-500 mb-4">No user details found.</p>
      )}

      <div className={tableStyles.tableContainer}>
        <div className="overflow-hidden flex flex-col max-h-[500px]">
          <table
            className="min-w-full bg-white"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[5%]">
                  Sr.
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[12%]">
                  Date
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[15%]">
                  Fine Amount
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[15%]">
                  Fine Received
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[15%]">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchingData
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton variant="rectangular" height={20} />
                      </td>
                    </tr>
                  ))
                : advancePayments.map((payment, index) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        {new Date(payment.updated_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-3 px-4">{payment.fine}</td>
                      <td className="py-3 px-4">{payment.fine_received}</td>
                      <td className="py-3 px-4">{payment.balance}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
