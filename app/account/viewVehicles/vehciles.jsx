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

const Vehciles = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    getAllExpenses();
  }, [startDate, endDate]);

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
      const response = await api.getDataWithToken(
        `${vehicleExpense}?${queryParams.join("&")}`
      );
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
            {expenseList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row?.vehicle?.vehicle_number}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.maintenance_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.fuel_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.oil_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.vat_amount}%
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.total_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.oil_change_limit}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.payment_type}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    <Link href={`/account/getVehicle?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        View Details
                      </span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
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
      <div className="flex">
        <div className="flex flex-grow">
          <div className="pageTitle">{"Vehicle Expenses"}</div>
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

      {fetchingData ? renderSkeleton() : listServiceTable()}
    </div>
  );
};

export default Vehciles;
