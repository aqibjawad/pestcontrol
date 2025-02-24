"use client";

import React, { useState, useEffect, useRef } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { Skeleton } from "@mui/material";
import { AppHelpers } from "@/Helper/AppHelpers";
import DateFilters2 from "@/components/generic/DateFilters2";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListServiceTable = ({ startDate, endDate, tableRef }) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [totals, setTotals] = useState({
    cashTotal: 0,
    bankTotal: 0,
    chequeTotal: 0,
    grandTotal: 0,
  });

  const getAllCheques = async () => {
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
      const response = await api.getDataWithToken(
        `${company}/receives/get?${queryParams.join("&")}`
      );

      setQuoteList(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (acc, transaction) => {
        return {
          cashTotal: acc.cashTotal + parseFloat(transaction.cash_amt || 0),
          bankTotal: acc.bankTotal + parseFloat(transaction.online_amt || 0),
          chequeTotal:
            acc.chequeTotal + parseFloat(transaction.cheque_amt || 0),
          grandTotal:
            acc.grandTotal +
            (parseFloat(transaction.cash_amt || 0) +
              parseFloat(transaction.online_amt || 0) +
              parseFloat(transaction.cheque_amt || 0)),
        };
      },
      { cashTotal: 0, bankTotal: 0, chequeTotal: 0, grandTotal: 0 }
    );

    setTotals(totals);
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

  // Expose the table data and formatting functions through the ref
  React.useImperativeHandle(tableRef, () => ({
    getData: () => ({
      invoiceList,
      totals,
      formatAmount,
      formatDate,
    }),
  }));

  return (
    <div className={tableStyles.tableContainer}>
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        <table className="w-full bg-white">
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
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.entry_type === "cr"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.entry_type === "cr" ? "Credit" : "Debit"}
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
                              ` | ${formatDate(transaction.cheque_date)}`}
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
            {/* Total Row */}
            <tr className="bg-gray-50 font-semibold">
              <td colSpan="4" className="py-3 px-4 text-sm text-right">
                Total
              </td>
              <td className="py-3 px-4 text-sm text-right">
                {formatAmount(totals.cashTotal)}
              </td>
              <td className="py-3 px-4 text-sm text-right">
                {formatAmount(totals.bankTotal)}
              </td>
              <td className="py-3 px-4 text-sm text-right">
                {formatAmount(totals.chequeTotal)}
              </td>
              <td className="py-3 px-4 text-sm font-medium text-right">
                {formatAmount(totals.grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TotalRecieves = ({ isVisible }) => {
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
  const tableRef = useRef(null);

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

  const downloadPDF = () => {
    if (!tableRef.current) return;

    const { invoiceList, totals, formatAmount, formatDate } =
      tableRef.current.getData();

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Total Receives Report", 14, 15);

    // Add date range
    doc.setFontSize(10);
    doc.text(
      `Date Range: ${startDate || "N/A"} to ${endDate || "N/A"}`,
      14,
      25
    );

    const tableColumns = [
      "Sr.",
      "Date",
      "Description",
      "Type",
      "Cash Amount",
      "Bank Amount",
      "Cheque Amount",
      "Total",
    ];

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
        formatAmount(transaction.cash_amt),
        formatAmount(transaction.online_amt),
        formatAmount(transaction.cheque_amt),
        formatAmount(total),
      ];
    });

    // Add total row
    tableData.push([
      "",
      "",
      "Total",
      "",
      formatAmount(totals.cashTotal),
      formatAmount(totals.bankTotal),
      formatAmount(totals.chequeTotal),
      formatAmount(totals.grandTotal),
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
      footStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("total-receives-report.pdf");
  };

  return (
    <div className="h-full">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">Total Receives</div>
          <div className="flex items-center gap-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download size={18} />
              Download PDF
            </button>
            <div className="bg-green-600 text-white font-semibold text-base h-11 px-4 py-3 rounded-lg">
              <DateFilters2 onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <ListServiceTable
          handleDateChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          tableRef={tableRef}
        />
      </div>
    </div>
  );
};

export default TotalRecieves;
