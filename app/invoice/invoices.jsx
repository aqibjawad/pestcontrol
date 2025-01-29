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

const ListServiceTable = ({
  startDate,
  endDate,
  updateTotalAmount,
  statusFilter,
  selectedReference,
  isVisible,
  setReferenceOptions,
  setAreaOptions,
  setFirmNameOptions,
  selectedArea,
  selectedFirmName,
}) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [brandsList, setBrandsList] = useState([]);
  const [referenceList, setReferenceList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [salesManagers, setSalesManagers] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [firmNameList, setFirmNameList] = useState([]);

  const handleAssignClick = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsModalOpen(true);
  };

  const handleAssignment = async (invoiceId, managerId) => {
    try {
      // Add your API call here
      console.log(`Assigned invoice ${invoiceId} to manager ${managerId}`);
      setIsModalOpen(false);
      await getAllQuotes();
    } catch (error) {
      console.error("Error assigning invoice:", error);
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
      doc.text(`Approved Payments Report`, pageWidth / 2, logoHeight + 20, {
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

      // Collect unique values for dropdowns
      const allReferences = new Set();
      const allAreas = new Set();
      const allFirmNames = new Set();

      response.data.forEach((invoice) => {
        const referenceName = invoice?.user?.client?.referencable?.name;
        if (referenceName) allReferences.add(referenceName);

        const area = invoice?.address?.area;
        if (area) allAreas.add(area);

        const firmName = invoice?.user?.client?.firm_name;
        if (firmName) allFirmNames.add(firmName);
      });

      // Update dropdown options
      setReferenceOptions(Array.from(allReferences));
      setAreaOptions(Array.from(allAreas));
      setFirmNameOptions(Array.from(allFirmNames));

      // Apply filters
      let filteredData = response.data;

      // Apply each filter independently
      if (selectedReference && selectedReference !== "all") {
        filteredData = filteredData.filter(
          (invoice) =>
            invoice?.user?.client?.referencable?.name === selectedReference
        );
      }

      if (selectedArea && selectedArea !== "all") {
        filteredData = filteredData.filter(
          (invoice) => invoice?.address?.area === selectedArea
        );
      }

      if (selectedFirmName && selectedFirmName !== "all") {
        filteredData = filteredData.filter(
          (invoice) => invoice?.user?.client?.firm_name === selectedFirmName
        );
      }

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
  }, [
    startDate,
    endDate,
    statusFilter,
    selectedReference,
    selectedArea,
    selectedFirmName,
  ]);

  return (
    <div>
      <div className="flex gap-2 mb-4 justify-end">
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

      <div className={tableStyles.tableContainer}>
        <div
          style={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "500px",
          }}
        >
          <table
            className="min-w-full bg-white"
            style={{ tableLayout: "fixed" }}
          >
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
                <th
                  style={{ width: "10%" }}
                  className="py-2 px-4 border-b border-gray-200 text-left"
                >
                  Assign
                </th>
              </tr>
            </thead>
          </table>

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
                        <td style={{ width: "10%" }} className="py-2 px-4">
                          <div className={tableStyles.clientContact}>
                            <button
                              onClick={() => handleAssignClick(row.id)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AssignmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceId={selectedInvoiceId}
        salesManagers={salesManagers}
        onAssign={handleAssignment}
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

            <div className="flex items-center gap-2">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Areas</option>
                {areaOptions.map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedFirmName}
                onChange={(e) => setSelectedFirmName(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Firms</option>
                {firmNameOptions.map((firmName, index) => (
                  <option key={index} value={firmName}>
                    {firmName}
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
              <div className="text-white font-semibold text-base h-11 w-52 flex justify-center items-center px-4 py-3 rounded-lg">
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
            setAreaOptions={setAreaOptions}
            setFirmNameOptions={setFirmNameOptions}
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
