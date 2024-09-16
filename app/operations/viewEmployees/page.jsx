"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import SearchInput from "@/components/generic/SearchInput";
import DateFilters from "../../../components/generic/DateFilters";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

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
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const listServiceTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white mt-5">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Employee Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Employee Designation
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Contact
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseList.length > 0 ? (
              expenseList.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>{row.name}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>{row.email}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.employee.phone_number || "null"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.is_active === 1 ? "Inactive" : "Active"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      <Link href={`/hr/employeeDetails?id=${row.id}`}>
                        <span className="text-blue-600 hover:text-blue-800">
                          View Details
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-5 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white mt-5">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Employee Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Employee Designation
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Contact
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Status
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5).keys()].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">
                <Skeleton width="50px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="150px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="150px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="100px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="100px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="150px" height="20px" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex">
        <div className="flex flex-grow">
          <div className="pageTitle">{"All Employees"}</div>
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
