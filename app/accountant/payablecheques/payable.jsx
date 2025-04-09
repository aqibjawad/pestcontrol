"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/invoiceDetails.module.css";
import { Cheques } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { Skeleton, Modal, Box, Select, MenuItem, CircularProgress } from "@mui/material";
import { AppHelpers } from "@/Helper/AppHelpers";
import DateFilters2 from "@/components/generic/DateFilters2";
import { startOfMonth, endOfMonth, format } from "date-fns";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import InputWithTitle from "@/components/generic/InputWithTitle";

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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

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
      setPaymentLoading(true);
      const requestData = {
        id: selectedRowId,
        status: "paid",
        date: cheque_date,
        deferred_reason: rejectReason,
      };

      // Only append if rejectReason exists
      if (rejectReason) {
        requestData.append("deferred_reason", rejectReason);
      }

      const response = await api.postFormDataWithToken(
        `${Cheques}/status/change`,
        requestData
      );

      console.log("Payment response:", response); // Add logging

      await getAllCheques(); // Refresh the list
      setIsPayModalOpen(false);
      setChequeDate("");
      setSelectedRowId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      // You might want to show an error message to the user here
    } finally {
      setPaymentLoading(false);
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
      setReturnLoading(true);
      const requestData = {
        id: selectedRowId,
        status: "deferred",
        date: cheque_date,
        deferred_reason: returnReason,
      };

      const response = await api.postFormDataWithToken(
        `${Cheques}/status/change`,
        requestData
      );
      await getAllCheques();
      setIsReturnModalOpen(false);
      setReturnReason("");
      setSelectedRowId(null);
    } catch (error) {
      console.error("Error returning cheque:", error);
    } finally {
      setReturnLoading(false);
    }
  };

  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setSelectedRowId(null);
    setReturnReason("");
  };

  const handleChequeDateChange = (name, value) => {
    setChequeDate(value);
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

          {/* Pay Modal with CircularProgress */}
          <Modal
            open={isPayModalOpen}
            onClose={() => setIsPayModalOpen(false)}
            aria-labelledby="pay-modal-title"
          >
            <Box sx={modalStyle}>
              <h2 id="pay-modal-title" className="text-xl font-bold mb-4">
                Process Payment
              </h2>
              <div className="mb-4">
                <InputWithTitle3
                  onChange={handleChequeDateChange}
                  value={cheque_date}
                  type="date"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={paymentLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaySubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 relative"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <span className="opacity-0">Confirm Payment</span>
                      <CircularProgress 
                        size={24} 
                        className="absolute left-1/2 top-1/2 -ml-3 -mt-3" 
                        color="inherit" 
                      />
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </div>
            </Box>
          </Modal>

          {/* Return Modal with CircularProgress */}
          <Modal
            open={isReturnModalOpen}
            onClose={() => setIsReturnModalOpen(false)}
            aria-labelledby="return-modal-title"
          >
            <Box sx={modalStyle}>
              <h2 id="return-modal-title" className="text-xl font-bold mb-4">
                Return Cheque
              </h2>
              <div className="mb-4">
                <div className="mb-4">
                  <InputWithTitle3
                    onChange={handleChequeDateChange}
                    value={cheque_date}
                    type="date"
                  />
                </div>

                <InputWithTitle
                  title="Return Reason"
                  type="text"
                  value={returnReason}
                  onChange={setReturnReason}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={returnLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnSubmit}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 relative"
                  disabled={returnLoading || !returnReason}
                >
                  {returnLoading ? (
                    <>
                      <span className="opacity-0">Confirm Return</span>
                      <CircularProgress 
                        size={24} 
                        className="absolute left-1/2 top-1/2 -ml-3 -mt-3" 
                        color="inherit" 
                      />
                    </>
                  ) : (
                    "Confirm Return"
                  )}
                </button>
              </div>
            </Box>
          </Modal>
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