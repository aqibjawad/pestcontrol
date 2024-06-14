import React from "react";

import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";

const Contracts = () => {
  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientEmail: "ali@gmail.com",
    clientPhone: "0900 78601",
    service: "Pest Control",
    date: "5 May 2024",
    priority: "High",
    status: "Completed",
    teamCaptain: "Babar Azam",
  }));

  const quotesTable = () => {
    return (
      <div className={styles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">
                Customer
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Contracted By
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Job Type
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Start Date
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                End Date
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Prices
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className={styles.clientName}>{row.clientName}</div>
                  <div className={styles.clientEmail}>{row.clientEmail}</div>
                  <div className={styles.clientPhone}>{row.clientPhone}</div>
                </td>
                <td className="py-2 px-4">{"Ali Akbar"}</td>
                <td className="py-2 px-4">{"Contract"}</td>
                <td className="py-2 px-4">{"5 May, 2024"}</td>
                <td className="py-2 px-4">{"6 May, 2025"}</td>
                <td className="py-2 px-4">{"$750"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.parentContainer}>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">Contracts</div>
        </div>
        <div className="flex">
          <SearchInput />
        </div>
      </div>
      <div className="mt-5">{quotesTable()}</div>
    </div>
  );
};

export default Contracts;
