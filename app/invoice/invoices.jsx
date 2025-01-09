"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { serviceInvoice, clients } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Skeleton from "@mui/material/Skeleton";
import { AppHelpers } from "@/Helper/AppHelpers";
import Link from "next/link";
import DateFilters2 from "@/components/generic/DateFilters2";
import { startOfMonth, endOfMonth, format } from "date-fns";

const ListServiceTable = ({
  handleDateChange,
  startDate,
  endDate,
  updateTotalAmount,
  statusFilter,
  selectedReference,
  isVisible,
  setReferenceOptions,
}) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [brandsList, setBrandsList] = useState([]);

  const [referenceList, setReferenceList] = useState([]);

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
      const currentDate = new Date();
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      queryParams.push(`start_date=${format(startDate, "yyyy-MM-dd")}`);
      queryParams.push(`end_date=${format(endDate, "yyyy-MM-dd")}`);
    }

    try {
      if (queryParams.length > 0) {
        const response = await api.getDataWithToken(
          `${serviceInvoice}?${queryParams.join("&")}`
        );

        let filteredData = response.data;

        // Filter by status
        if (statusFilter !== "all") {
          filteredData = filteredData.filter(
            (invoice) => invoice.status.toLowerCase() === statusFilter
          );
        }

        // Filter by reference
        if (selectedReference !== "all") {
          filteredData = filteredData.filter(
            (invoice) =>
              invoice?.user?.client?.referencable?.name === selectedReference
          );
        }

        // Extract references
        const references = new Set(
          filteredData
            .map((invoice) => invoice?.user?.client?.referencable?.name)
            .filter((name) => name) // Remove undefined/null values
        );

        setReferenceList([...references]); // Convert Set to Array
        if (setReferenceOptions) {
          // Add check to ensure prop exists
          setReferenceOptions([...references]);
        }
        setQuoteList(filteredData);
        updateTotalAmount(filteredData);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuoteList([]);
      updateTotalAmount([]);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate, statusFilter, selectedReference, isVisible]);

  return (
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
        <table className="min-w-full bg-white" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th
                style={{ width: "5%" }}
                className="py-5 px-4 border-b border-gray-200 text-left"
              >
                Sr.
              </th>
              <th
                style={{ width: "15%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Invoice Issue Date
              </th>
              <th
                style={{ width: "15%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Client
              </th>
              <th
                style={{ width: "15%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Firm Name
              </th>
              <th
                style={{ width: "10%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Reference
              </th>
              <th
                style={{ width: "10%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Paid Amount
              </th>
              <th
                style={{ width: "10%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Total Amount
              </th>
              <th
                style={{ width: "10%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Status
              </th>
              <th
                style={{ width: "10%" }}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                Action
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
              {loadingDetails
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td style={{ width: "5%" }} className="py-5 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={30}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "15%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "15%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={150}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "15%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={20}
                        />
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={20}
                        />
                      </td>
                    </tr>
                  ))
                : invoiceList?.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td style={{ width: "5%" }} className="py-5 px-4">
                        {index + 1}
                      </td>
                      <td style={{ width: "15%" }} className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {formatDate(row.issued_date)}
                        </div>
                      </td>
                      <td style={{ width: "15%" }} className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row?.user?.name || "N/A"}
                        </div>
                      </td>
                      <td style={{ width: "15%" }} className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row?.user?.client?.firm_name || "N/A"}
                        </div>
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row?.user?.client?.referencable?.name || "N/A"}
                        </div>
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row.paid_amt || 0}
                        </div>
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row.total_amt || 0}
                        </div>
                      </td>
                      <td style={{ width: "10%" }} className="py-2 px-4">
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
                      <td style={{ width: "10%" }} className="py-2 px-4">
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
      </div>
    </div>
  );
};

const Invoices = ({ isVisible }) => {
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
  const [totalAmount, setTotalAmount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReference, setSelectedReference] = useState("all");
  const [referenceOptions, setReferenceOptions] = useState([]);

  useEffect(() => {
    if (urlStartDate && urlEndDate) {
      setStartDate(urlStartDate);
      setEndDate(urlEndDate);
    }
  }, []);

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
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Search By Reference:</label>
              <select
                value={selectedReference}
                onChange={(e) => setSelectedReference(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All References</option>
                {referenceOptions.map((reference, index) => (
                  <option key={index} value={reference}>
                    {reference}
                  </option>
                ))}
              </select>
            </div>

            {urlStartDate ? (
              <div>
                <p>Start Date: {urlStartDate}</p>
                <p>End Date: {urlEndDate || "Not Set"}</p>
              </div>
            ) : (
              <div className="bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg">
                <DateFilters2 onDateChange={handleDateChange} />
              </div>
            )}
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
            selectedReference={selectedReference}
            isVisible={isVisible}
            setReferenceOptions={setReferenceOptions}
          />
        </div>
      </div>

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

export default Invoices;
