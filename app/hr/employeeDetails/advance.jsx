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

  const getQueryParam = (url, param) => {
    const searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getQueryParam(currentUrl, "id");
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id) {
      getAllQuotes(id);
    }
  }, [id]);

  const getAllQuotes = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get?employee_user_id=${employeeId}`
      );

      // Combine all advance payments from different salary records
      const allAdvancePayments = response?.data?.reduce((acc, curr) => {
        return [...acc, ...(curr.employee_advance_payment || [])];
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

  const filteredPayments = advancePayments.filter(
    (payment) => payment.advance_payment > 0 || payment.received_payment > 0
  );
  const lastEntry = filteredPayments[filteredPayments.length - 1];

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold mb-4">Advance Payments</h2>

      {/* {lastEntry && (
        <div className="mb-4 text-right font-semibold text-gray-800">
          Last Balance: {parseFloat(lastEntry.balance).toFixed(2)}
        </div>
      )} */}

      <div className="bg-white p-4 rounded shadow-sm mb-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">
            Outstanding Balance
          </span>
          {lastEntry && (
            <span className="font-bold text-lg text-red-600">
              {" "}
              {parseFloat(lastEntry.balance).toFixed(2)}{" "}
            </span>
          )}
        </div>
      </div>

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
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[23%]">
                  Description
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[12%]">
                  Date
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[15%]">
                  Month
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[15%]">
                  Advance
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left w-[15%]">
                  Received
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
                : advancePayments
                    .filter(
                      (payment) =>
                        payment.advance_payment > 0 ||
                        payment.received_payment > 0
                    )
                    .map((payment, index) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          {payment.advance_payment > 0 ? "Advance" : ""}
                          {payment.received_payment > 0
                            ? "Advance Received"
                            : ""}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(payment.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="py-3 px-4">{payment.month}</td>
                        <td className="py-3 px-4">
                          {parseFloat(payment.advance_payment).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {parseFloat(payment.received_payment).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {parseFloat(payment.balance).toFixed(2)}
                        </td>
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
