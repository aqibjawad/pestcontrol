"use client";

import React, { useEffect, useState } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { purchaeOrder } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import { format } from "date-fns";
import DateFilters from "../../components/generic/DateFilters";
import withAuth from "@/utils/withAuth";

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
    getPurchase();
  }, [startDate, endDate]);

  const getPurchase = async () => {
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
        `${purchaeOrder}/get?${queryParams.join("&")}`
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

  const generateExportData = () => {
    const data = suppliersList.map((row, index) => {
      const stock = row.stocks[0] || {};
      const remainingQty = (stock.remaining_qty || 0) * (row.per_item_qty || 1);
      const avgPrice = stock.avg_price || 0;
      const totalPrice = (
        parseFloat(remainingQty) * parseFloat(avgPrice)
      ).toFixed(2);

      return {
        "Sr No": index + 1,
        "Product Name": row.product_name || "N/A",
        "Product Type": row.product_type || "N/A",
        "Batch Number": row.batch_number || "N/A",
        "Total Quantity": stock.total_qty || 0,
        "Remaining Quantity": `${remainingQty} ${stock.unit || ""}`,
        "Average Price": avgPrice,
        "Total Price": totalPrice,
      };
    });

    data.push({
      "Sr No": "",
      "Product Name": "TOTAL",
      "Product Type": "",
      "Batch Number": "",
      "Total Quantity": "",
      "Remaining Quantity": "",
      "Average Price": totals.totalAvgPrice.toFixed(2),
      "Total Price": totals.grandTotal.toFixed(2),
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
        "Total Price",
      ];

      const tableRows = suppliersList.map((row, index) => {
        const stock = row.stocks[0] || {};
        const remainingQty =
          (stock.remaining_qty || 0) * (row.per_item_qty || 1);
        const avgPrice = stock.avg_price || 0;
        const totalPrice = (
          parseFloat(remainingQty) * parseFloat(avgPrice)
        ).toFixed(2);

        return [
          index + 1,
          row.product_name,
          row.product_type,
          row.batch_number,
          remainingQty,
          avgPrice,
          totalPrice,
        ];
      });

      tableRows.push([
        "",
        "TOTAL",
        "",
        "",
        "",
        totals.totalAvgPrice.toFixed(2),
        totals.grandTotal.toFixed(2),
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
          fontStyle: "bold",
        },
      });

      doc.save("inventory.pdf");
    };
  };

  const exportToExcel = () => {
    const data = generateExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr No
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                PO ID
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Description
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Products
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Total Grand Total
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliersList?.map((order, index) => {
              // Calculate total grand total for the order
              const totalGrandTotal = order.details
                .reduce(
                  (sum, detail) => sum + parseFloat(detail.grand_total),
                  0
                )
                .toFixed(2);

              // Combine product details into a single string
              const productDetails = order.details
                .map(
                  (detail) =>
                    `${detail.product.product_name} (Qty: ${detail.qty}, Supplier: ${detail.supplier.supplier_name})`
                )
                .join(", ");

              return (
                <tr className="border-b border-gray-200" key={index}>
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-5 px-4">{order.po_id}</td>
                  <td className="py-5 px-4">{order.description}</td>
                  <td className="py-5 px-4">{order.status}</td>
                  <td className="py-5 px-4">{productDetails}</td>
                  <td className="py-5 px-4">{totalGrandTotal}</td>
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
          Purchase Orders
        </div>
        <div className="flex" style={{ marginLeft: "15rem" }}>
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
    </div>
  );
};

export default withAuth(Page);
