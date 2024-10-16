"use client";
import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import SearchInput from "@/components/generic/SearchInput";
import DateFilters from "../../../components/generic/DateFilters";
import APICall from "@/networkUtil/APICall";
import { vehicleExpense } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material"; // Import MUI Skeleton

import { format } from "date-fns";

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

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllExpenses(id);
    }
  }, [id]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getAllExpenses = async () => {
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
      const response = await api.getDataWithToken(`${vehicleExpense}/${id}`);
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching vehicle expenses:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const listServiceTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Maintenance Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Fuel Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Oil Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                VAT
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Oil Change Limit
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Payment Type
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.maintenance_amount}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.fuel_amount}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.oil_amount}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.vat_amount}%
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.total_amount}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.oil_change_limit}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {expenseList.payment_type}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Vehicle Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Maintenance Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Fuel Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Oil Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                VAT
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Oil Change Limit
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Payment Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(new Array(5)).map((_, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <Skeleton width="20px" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="rectangular" width="100px" height={40} />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className={tableStyles.clientContact}>
        {expenseList?.vehicle?.vehicle_number}
      </div>
      {/* <div className="flex">
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
      </div> */}

      {fetchingData ? renderSkeleton() : listServiceTable()}
    </div>
  );
};

export default Page;
