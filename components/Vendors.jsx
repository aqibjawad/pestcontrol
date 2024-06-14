import React from "react";
import styles from "../styles/vendorStyles.module.css";
import SearchInput from "./generic/SearchInput";
import GreenButton from "./generic/GreenButton";
const Vendors = () => {
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

  const jobTable = () => {
    return (
      <div className={styles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">Name</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Firm Name
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">Date</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Percentage
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
                <td className="py-2 px-4">{"Entarata"}</td>
                <td className="py-2 px-4">{"5 May 2024"}</td>
                <td className="py-2 px-4">{"AED 20,000"}</td>
                <td className="py-2 px-4">
                  <div className={styles.statusContainer}>{"35%"}</div>
                </td>
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
          <div className="pageTitle">{"Vendors"}</div>
        </div>
        <div className="flex">
          <SearchInput />
          <GreenButton title={"Add "} />
        </div>
      </div>

      {jobTable()}
    </div>
  );
};

export default Vendors;
