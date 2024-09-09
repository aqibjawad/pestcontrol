import React from "react";
import SearchInput from "./generic/SearchInput";
import GreenButton from "./generic/GreenButton";

import tableStyles from "../styles/upcomingJobsStyles.module.css";

const Customer = () => {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientContact: "10",
    quoteSend: "10",
    quoteApproved: "50",
    cashAdvance: "$50,000",
  }));

  const customerTable = () => {
    return (
      <div>
        <table className="min-w-full bg-white">
          <thead className={tableStyles.tableContainer}>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Orders
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                TRN
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                E Mail
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Date
              </th>

              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Type
              </th>

              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Status
              </th>

              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Prices
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableData}>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-5 px-4">{row.clientName}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"2"}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"TRN1234"}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {"shahbaz@example.com"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"9/9/2024"}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"Walk in"}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"Active"}</div>
                </td>
                <td className="py-2 px-4">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    2000AED
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
        <div className="flex-grow">
          <div className="pageTitle">Customers</div>
        </div>
        <div>
          <div className="flex">
            <div className="ml-5">
              <SearchInput />
            </div>
            <div className="ml-5">
              <GreenButton title={"Search"} />
            </div>
          </div>
        </div>
      </div>
      {customerTable()}
    </div>
  );
};

export default Customer;
