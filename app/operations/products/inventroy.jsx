import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { product } from "@/networkUtil/Constants";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Skeleton,
  Button,
} from "@mui/material";
import { format, isWithinInterval, parseISO } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Image from "next/image";

import DateFilters2 from "@/components/generic/DateFilters2";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Inventory = () => {
  const api = new APICall();
  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState(null);
  const [stockHistory, setStockHistory] = useState(null);
  const [stockBuy, setStockBuy] = useState(null);
  const [stocks, setStocks] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllEmployees(id);
    }
  }, [id]);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}/${id}`);
      setEmployeeList(response.data);
      setStockHistory(response.data.assigned_stock_history || []);
      setStockBuy(response.data.delivery_note_history || []);
      setStocks(response.data.stocks || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const filterDataByDate = (data) => {
    if (!startDate || !endDate || !data) return data;

    return data.filter((item) => {
      const itemDate = parseISO(item.updated_at);
      return isWithinInterval(itemDate, { start: startDate, end: endDate });
    });
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const downloadPDF = (tableData, columns, title) => {
    const filteredData = filterDataByDate(tableData);
    const doc = new jsPDF();
  
    // Add logo on the left
    const logoWidth = 45;
    const logoHeight = 30;
    const logoX = 15;
    const logoY = 15;
    doc.addImage("/logo.jpeg", "PNG", logoX, logoY, logoWidth, logoHeight);
  
    // Page width calculation (A4 width in points = 210mm)
    const pageWidth = doc.internal.pageSize.width;
  
    // Add product details on the right without extra space
    const detailsX = pageWidth - 80;
    const detailsY = logoY + 5;
    const lineHeight = 6; // Reduced line height for less spacing
  
    if (startDate && endDate) {
      doc.text(
        `Date Range: ${format(startDate, "MMM d, yyyy")} - ${format(
          endDate,
          "MMM d, yyyy"
        )}`,
        15,
        60
      );
    }
  
    // Increase font size for Product Name
    doc.setFontSize(13);
    doc.text(`Product Name: ${(employeeList?.product_name || "N/A").toUpperCase()}`, detailsX, detailsY, { align: "left" });
  
    // Reset font size for other details
    doc.setFontSize(11);
  
    const productDetails = [
      `Batch Number: ${employeeList?.batch_number || "N/A"}`,
      `Total Quantity: ${stocks?.[0]?.total_qty || "N/A"}`,
      `Remaining Quantity: ${stocks?.[0]?.remaining_qty || "N/A"}`,
    ];
  
    productDetails.forEach((text, index) => {
      doc.text(text, detailsX, detailsY + (index + 1) * lineHeight, { align: "left" });
    });
  
    // Add title below the header section
    doc.setFontSize(18);
    doc.text(title, 15, 70);
  
    // Table Headers and Data
    const headers = columns.map((col) => col.header);
    const data = filteredData.map((row) => columns.map((col) => row[col.key]));
  
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74], textColor: 255 }, // #16A34A (Green)
    });
  
    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };
  

  const downloadExcel = (tableData, columns, title) => {
    const filteredData = filterDataByDate(tableData);

    // Prepare data with proper headers
    const data = filteredData.map((row) =>
      columns.reduce(
        (acc, col) => ({
          ...acc,
          [col.header]: row[col.key],
        }),
        {}
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(
      workbook,
      `${title.toLowerCase().replace(/\s+/g, "-")}.xlsx`
    );
  };

  const DownloadButtons = ({ data, columns, title }) => (
    <div className="flex gap-4 mb-4">
      <button
        onClick={() => downloadPDF(data, columns, title)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <span className="mr-2">Download PDF</span>
      </button>
      <button
        onClick={() => downloadExcel(data, columns, title)}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <span className="mr-2">Download Excel</span>
      </button>
    </div>
  );

  const CurrentStockTable = () => {
    const columns = [
      { header: "Sr No", key: "srNo" },
      { header: "Date", key: "date" },
      { header: "Person Name", key: "personName" },
      { header: "Assigned Stock", key: "totalStock" },
    ];

    const tableData =
      stockHistory?.map((row, index) => ({
        srNo: index + 1,
        date: format(new Date(row.updated_at), "MMMM d, yyyy"),
        personName: row?.person?.name || "",
        totalStock: row.stock_in,
        updated_at: row.updated_at, // Keep the original date for filtering
      })) || [];

    const filteredData = filterDataByDate(tableData);

    return (
      <>
        <DownloadButtons
          data={tableData}
          columns={columns}
          title="Assignment History"
        />
        <div className={tableStyles.tableContainer}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="py-5 px-4 border-b border-gray-200 text-left"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetchingData
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      {columns.map((_, colIndex) => (
                        <td key={colIndex} className="py-2 px-4">
                          <Skeleton width="100%" height={30} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filteredData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-5 px-4">{row.date}</td>
                      <td className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row.personName}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row.totalStock}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const StockHistoryTable = () => {
    const columns = [
      { header: "Date", key: "date" },
      { header: "Purchase Order Invoice", key: "invoice" },
      { header: "Supplier Name", key: "personName" },
      { header: "Quantity", key: "quantity" },
    ];

    const tableData =
      stockBuy?.map((row) => ({
        date: format(new Date(row.updated_at), "MMMM d, yyyy"),
        invoice: row?.delivery_note?.dn_id || "",
        personName: row?.delivery_note?.supplier?.supplier_name || "",
        quantity: row.quantity,
        updated_at: row.updated_at, // Keep the original date for filtering
      })) || [];

    const filteredData = filterDataByDate(tableData);

    return (
      <>
        <DownloadButtons
          data={tableData}
          columns={columns}
          title="Stock History Report"
        />
        <div className={tableStyles.tableContainer}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="py-5 px-4 border-b border-gray-200 text-left"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetchingData
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      {columns.map((_, colIndex) => (
                        <td key={colIndex} className="py-2 px-4">
                          <Skeleton width="100%" height={30} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filteredData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-5 px-4">{row.date}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            row.transaction_type === "IN"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.invoice}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className={tableStyles.clientContact}>
                          {row.personName}
                        </div>
                      </td>
                      <td className="py-2 px-4">{row.quantity}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          {fetchingData ? (
            <Skeleton
              variant="rectangular"
              width={269}
              height={493}
              sx={{ borderRadius: "8px" }}
            />
          ) : (
            <img
              src={employeeList?.product_picture}
              style={{
                width: "200px",
                height: "200px",
                left: "315px",
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div className="col-span-6">
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                {fetchingData ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton width="100%" height={30} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="100%" height={30} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    <TableRow>
                      <TableCell>
                        <strong>Product Name:</strong>
                      </TableCell>
                      <TableCell>{employeeList?.product_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Batch Number:</strong>
                      </TableCell>
                      <TableCell>{employeeList?.batch_number}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Manufacture Date:</strong>
                      </TableCell>
                      <TableCell>{employeeList?.mfg_date}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Unit:</strong>
                      </TableCell>
                      <TableCell>{employeeList?.unit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Total Quantity:</strong>
                      </TableCell>
                      <TableCell>
                        {stocks && stocks.length > 0
                          ? stocks[0].total_qty
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Remaining Quantity:</strong>
                      </TableCell>
                      <TableCell>
                        {stocks && stocks.length > 0
                          ? stocks[0].remaining_qty
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="mt-5">
        <div style={{ fontSize: "20px", color: "#333333" }}>Product uses</div>

        {/* Tab buttons */}
        <div className="flex gap-4 mb-4 mt-5">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "current"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock Assigned
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "history"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock Purchased
          </button>
          <div className="flex items-center bg-green-600 text-white font-semibold text-base h-11 px-4 py-3 rounded-lg">
            <DateFilters2 onDateChange={handleDateChange} />
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-5">
          {activeTab === "current" && <CurrentStockTable />}
          {activeTab === "history" && <StockHistoryTable />}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
