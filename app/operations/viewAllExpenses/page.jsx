"use client";
import React from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import SearchInput from "@/components/generic/SearchInput";
import DateFilters from "../../../components/generic/DateFilters";

const Page = () => {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientContact: "10",
    quoteSend: "10",
    quoteApproved: "50",
    cashAdvance: "$50,000",
  }));

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
                Expense Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                VAT
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Category
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>Chemical</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>45 : AED</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>Maintainace</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>100</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>145</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    <Link href="/">View</Link>
                  </div>
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
          <div className="mr-10">
            <SearchInput />
          </div>

          <DateFilters />
        </div>
      </div>

      {listServiceTable()}
    </div>
  );
};

export default Page;
