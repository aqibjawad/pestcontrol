"use client";

import React, { useState, useEffect, useRef } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { Skeleton } from "@mui/material";
import { AppHelpers } from "@/Helper/AppHelpers";
import DateFilters from "@/components/generic/DateFilters";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

    invoiceList.forEach((transaction) => {
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

  // Generate PDF from table data
  const generatePDF = () => {
    if (!invoiceList) return;

    try {
      const doc = new jsPDF();

      // Add logo
      const logoWidth = 45;
      const logoHeight = 30;
      const logoX = 15;
      const logoY = 15;
      doc.addImage("/logo.jpeg", "PNG", logoX, logoY, logoWidth, logoHeight);

      // Page width calculation
      const pageWidth = doc.internal.pageSize.width;

      // Add details on the right
      const detailsX = pageWidth - 80;
      const detailsY = logoY + 5;
      const lineHeight = 6;

      // Add title and details on right side
      doc.setFontSize(13);
      doc.text("Total Payments Report", detailsX, detailsY, { align: "left" });

      doc.setFontSize(11);
      // You can add more details here if needed
      doc.text(
        `Generated: ${formatDate(new Date())}`,
        detailsX,
        detailsY + lineHeight,
        { align: "left" }
      );

      // Add date range if present
      if (startDate && endDate) {
        doc.text(
          `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
          15,
          60
        );
      }

      // Add main title
      doc.setFontSize(18);
      doc.text("Total Payments Report", 15, 70);

      // Create table data structure for PDF
      const tableData = invoiceList.map((transaction, index) => {
        const total =
          parseFloat(transaction.cash_amt || 0) +
          parseFloat(transaction.online_amt || 0) +
          parseFloat(transaction.cheque_amt || 0);
        return [
          index + 1,
          formatDate(transaction.created_at),
          transaction.description,
          transaction.entry_type === "cr" ? "Credit" : "Debit",
          transaction.cash_amt !== "0.00"
            ? formatAmount(transaction.cash_amt)
            : "",
          transaction.online_amt !== "0.00"
            ? formatAmount(transaction.online_amt)
            : "",
          transaction.cheque_amt !== "0.00"
            ? formatAmount(transaction.cheque_amt)
            : "",
          formatAmount(total),
        ];
      });

      // Add summary row
      tableData.push([
        "",
        "",
        "TOTAL",
        "",
        formatAmount(totals.totalCash),
        formatAmount(totals.totalBank),
        formatAmount(totals.totalCheque),
        formatAmount(totals.grandTotal),
      ]);

      // Generate table
      doc.autoTable({
        head: [
          [
            "Sr.",
            "Date",
            "Description",
            "Type",
            "Cash Amount",
            "Bank Amount",
            "Cheque Amount",
            "Total",
          ],
        ],
        body: tableData,
        startY: 80,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74], textColor: 255 },
        footStyles: { fillColor: [240, 240, 240] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      doc.save("total_payments_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could add error handling here, such as displaying a notification
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
      </div>

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
                      <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold text-sm">
                        Description
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold text-sm">
                        Reference
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold text-sm">
                        Type
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right font-semibold text-sm">
                        Cash Amount
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right font-semibold text-sm">
                        Bank Amount
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right font-semibold text-sm">
                        Cheque Amount
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
                          <td className="py-3 px-4 text-sm">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {transaction?.referenceable?.expense_name ||
                              transaction?.referenceable?.name ||
                              transaction?.referenceable?.supplier_name ||
                              "other Payments"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.entry_type === "cr"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.entry_type === "cr"
                                ? "Credit"
                                : "Debit"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            {transaction.cash_amt !== "0.00" &&
                              formatAmount(transaction.cash_amt)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            {transaction.online_amt !== "0.00" &&
                              formatAmount(transaction.online_amt)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            {transaction.cheque_amt !== "0.00" && (
                              <div>
                                {formatAmount(transaction.cheque_amt)}
                                {transaction.cheque_no && (
                                  <div className="text-xs text-gray-500">
                                    No: {transaction.cheque_no}
                                    {transaction.cheque_date &&
                                      ` | ${formatDate(
                                        transaction.cheque_date
                                      )}`}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-right">
                            {formatAmount(total)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Summary row */}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="4" className="py-3 px-4 text-sm text-right">
                        TOTAL
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        Cash: {formatAmount(totals.totalCash)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        Bank: {formatAmount(totals.totalBank)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        Cheque: {formatAmount(totals.totalCheque)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        Grand Total: {formatAmount(totals.grandTotal)}
                      </td>
                    </tr>
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

const TotalPayments = ({ isVisible }) => {
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
            <div className="flex items-center bg-green-600 text-white font-semibold text-base h-11 px-4 py-3 rounded-lg">
              <DateFilters onDateChange={handleDateChange} />
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

export default TotalPayments;
