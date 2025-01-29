"use client";

import React, { useEffect, useState } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import { format } from "date-fns";
import DateFilters from "../../../components/generic/DateFilters";
import withAuth from "@/utils/withAuth";
import AddStockModal from "./addStkQnt";

// Import export libraries
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Page = () => {
  const apiCall = new APICall();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [suppliersList, setSuppliersList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getSuppliers();
  }, [startDate, endDate]);

  const getSuppliers = async () => {
    setFetchingData(true);
    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await apiCall.getDataWithToken(
        `${product}?${queryParams.join("&")}`
      );
      setSuppliersList(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const generateExportData = () => {
    return suppliersList.map((row, index) => {
      const stock = row.stocks[0] || {};
      const remainingQty =
        (stock.remaining_qty || 0) * (stock.per_item_qty || 1);

      return {
        "Sr No": index + 1,
        "Product Name": row.product_name || "N/A",
        "Product Type": row.product_type || "N/A",
        "Batch Number": row.batch_number || "N/A",
        "Total Quantity": stock.total_qty || 0,
        "Remaining Quantity": `${remainingQty} ${stock.unit || ""}`,
      };
    });
  };

  // Export Functions
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Logo original dimensions
    const originalWidth = 397;
    const originalHeight = 175;

    // Desired width for PDF (adjust as needed)
    const pdfWidth = 50;
    const aspectRatio = originalHeight / originalWidth;
    const pdfHeight = pdfWidth * aspectRatio; // Maintain aspect ratio

    // Add logo
    const img = new Image();
    img.src = "/logo.jpeg"; // Replace with actual image path
    img.onload = function () {
      doc.addImage(img, "PNG", 75, 10, pdfWidth, pdfHeight); // Adjusted height

      // Add title (centered)
      const title = "Inventory Report";
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - textWidth) / 2, 30 + pdfHeight); // Positioned below the image

      // Table data
      const tableColumn = [
        "Sr No",
        "Name",
        "Product Type",
        "Batch Number",
        "Total",
        "Remaining",
      ];
      const tableRows = suppliersList.map((row, index) => {
        const stock = row.stocks[0] || {};
        const remainingQty =
          (stock.remaining_qty || 0) * (stock.per_item_qty || 1);
        return [
          index + 1,
          row.product_name,
          row.product_type,
          row.batch_number,
          stock.total_qty || 0,
          `${remainingQty} ${stock.unit || ""}`,
        ];
      });

      // Add table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40 + pdfHeight, // Adjusted to fit under the title
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [50, 169, 46],
        },
      });

      // Save PDF
      doc.save("inventory.pdf");
    };
  };

  const exportToExcel = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // Generate filename with date range if available
    const filename =
      startDate && endDate
        ? `inventory_${startDate}_${endDate}.xlsx`
        : "inventory.xlsx";

    XLSX.writeFile(workbook, filename);
  };

  const exportToCSV = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download =
      startDate && endDate
        ? `inventory_${startDate}_${endDate}.csv`
        : "inventory.csv";
    link.click();
  };

  const ListTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr No
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Product Picture
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Product Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Batch Number
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Remaining
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                View Attachments
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Actions
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Stock
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Add Stock Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliersList?.map((row, index) => {
              const stock = row.stocks[0] || {};
              const attachments = row.attachments || [];
              const remainingQty =
                (stock.remaining_qty || 0) * (stock.per_item_qty || 1);

              return (
                <tr className="border-b border-gray-200" key={index}>
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-5 px-4">
                    <img
                      src={row.product_picture}
                      alt={row.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-5 px-4">{row.product_name}</td>
                  <td className="py-2 px-4">{row.product_type}</td>
                  <td className="py-2 px-4">{row.batch_number}</td>
                  <td className="py-2 px-4">{stock.total_qty || 0}</td>
                  <td className="py-2 px-4">
                    {remainingQty} {stock.unit || ""}
                  </td>
                  <td className="py-2 px-4">
                    {attachments.length > 0 ? (
                      attachments.map((attachment, i) => (
                        <div key={i} className="mb-2">
                          <a
                            href={attachment.file_path}
                            download={attachment.file_name}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Attachments
                          </a>
                        </div>
                      ))
                    ) : (
                      <span>No Attachments</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/operations/products/?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        View Details
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/operations/assignStock/?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        Assign Stock
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => openModal(row)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Add Stock Quantity
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Inventory
        </div>
        <div className="flex" style={{ marginLeft: "10rem" }}>
          <div className="flex-grow">
            {/* Export Buttons */}
            <div className="mt-8 flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Excel
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                CSV
              </button>
            </div>
          </div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                marginLeft: "auto",
                marginRight: "auto",
                height: "48px",
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {fetchingData ? (
            <div className={tableStyles.tableContainer}>
              <Skeleton animation="wave" height={300} />
            </div>
          ) : (
            <ListTable />
          )}
        </div>
      </div>

      <AddStockModal
        open={isModalOpen}
        onClose={closeModal}
        products={selectedProduct}
      />
    </div>
  );
};

export default withAuth(Page);
