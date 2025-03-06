"use client";

import React, { useState, useEffect, useRef } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import DateFilters from "@/components/generic/DateFilters";
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
        `${company}/receives/get?${queryParams.join("&")}`
      );

      setQuoteList(response.data);
      // Add this line to calculate totals
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

  React.useImperativeHandle(tableRef, () => ({
    getData: () => ({
      invoiceList,
      totals,
      formatAmount,
      formatDate,
    }),
  }));

  const SkeletonRow = () => (
    <tr>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto"></div>
      </td>
    </tr>
  );

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
            {loadingDetails ? (
              // Skeleton loader rows while loading
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : (
              // Actual data rows when loaded
              invoiceList?.map((transaction, index) => {
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
                      {transaction?.referenceable?.name || "Other Transactions"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
              })
            )}

            {/* Totals row with skeleton loading state */}
            <tr className="bg-gray-50 font-semibold">
              <td colSpan="5" className="py-3 px-4 text-sm text-right">
                Total
              </td>
              <td className="py-3 px-4 text-sm text-right">
                {loadingDetails ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 ml-auto"></div>
                ) : (
                  <>Cash: {formatAmount(totals.cashTotal)}</>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-right">
                {loadingDetails ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 ml-auto"></div>
                ) : (
                  <>Bank: {formatAmount(totals.bankTotal)}</>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-right">
                {loadingDetails ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 ml-auto"></div>
                ) : (
                  <>Cheque: {formatAmount(totals.chequeTotal)}</>
                )}
              </td>
              <td className="py-3 px-4 text-sm font-medium text-right">
                {loadingDetails ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 ml-auto"></div>
                ) : (
                  <>Grand Total: {formatAmount(totals.grandTotal)}</>
                )}
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

  // Generate PDF from table data
  const downloadPDF = () => {
    // Get data from table component using ref
    if (!tableRef.current) return;

    const { invoiceList, totals, formatAmount, formatDate } =
      tableRef.current.getData();

    if (!invoiceList || invoiceList.length === 0) {
      console.warn("No data available to generate PDF");
      return;
    }

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
      doc.text("Total Receives Report", detailsX, detailsY, { align: "left" });

      doc.setFontSize(11);
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
      doc.text("Total Receives Report", 15, 70);

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
        formatAmount(totals.cashTotal),
        formatAmount(totals.bankTotal),
        formatAmount(totals.chequeTotal),
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

      doc.save("total_receives_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could add error handling here, such as displaying a notification
    }
  };

  return (
    <div className="">
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
            <div className="bg-green-600 text-white font-semibold text-base h-11 px-4 flex items-center rounded-lg">
              <DateFilters onDateChange={handleDateChange} />
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
