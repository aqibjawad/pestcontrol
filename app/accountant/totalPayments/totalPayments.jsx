"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { company } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { Skeleton } from "@mui/material";
import { AppHelpers } from "@/Helper/AppHelpers";
import DateFilters2 from "@/components/generic/DateFilters2";
import { startOfMonth, endOfMonth, format } from "date-fns";

const ListServiceTable = ({
  startDate,
  endDate,
  selectedReference,
  setReferenceOptions,
}) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [filteredList, setFilteredList] = useState([]);
  const [newChequeDate, setNewChequeDate] = useState("");
  const [totalChequeAmount, setTotalChequeAmount] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

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
        `${company}/payments/get?${queryParams.join("&")}`
      );

      setQuoteList(response.data);

      const allReferences = new Set();
      response.data.forEach((banks) => {
        const referenceBank = banks?.bank?.bank_name;
        if (referenceBank) allReferences.add(referenceBank);
      });
      setReferenceOptions(Array.from(allReferences));
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedReference === "all") {
      setFilteredList(invoiceList);
    } else {
      const filtered = invoiceList.filter(
        (item) => item?.bank?.bank_name === selectedReference
      );
      setFilteredList(filtered);
    }
  }, [selectedReference, invoiceList]);

  useEffect(() => {
    getAllCheques();
  }, [startDate, endDate]);

  const generateExportData = () => {
    return invoiceList.map((row, index) => ({
      "Sr.": index + 1,
      "Invoice Issue Date": formatDate(row.issued_date),
      Client: row?.user?.name || "N/A",
      "Firm Name": row?.user?.client?.firm_name || "N/A",
      Reference: row?.user?.client?.referencable?.name || "N/A",
      "Paid Amount": row.paid_amt || 0,
      "Total Amount": row.total_amt || 0,
      Status: row.status,
    }));
  };

  const downloadCSV = () => {
    const data = generateExportData();
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices_${startDate}_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, `invoices_${startDate}_${endDate}.xlsx`);
  };

  const downloadPDF = () => {
    const img = new Image();
    img.src = "/logo.jpeg";

    img.onload = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 50;
      const logoHeight = (img.height * logoWidth) / img.width;
      const xPosition = (pageWidth - logoWidth) / 2;

      doc.addImage(img, "jpeg", xPosition, 10, logoWidth, logoHeight);
      doc.setFontSize(12);
      doc.text(`Invoices`, pageWidth / 2, logoHeight + 20, {
        align: "center",
      });
      doc.text(
        `Date Range: ${startDate || "All"} to ${endDate || "All"}`,
        pageWidth / 2,
        logoHeight + 30,
        { align: "center" }
      );

      const data = generateExportData();
      const headers = Object.keys(data[0]);
      const rows = data.map((row) => Object.values(row));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: logoHeight + 40,
        margin: { top: logoHeight + 40 },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [50, 169, 46] },
      });

      doc.save(`transactions_${startDate || "all"}_${endDate || "all"}.pdf`);
    };
  };

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
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "500px",
          }}
        >
          <div className="relative">
            <div className="overflow-x-auto">
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
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="4"
                      className="py-3 px-4 text-sm font-semibold text-right"
                    >
                      Total Balances:
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-right">
                      {formatAmount(invoiceList[0]?.cash_balance)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-right">
                      {formatAmount(invoiceList[0]?.bank_balance)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-right">
                      {formatAmount(invoiceList[0]?.cheque_amt)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-right">
                      {formatAmount(
                        parseFloat(invoiceList[0]?.cash_balance || 0) +
                          parseFloat(invoiceList[0]?.bank_balance || 0) +
                          parseFloat(invoiceList[0]?.cheque_amt || 0)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-right">
          <span className="font-semibold">Total Cheque Amount: </span>
          <span className="text-green-600 font-bold">
            {totalChequeAmount?.toLocaleString()}
          </span>
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

  const [selectedReference, setSelectedReference] = useState("all");
  const [referenceOptions, setReferenceOptions] = useState([]);

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
            {/* Reference Dropdown */}
            {/* <select
              value={selectedReference}
              onChange={(e) => setSelectedReference(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Banks</option>
              {referenceOptions.map((reference, index) => (
                <option key={index} value={reference}>
                  {reference}
                </option>
              ))}
            </select> */}

            {/* Date Filter Component */}
            <div className="flex items-center bg-green-600 text-white font-semibold text-base h-11 px-4 py-3 rounded-lg">
              <DateFilters2 onDateChange={handleDateChange} />
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
            selectedReference={selectedReference}
            setReferenceOptions={setReferenceOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalPayments;
