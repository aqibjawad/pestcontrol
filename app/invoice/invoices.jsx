"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { serviceInvoice, getAllEmpoyesUrl } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Skeleton from "@mui/material/Skeleton";
import { AppHelpers } from "@/Helper/AppHelpers";
import Link from "next/link";
import DateFilters2 from "@/components/generic/DateFilters2";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import AssignmentModal from "./assignRecovery";
import PayModal from "./payModal";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Menu,
  MenuItem,
  TableBody,
  IconButton,
} from "@mui/material";

const ListServiceTable = ({
  startDate,
  endDate,
  updateTotalAmount,
  statusFilter,
  selectedReference,
  setReferenceOptions,
  referenceOptions,
  searchQuery,
  setSearchQuery,
  setSelectedReference,
}) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [invoiceAllList, setInvoiceList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesManagers, setSalesManagers] = useState([]);
  const [isModalOpenPay, setIsModalOpenPay] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [jobIdInput, setJobIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssignClick = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsModalOpen(true);
  };

  const handleClickPay = (row) => {
    setSelectedInvoiceId(row.id);
    setSelectedInvoice(row);
    setIsModalOpenPay(true);
  };

  const handleAssignment = async (invoiceId, managerId) => {
    try {
      console.log(`Assigned invoice ${invoiceId} to manager ${managerId}`);
      setIsModalOpen(false);
      await getAllQuotes();
    } catch (error) {
      console.error("Error assigning invoice:", error);
    }
  };

  const handlePay = async () => {
    try {
      console.log(`Processing invoice ${selectedInvoice.id}`);
      console.log("Complete invoice data:", selectedInvoice);

      setIsModalOpenPay(false);
      await getAllQuotes();
    } catch (error) {
      console.error("Error processing invoice:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return AppHelpers.convertDate(dateString);
    } catch (error) {
      console.error("Error converting date:", error);
      return dateString;
    }
  };

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
      const response = await api.getDataWithToken(
        `${serviceInvoice}?${queryParams.join("&")}`
      );

      setInvoiceList(response?.data);

      // Collect unique values for reference dropdown
      const allReferences = new Set();

      response.data.forEach((invoice) => {
        const referenceName = invoice?.user?.client?.referencable?.name;
        if (referenceName) allReferences.add(referenceName);
      });

      // Update reference options
      setReferenceOptions(Array.from(allReferences));

      let filteredData = [...response.data];

      // Apply filters independently

      // Reference filter (if selected)
      if (selectedReference && selectedReference !== "all") {
        filteredData = filteredData.filter(
          (invoice) =>
            invoice?.user?.client?.referencable?.name === selectedReference
        );
      }

      // Search filter (independent of reference selection)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter((invoice) => {
          const area = (invoice?.address?.area || "").toLowerCase();
          const firmName = (
            invoice?.user?.client?.firm_name || ""
          ).toLowerCase();
          const clientName = (invoice?.user?.name || "").toLowerCase();
          return (
            area.includes(query) ||
            firmName.includes(query) ||
            clientName.includes(query)
          );
        });
      }

      // Status filter
      if (statusFilter && statusFilter !== "all") {
        filteredData = filteredData.filter(
          (invoice) =>
            invoice.status.toLowerCase() === statusFilter.toLowerCase()
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

  const getAllSalesManagers = async () => {
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/recovery_officer/get`
      );

      const managers = response.data || [];
      setSalesManagers(managers);
    } catch (error) {
      console.error("Error fetching sales managers:", error);
    }
  };

  useEffect(() => {
    getAllSalesManagers();
  }, []);

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate, statusFilter, selectedReference, searchQuery]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    getAllQuotes();
  };

  const handleInvoiceIdSearch = async () => {
    if (!jobIdInput.trim()) {
      // If no input, reset to full list
      await getAllQuotes();
      return;
    }

    try {
      setLoading(true);

      // Create a new array with only the invoice that matches the ID
      const filteredInvoices = invoiceList.filter(
        (invoice) =>
          invoice.service_invoice_id
            .toLowerCase()
            .includes(jobIdInput.toLowerCase()) ||
          invoice.id.toString().includes(jobIdInput)
      );

      setQuoteList(filteredInvoices);
      updateTotalAmount(filteredInvoices);
    } catch (error) {
      console.error("Error searching invoice:", error);
      setQuoteList([]);
      updateTotalAmount([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInvoiceIdSearch();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* Left side with filter elements */}
        <div className="flex-grow flex items-center gap-2">
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

          <input
            type="text"
            placeholder="Search by area, firm or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />

          <div className="flex items-center">
            <input
              type="text"
              value={jobIdInput}
              onChange={(e) => setJobIdInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter invoice ID"
              className="h-10 px-3 border border-green-500 rounded-lg focus:outline-none focus:border-green-700"
            />
            <button
              onClick={handleInvoiceIdSearch}
              className="ml-2 h-10 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right side with export buttons */}
        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download size={16} />
            Excel
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={16} />
            CSV
          </button>
        </div>
      </div>

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
              <table
                className="min-w-full bg-white"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th
                      style={{ width: "5%" }}
                      className="py-5 px-4 border-b border-gray-200 text-left"
                    >
                      Sr.
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Invoice Issue Date
                    </th>
                    <th
                      style={{ width: "12%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Client
                    </th>
                    <th
                      style={{ width: "12%" }}
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
                      Cheque Date
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Bank ID
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Assign To
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Paid Amount
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Total Amount
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Status
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Send Email
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      View
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Assign
                    </th>
                    <th
                      style={{ width: "8%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      View
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            <div
              style={{ overflowY: "auto", maxHeight: "500px" }}
              className="overflow-x-auto"
            >
              <table
                className="min-w-full bg-white"
                style={{ tableLayout: "fixed" }}
              >
                <tbody>
                  {loadingDetails
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          {Array.from({ length: 14 }).map((_, colIndex) => (
                            <td key={colIndex} className="py-2 px-4">
                              <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={20}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    : invoiceList?.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            {index + 1}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {formatDate(row.issued_date)}
                          </td>
                          <td style={{ width: "12%" }} className="py-2 px-4">
                            {row?.user?.name || "N/A"}
                          </td>
                          <td style={{ width: "12%" }} className="py-2 px-4">
                            {row?.user?.client?.firm_name || "N/A"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row?.user?.client?.referencable?.name || "N/A"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row?.advance_cheques?.[0]?.cheque_date || "N/A"}
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            {row?.advance_cheques?.[0]?.bank?.bank_name ||
                              "N/A"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row?.assigned_recovery_officer?.name || "N/A"}
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            {row.paid_amt || 0}
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            {row.total_amt || 0}
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            <div
                              className={
                                row.status.toLowerCase() === "paid"
                                  ? "text-green-600"  
                                  : "text-red-600"
                              }
                            >
                              {row.status.toLowerCase() === "paid"
                                ? "Received"
                                : "Pending"}
                            </div>

                            <div>
                              {row.is_taken_cheque === 1 ? "Cheque Taken" : ""}
                            </div>
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            <Link href={`/invoiceDetails?id=${row.id}`}>
                              <span className="text-blue-600 hover:text-blue-800">
                                Send Email
                              </span>
                            </Link>
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            <Link href={`/recovery/viewHistory?id=${row.id}`}>
                              <span className="text-blue-600 hover:text-blue-800">
                                View History
                              </span>
                            </Link>
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            <button
                              onClick={() => handleAssignClick(row.id)}
                              className={`text-blue-600 hover:text-blue-800 ${
                                row.status.toLowerCase() === "paid"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={row.status.toLowerCase() === "paid"}
                            >
                              Assign
                            </button>

                            <button
                              onClick={() => handleClickPay(row)}
                              className={`text-blue-600 hover:text-blue-800 ${
                                row.status.toLowerCase() === "paid"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={row.status.toLowerCase() === "paid"}
                            >
                              Pay
                            </button>
                          </td>
                          <td style={{ width: "8%" }} className="py-2 px-4">
                            <Link href={`/invoiceDetailsPdf?id=${row.id}`}>
                              <span className="text-blue-600 hover:text-blue-800">
                                View Details
                              </span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AssignmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceId={selectedInvoiceId}
        salesManagers={salesManagers}
        onAssign={handleAssignment}
        onRefresh={handleRefresh}
      />

      <PayModal
        open={isModalOpenPay}
        onClose={() => setIsModalOpenPay(false)}
        invoiceId={selectedInvoiceId}
        invoiceData={selectedInvoice}
        onAssign={handlePay}
        onRefresh={handleRefresh}
      />
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
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedFirmName, setSelectedFirmName] = useState("all");
  const [areaOptions, setAreaOptions] = useState([]);
  const [firmNameOptions, setFirmNameOptions] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

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
              Received
            </button>
            <button
              onClick={() => setStatusFilter("unpaid")}
              className={`px-6 py-2 rounded-lg ${
                statusFilter === "unpaid"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Pending
            </button>
          </div>
          <div className="flex gap-4">
            {urlStartDate ? (
              <div>
                <p>Start Date: {urlStartDate}</p>
                <p>End Date: {urlEndDate || "Not Set"}</p>
              </div>
            ) : (
              <div className=" bg-green-600 text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg">
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
            setSelectedReference={setSelectedReference}
            isVisible={isVisible}
            setReferenceOptions={setReferenceOptions}
            referenceOptions={referenceOptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
