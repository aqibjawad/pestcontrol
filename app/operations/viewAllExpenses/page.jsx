"use client";
import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import DateFilters from "../../../components/generic/DateFilters";
import APICall from "@/networkUtil/APICall";
import { expense_category } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material";
import { format, startOfMonth, endOfMonth } from "date-fns";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  // Initialize with current month's start and end dates
  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

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

    // Always use start_date and end_date in query params
    queryParams.push(`start_date=${startDate}`);
    queryParams.push(`end_date=${endDate}`);

    try {
      const response = await api.getDataWithToken(
        `${expense_category}?${queryParams.join("&")}`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
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
                Expense Category
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Amount
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
                    {row.expense_category}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.total_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    <Link href={`/operations/viewExpense?id=${row.id}`}>
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
                Expense Category
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
          <div className="pageTitle">{"Expenses"}</div>
        </div>
        <div className="flex">
          <div
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
            />
            <DateFilters
              onDateChange={handleDateChange}
              initialStartDate={startDate}
              initialEndDate={endDate}
            />
          </div>
        </div>
      </div>

      {fetchingData ? renderSkeleton() : listServiceTable()}
    </div>
  );
};

export default withAuth(Page);
