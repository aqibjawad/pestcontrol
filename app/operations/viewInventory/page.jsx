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

  const calculateTotals = () => {
    return suppliersList.reduce((acc, row) => {
      const stock = row.stocks[0] || {};
      const remainingQty = (stock.remaining_qty || 0) * (row.per_item_qty || 1);
      const avgPrice = stock.avg_price || 0;
      const totalPrice = (parseFloat(remainingQty) * parseFloat(avgPrice)).toFixed(2);
      
      return {
        totalAvgPrice: acc.totalAvgPrice + parseFloat(avgPrice),
        grandTotal: acc.grandTotal + parseFloat(totalPrice)
      };
    }, { totalAvgPrice: 0, grandTotal: 0 });
  };

  const generateExportData = () => {
    const data = suppliersList.map((row, index) => {
      const stock = row.stocks[0] || {};
      const remainingQty = (stock.remaining_qty || 0) * (row.per_item_qty || 1);
      const avgPrice = stock.avg_price || 0;
      const totalPrice = (parseFloat(remainingQty) * parseFloat(avgPrice)).toFixed(2);

      return {
        "Sr No": index + 1,
        "Product Name": row.product_name || "N/A",
        "Product Type": row.product_type || "N/A",
        "Batch Number": row.batch_number || "N/A",
        "Total Quantity": stock.total_qty || 0,
        "Remaining Quantity": `${remainingQty} ${stock.unit || ""}`,
        "Average Price": avgPrice,
        "Total Price": totalPrice
      };
    });

    const totals = calculateTotals();
    data.push({
      "Sr No": "",
      "Product Name": "TOTAL",
      "Product Type": "",
      "Batch Number": "",
      "Total Quantity": "",
      "Remaining Quantity": "",
      "Average Price": totals.totalAvgPrice.toFixed(2),
      "Total Price": totals.grandTotal.toFixed(2)
    });

    return data;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Logo original dimensions
    const originalWidth = 397;
    const originalHeight = 175;

    // Desired width for PDF
    const pdfWidth = 50;
    const aspectRatio = originalHeight / originalWidth;
    const pdfHeight = pdfWidth * aspectRatio;

    // Add logo
    const img = new Image();
    img.src = "/logo.jpeg";
    img.onload = function () {
      doc.addImage(img, "PNG", 75, 10, pdfWidth, pdfHeight);

      // Add title (centered)
      const title = "Inventory Report";
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - textWidth) / 2, 30 + pdfHeight);

      const tableColumn = [
        "Sr No",
        "Name",
        "Product Type",
        "Batch Number",
        "Remaining Stock",
        "Average Price",
        "Total Price"
      ];

      const tableRows = suppliersList.map((row, index) => {
        const stock = row.stocks[0] || {};
        const remainingQty = (stock.remaining_qty || 0) * (row.per_item_qty || 1);
        const avgPrice = stock.avg_price || 0;
        const totalPrice = (parseFloat(remainingQty) * parseFloat(avgPrice)).toFixed(2);
        
        return [
          index + 1,
          row.product_name,
          row.product_type,
          row.batch_number,
          remainingQty,
          avgPrice,
          totalPrice
        ];
      });

      const totals = calculateTotals();
      tableRows.push([
        "",
        "TOTAL",
        "",
        "",
        "",
        totals.totalAvgPrice.toFixed(2),
        totals.grandTotal.toFixed(2)
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40 + pdfHeight,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [50, 169, 46],
        },
        footStyles: {
          fillColor: [240, 240, 240],
          fontStyle: 'bold'
        }
      });

      doc.save("inventory.pdf");
    };
  };

  const exportToExcel = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const filename = startDate && endDate
      ? `inventory_${startDate}_${endDate}.xlsx`
      : "inventory.xlsx";

    XLSX.writeFile(workbook, filename);
  };

  const exportToCSV = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = startDate && endDate
      ? `inventory_${startDate}_${endDate}.csv`
      : "inventory.csv";
    link.click();
  };

  const ListTable = () => {
    const calculateTotalPrice = (remainingQty, avgPrice) => {
      const total = (parseFloat(remainingQty) * parseFloat(avgPrice)).toFixed(2);
      return total;
    };

    const totals = calculateTotals();

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">Sr No</th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">Product Picture</th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Product Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Batch Number</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Remaining Stock</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Average Price</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Total Price</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">View Attachments</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Stock</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Add Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            {suppliersList?.map((row, index) => {
              const stock = row.stocks[0] || {};
              const attachments = row.attachments || [];
              const remainingQty = (stock.remaining_qty || 0) * (row.per_item_qty || 1);
              const avgPrice = stock.avg_price || 0;
              const totalPrice = calculateTotalPrice(remainingQty, avgPrice);

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
                  <td className="py-2 px-4">{remainingQty}</td>
                  <td className="py-2 px-4">{avgPrice}</td>
                  <td className="py-2 px-4">{totalPrice}</td>
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
            <tr className="border-b border-gray-200 font-bold bg-gray-100">
              <td colSpan="6" className="py-2 px-4 text-right">Total:</td>
              {/* <td className="py-2 px-4">{totals.totalAvgPrice.toFixed(2)}</td> */}
              <td className="py-2 px-4">{totals.grandTotal.toFixed(2)}</td>
              <td colSpan="4"></td>
            </tr>
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
