"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { serviceInvoice } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Skeleton from "@mui/material/Skeleton";
import { AppHelpers } from "@/Helper/AppHelpers";
import Link from "next/link";
import DateFilters2 from "@/components/generic/DateFilters2";
import { format } from "date-fns";

const ListServiceTable = ({
  handleDateChange,
  startDate,
  endDate,
  updateTotalAmount,
  statusFilter,
}) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate, statusFilter]);

  const formatDate = (dateString) => {
    try {
      return AppHelpers.convertDate(dateString);
    } catch (error) {
      console.error("Error converting date:", error);
      return dateString;
    }
  };

  const getAllQuotes = async () => {
    setFetchingData(true);
    setLoadingDetails(true);

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${serviceInvoice}?${queryParams.join("&")}`
      );

      let filteredData = response.data;
      if (statusFilter !== "all") {
        filteredData = response.data.filter(
          (invoice) => invoice.status.toLowerCase() === statusFilter
        );
      }

      setQuoteList(filteredData);
      updateTotalAmount(filteredData);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuoteList([]);
      updateTotalAmount([]);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  return (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Invoice Issue Date
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Client
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Paid Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Total Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Status
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingDetails
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">
                    <Skeleton variant="rectangular" width={30} height={20} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="rectangular" width={120} height={20} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="rectangular" width={150} height={20} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="rectangular" width={100} height={20} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="rectangular" width={100} height={20} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="rectangular" width={80} height={20} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="rectangular" width={100} height={20} />
                  </td>
                </tr>
              ))
            : invoiceList?.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {formatDate(row.issued_date)}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row?.user?.name || "N/A"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.paid_amt || 0}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.total_amt || 0}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div
                      className={`${tableStyles.clientContact} ${
                        row.status.toLowerCase() === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {row.status}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      <Link href={`/invoiceDetails?id=${row.id}`}>
                        <span className="text-blue-600 hover:text-blue-800">
                          View Details
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

const AllPayments = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const updateTotalAmount = (invoiceList) => {
    const total = invoiceList.reduce((acc, invoice) => {
      const amount = parseFloat(invoice.total_amt) || 0;
      return acc + amount;
    }, 0);

    setTotalAmount(Number(total.toFixed(2)));
  };
  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "1rem",
          }}
        >
          All Invoices
        </div>

        <div className="flex justify-between items-center mb-6">
          {/* Status Filter Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-6 py-2 rounded-lg ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("paid")}
              className={`px-6 py-2 rounded-lg ${
                statusFilter === "paid"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter("unpaid")}
              className={`px-6 py-2 rounded-lg ${
                statusFilter === "unpaid"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Unpaid
            </button>
          </div>

          {/* Date Filter */}
          <div className="bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg">
            <DateFilters2 onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ListServiceTable
            handleDateChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            updateTotalAmount={updateTotalAmount}
            statusFilter={statusFilter}
          />
        </div>
      </div>

      {/* Total Amount Display */}
      <div className="flex justify-end p-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <span className="font-semibold text-lg">Total Amount: </span>
          <span className="text-lg text-blue-600">
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllPayments;
