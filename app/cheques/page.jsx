"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
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
        `${Cheques}/pending?${queryParams.join("&")}`
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
    const total = filteredList.reduce(
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
      console.log("Selected Row ID:", selectedRowId);
      console.log("Selected Status:", selectedStatus);
      console.log("Selected Date:", newChequeDate);

      // Now both status and date are passed as URL parameters
      await api.getDataWithToken(
        `${Cheques}/status/change/${selectedRowId}/${selectedStatus}/${cheque_date}`
      );

      await getAllCheques();
      setIsCreateModalOpen(false);
      setNewChequeDate("");
      setSelectedRowId(null);
      setSelectedStatus(""); // Reset status after submission
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

  // Handler for status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
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
                      Name
                    </th>
                    <th
                      style={{ width: "15%" }}
                      className="py-2 px-4 border-b border-gray-200 text-left"
                    >
                      Bank Name
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
                      Settelment Amount
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
                          {Array.from({ length: 11 }).map((_, colIndex) => (
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
                            {row?.user?.name}
                          </td>
                          <td style={{ width: "15%" }} className="py-2 px-4">
                            {row?.bank?.bank_name}
                          </td>
                          <td style={{ width: "15%" }} className="py-2 px-4">
                            {row?.cheque_amount || "N/A"}
                          </td>
                          <td style={{ width: "15%" }} className="py-2 px-4">
                            {row?.cheque_date || "N/A"}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row.cheque_no || 0}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            {row.settlement_amt || 0}
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            <div
                              className={
                                row.status.toLowerCase() === "paid"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {row.status}
                            </div>
                          </td>
                          <td style={{ width: "10%" }} className="py-2 px-4">
                            <button
                              onClick={() => handleCreateClick(row.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                            >
                              Pay
                            </button>
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
            {totalChequeAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="create-modal-title"
        aria-describedby="create-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="create-modal-title" className="text-xl font-semibold mb-4">
            Update Cheque
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <InputWithTitle3
              onChange={handleChequeDateChange}
              value={cheque_date}
              type="date"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              fullWidth
              className="bg-white"
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="deferred">Deferred</MenuItem>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
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
              Advance Cheques
            </div>
          </div>

          {/* Date filter aligned to the right */}
          <div className="flex items-center gap-4">
            {/* Reference Dropdown */}
            <select
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
            </select>

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

export default Invoices;
