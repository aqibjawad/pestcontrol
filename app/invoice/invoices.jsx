"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { serviceInvoice } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Skeleton from "@mui/material/Skeleton";

// Properly import AppHelpers
import { AppHelpers } from "@/Helper/AppHelpers";

import Link from "next/link";
import DateFilters from "@/components/generic/DateFilters";

import { format } from "date-fns";

const ListServiceTable = ({
  handleDateChange,
  startDate,
  endDate,
  updateTotalAmount,
}) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  const formatDate = (dateString) => {
    try {
      return AppHelpers.convertDate(dateString);
    } catch (error) {
      console.error("Error converting date:", error);
      return dateString; // Return original string if conversion fails
    }
  };

  const getAllQuotes = async () => {
    setFetchingData(true);

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
      const paidInvoices = response.data.filter(
        (invoice) => invoice.status === "paid"
      );
      setQuoteList(paidInvoices);
      updateTotalAmount(paidInvoices); // Update total amount here
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuoteList([]); // Set empty array on error
      updateTotalAmount([]); // Reset total amount on error
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
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
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
                    <div className={tableStyles.clientContact}>
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

const Invoices = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const updateTotalAmount = (invoiceList) => {
    const total = invoiceList.reduce(
      (acc, invoice) => acc + (invoice.total_amt || 0),
      0
    );
    setTotalAmount(total);
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Invoices
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "44px",
              width: "202px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "1rem",
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            <DateFilters onDateChange={handleDateChange} />
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
          />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
