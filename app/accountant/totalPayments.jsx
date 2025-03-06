"use client";

import React, { useState, useEffect, useRef } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Link from "next/link";

const ListServiceTable = ({ startDate, endDate }) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const tableRef = useRef(null);

  // Calculate totals for summary row
  const calculateTotals = () => {
    let totalCash = 0;
    let totalBank = 0;
    let totalCheque = 0;
    let grandTotal = 0;

    invoiceList?.forEach((transaction) => {
      totalCash += parseFloat(transaction.cash_amt || 0);
      totalBank += parseFloat(transaction.online_amt || 0);
      totalCheque += parseFloat(transaction.cheque_amt || 0);
      grandTotal +=
        parseFloat(transaction.cash_amt || 0) +
        parseFloat(transaction.online_amt || 0) +
        parseFloat(transaction.cheque_amt || 0);
    });

    return {
      totalCash,
      totalBank,
      totalCheque,
      grandTotal,
    };
  };

  const totals = calculateTotals();

  const getAllCheques = async () => {
    setFetchingData(true);
    setLoadingDetails(true);

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      // Instead of using startOfMonth and endOfMonth
      const today = new Date();
      const formattedToday = format(today, "yyyy-MM-dd");

      // Set both start and end dates to today
      queryParams.push(`start_date=${formattedToday}`);
      queryParams.push(`end_date=${formattedToday}`);
    }

    // Remove pagination limit to get all items
    queryParams.push("limit=1000");

    try {
      const response = await api.getDataWithToken(
        `${company}/payments/get?${queryParams.join("&")}`
      );

      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    getAllCheques();
  }, [startDate, endDate]);

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
      currency: "AED",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div>
      <div className={tableStyles.tableContainer}>
        <div
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            maxHeight: "500px",
          }}
        >
          <div className="relative">
            <div className="overflow-x-auto">
              {loadingDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Loading data...</span>
                </div>
              ) : (
                <table ref={tableRef} className="w-full bg-white">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold text-sm">
                        Sr.
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold text-sm">
                        Date
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right font-semibold text-sm">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceList.map((transaction, index) => {
                      const total =
                        parseFloat(transaction.cash_amt || 0) +
                        parseFloat(transaction.online_amt || 0) +
                        parseFloat(transaction.cheque_amt || 0);

                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{index + 1}</td>
                          <td className="py-3 px-4 text-sm">
                            {formatDate(transaction.created_at)}
                          </td>

                          <td className="py-3 px-4 text-sm font-medium text-right">
                            {formatAmount(total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentsTotal = () => {
  const getDateParamsFromUrl = () => {
    if (typeof window !== "undefined") {
      const searchParams = new URL(window.location.href).searchParams;
      const startDate = searchParams.get("start");
      const endDate = searchParams.get("end");
      return { startDate, endDate };
    }
    return { startDate: null, endDate: null };
  };

  const { startDate: urlStartDate, endDate: urlEndDate } =
    getDateParamsFromUrl();
  const [startDate, setStartDate] = useState(urlStartDate);
  const [endDate, setEndDate] = useState(urlEndDate);

  useEffect(() => {
    if (urlStartDate && urlEndDate) {
      setStartDate(urlStartDate);
      setEndDate(urlEndDate);
    }
  }, [urlStartDate, urlEndDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        {/* Updated header with flex layout */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div
              style={{
                fontSize: "20px",
                fontFamily: "semibold",
              }}
            >
              Total Payments
            </div>
          </div>

          {/* Date filter aligned to the right */}
          <div className="flex items-center gap-4">
            {/* Date Filter Component */}
            <div className="bg-green-600 text-white font-semibold text-base h-11 px-4 flex items-center rounded-lg">
              <Link href="/accountant/totalPayments">View</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ListServiceTable
            handleDateChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsTotal;
