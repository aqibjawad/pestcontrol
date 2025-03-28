"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { ipmReport } from "@/networkUtil/Constants";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { Skeleton } from "@mui/material";
import DateFilters from "../../components/generic/DateFilters";
import { format } from "date-fns";
import InputWithTitle from "@/components/generic/InputWithTitle";

const listTable = (data, startDate, endDate) => {
  return (
    <div className={tableStyles.tableContainer} id="supplierTable">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Client Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Report Date
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              View IPM Report
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{index + 1}</td>
              <td className="py-2 px-4">
                {row.user_client?.client?.firm_name}
              </td>
              <td className="py-2 px-4">{row.report_date}</td>
              <td className="py-2 px-4">
                <Link
                //   href={`/ipmPdf?id=${row?.user_client?.client?.user_id}&start_date=${startDate}&end_date=${endDate}`}
                  href={`/ipmPdf?id=${row?.user_client_id}`}
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

const Page = () => {
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
  const getIpmReports = async () => {
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
        `${ipmReport}/get?${queryParams.join("&")}`
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
    getIpmReports();
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
          IPM Reports
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
            listTable(filteredSupplierList, startDate, endDate)
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;