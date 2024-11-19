"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { getAllSuppliers } from "@/networkUtil/Constants";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Skeleton } from "@mui/material";
import DateFilters from "../../../components/generic/DateFilters";
import { format } from "date-fns";
import InputWithTitle from "@/components/generic/InputWithTitle";

// Generate PDF function remains the same
const generatePDF = async () => {
  const input = document.getElementById("supplierTable");
  if (!input) return;

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("suppliers.pdf");
};

const listTable = (data) => {
  return (
    <div className={tableStyles.tableContainer} id="supplierTable">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Supplier
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Company
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Email
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              tag
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Zip
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Balance
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{index + 1}</td>
              <td className="py-2 px-4">{row.supplier_name}</td>
              <td className="py-2 px-4">{row.company_name}</td>
              <td className="py-2 px-4">{row.email}</td>
              <td className="py-2 px-4">{row.tag}</td>
              <td className="py-2 px-4">{row.zip}</td>
              <td className="py-2 px-4">{row.balance}</td>
              <td className="py-2 px-4">
                <Link
                  href={`/account/supplier_ledger?id=${
                    row.id
                  }&supplier_name=${encodeURIComponent(
                    row.supplier_name
                  )}&company_name=${encodeURIComponent(
                    row.company_name
                  )}&number=${encodeURIComponent(row.number)}`}
                >
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
  );
};

const ViewSuppliers = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [originalSupplierList, setOriginalSupplierList] = useState([]); // Store original data
  const [filteredSupplierList, setFilteredSupplierList] = useState([]); // Store filtered data
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch suppliers from API
  const getAllSuppliere = async () => {
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
      const response = await api.getDataWithToken(
        `${getAllSuppliers}?${queryParams.join("&")}`
      );
      setOriginalSupplierList(response.data);
      setFilteredSupplierList(response.data); // Initialize filtered list with all data
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // Fetch data when dates change
  useEffect(() => {
    getAllSuppliere();
  }, [startDate, endDate]);

  // Handle filtering
  const handleFilterChange = (value) => {
    setFilterValue(value);

    if (value.trim() === "") {
      // If filter is cleared, restore original list
      setFilteredSupplierList(originalSupplierList);
    } else {
      // Apply filter
      const filtered = originalSupplierList.filter(
        (item) =>
          (item?.supplier_name || "")
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          (item?.company_name || "")
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          (item?.tag || "").toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSupplierList(filtered);
    }
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
          Suppliers
        </div>
        <div className="flex">
          <div className="flex-grow"></div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div>
              <InputWithTitle
                placeholder="Filter By Name, Tag"
                title={"Filter by Tag, Name"}
                onChange={handleFilterChange}
                value={filterValue}
              />
            </div>
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "150px",
                alignItems: "center",
                display: "flex",
                marginLeft: "2rem",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {fetchingData ? (
            <div>
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
            </div>
          ) : (
            listTable(filteredSupplierList)
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSuppliers;
