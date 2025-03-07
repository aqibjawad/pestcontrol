"use client";

import React, { useState, useEffect, useRef } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { format } from "date-fns";
import Link from "next/link";

const ListServiceTable = ({ startDate, endDate }) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

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
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className={tableStyles.tableContainer}>
        {loadingDetails ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading data...</span>
          </div>
        ) : (
          <div className="grid gap-2">
            {invoiceList.map((transaction, index) => {
              const total =
                parseFloat(transaction.cash_amt || 0) +
                parseFloat(transaction.online_amt || 0) +
                parseFloat(transaction.cheque_amt || 0);

              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded shadow px-4 py-2"
                >
                  {/* First row - Sr. No, Date, Invoice # */}
                  <div className="flex mb-1">
                    <div style={{ width: "70px" }} className="text-sm">
                      <span className="font-semibold">Sr. No</span>
                      <div>{index + 1}</div>
                    </div>
                    <div style={{ width: "100px" }} className="text-sm">
                      <span className="font-semibold">Date</span>
                      <div>{formatDate(transaction.created_at)}</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Reference</span>
                      <div>
                        {" "}
                        {transaction?.referenceable?.expense_name ||
                          transaction?.referenceable?.name ||
                          transaction?.referenceable?.supplier_name ||
                          transaction?.referenceable?.vehicle_number ||
                          "other Payments"}
                      </div>
                    </div>
                  </div>

                  {/* Second row - Customer, Amount */}
                  <div className="flex justify-between mt-5">
                    <div className="text-sm">
                      <span className="font-semibold">Description </span>
                      <div> {transaction.description}</div>
                    </div>
                    <div className="text-sm text-right">
                      <span className="font-semibold">Amount</span>
                      <div className="font-medium">
                        AED{" "}
                        {parseFloat(total).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
      <div style={{ padding: "20px 0" }}>
        {/* Updated header with flex layout */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              Total Payments
            </div>
          </div>

          {/* View button */}
          <div>
            <div className="bg-green-500 text-white font-semibold text-base py-2 px-6 rounded cursor-pointer">
              <Link href="/accountant/totalPayments">View</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
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
