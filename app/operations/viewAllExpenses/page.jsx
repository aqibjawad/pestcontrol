"use client";
import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import SearchInput from "@/components/generic/SearchInput";
import DateFilters from "../../../components/generic/DateFilters";
import APICall from "@/networkUtil/APICall";
import { expense } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material"; // Import MUI Skeleton

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    getAllExpenses();
  }, []);

  const getAllExpenses = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${expense}`);
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
              <th className="py-5 px-4 border-b border-gray-200 text-left">Sr.</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Expense Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Expense Category</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Expense Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">VAT</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Payment Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenseList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    <img
                      src={row.expense_file}
                      alt={row.expense_name}
                      style={{ width: "100px", height: "auto" }} // Adjust size as needed
                    />
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row?.expense_category?.expense_category}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.expense_name}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.vat_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.payment_type}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    <Link href={`/operations/viewExpense?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">View Details</span>
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
              <th className="py-5 px-4 border-b border-gray-200 text-left">Sr.</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Expense Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Expense Category</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Expense Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">VAT</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Payment Type</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(new Array(5)).map((_, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4"><Skeleton width="20px" /></td>
                <td className="py-2 px-4"><Skeleton variant="rectangular" width="100px" height={40} /></td>
                <td className="py-2 px-4"><Skeleton variant="text" /></td>
                <td className="py-2 px-4"><Skeleton variant="text" /></td>
                <td className="py-2 px-4"><Skeleton variant="text" /></td>
                <td className="py-2 px-4"><Skeleton variant="text" /></td>
                <td className="py-2 px-4"><Skeleton variant="text" /></td>
                <td className="py-2 px-4"><Skeleton variant="text" /></td>
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
          <div className="mr-10">
            <SearchInput />
          </div>
          <DateFilters />
        </div>
      </div>

      {fetchingData ? renderSkeleton() : listServiceTable()}
    </div>
  );
};

export default Page;
