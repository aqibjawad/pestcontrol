"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/invoiceDetails.module.css";
import { Cheques } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { Skeleton, Modal, Box, Select, MenuItem } from "@mui/material";
import { AppHelpers } from "@/Helper/AppHelpers";
import DateFilters2 from "@/components/generic/DateFilters2";
import { startOfMonth, endOfMonth, format } from "date-fns";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

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
  const formatDate = (dateString) => {
    try {
      return AppHelpers.convertDate(dateString);
    } catch (error) {
      console.error("Error converting date:", error);
      return dateString;
    }
  };

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
        `${Cheques}/pay/pending?${queryParams.join("&")}`
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

  useEffect(() => {
    const total = filteredList?.reduce(
      (sum, item) => sum + (Number(item.cheque_amount) || 0),
      0
    );
    setTotalChequeAmount(total);
  }, [filteredList]);

  const handleCreateClick = (rowId) => {
    setSelectedRowId(rowId);
    setIsCreateModalOpen(true);
  };

  const [cheque_date, setChequeDate] = useState("");

  const handleChequeDateChange = (name, value) => {
    setChequeDate(value);
  };

  const handleCreateSubmit = async () => {
    try {
      const requestData = {
        id: selectedRowId,
        status: selectedStatus,
        date: cheque_date,
        deferred_reason: rejectReason,
      };

      await api.postFormDataWithToken(`${Cheques}/status/change`, requestData);

      await getAllCheques();
      setIsCreateModalOpen(false);
      setNewChequeDate("");
      setSelectedRowId(null);
      setSelectedStatus("");
    } catch (error) {
      console.error("Error updating cheque:", error);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSelectedRowId(null);
    setNewChequeDate("");
  };

  const [selectedStatus, setSelectedStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Handler for status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // For Pay action
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");

  const handlePayClick = (rowId) => {
    setSelectedRowId(rowId);
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = async () => {
    try {
      const requestData = {
        id: selectedRowId,
        status: "paid",
        date: paymentDate,
      };

      await api.postFormDataWithToken(
        `${bank}/cheques/status/change`,
        requestData
      );
      await getAllCheques();
      setIsPayModalOpen(false);
      setPaymentDate("");
      setSelectedRowId(null);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleClosePayModal = () => {
    setIsPayModalOpen(false);
    setSelectedRowId(null);
    setPaymentDate("");
  };

  // For Return action
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const handleReturnClick = (rowId) => {
    setSelectedRowId(rowId);
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = async () => {
    try {
      const requestData = {
        id: selectedRowId,
        status: "returned",
        deferred_reason: returnReason,
      };

      await api.postFormDataWithToken(
        `${bank}/cheques/status/change`,
        requestData
      );
      await getAllCheques();
      setIsReturnModalOpen(false);
      setReturnReason("");
      setSelectedRowId(null);
    } catch (error) {
      console.error("Error returning cheque:", error);
    }
  };

  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setSelectedRowId(null);
    setReturnReason("");
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
            {/* Table Header */}
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
                      style={{ width: "15%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Cheque Date
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Cheque No
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Payment Date
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Reference Category
                    </th>
                    <th
                      style={{ width: "10%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Reference
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Cheque Amount
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Scrollable Table Body */}
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
                          {Array.from({ length: 7 }).map((_, colIndex) => (
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
                    : filteredList?.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            {index + 1}
                          </td>
                          <td style={{ width: "15%" }} className="py-2 px-4">
                            {row?.cheque_date || "N/A"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row.cheque_no || 0}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row.updated_at
                              ? new Date(row.updated_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row.entry_type === "supplier_payment"
                              ? "Supplier"
                              : row.entry_type === "expense_payment"
                              ? "Expense"
                              : "Expense"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row.linkable?.supplier_name ||
                              row.linkable?.expense_name}
                          </td>

                          <td style={{ width: "15%" }} className="py-2 px-4">
                            {row?.cheque_amount || "N/A"}
                          </td>
                          <td style={{ width: "15%" }} className="py-2 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePayClick(row.id)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Pay
                              </button>
                              <button
                                onClick={() => handleReturnClick(row.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Return
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

const PayableCheques = ({ isVisible }) => {
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
              Payable Cheques
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

export default PayableCheques;
