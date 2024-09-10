import React from "react";

import tableStyles from "../styles/upcomingJobsStyles.module.css";

const Transactions = () => {
  const rows = Array.from({ length: 5 }, (_, index) => ({
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
                Transaction ID
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableData}>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-5 px-4">{"TRX878787"}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"2000: AED"}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {"10/28/2024"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"Paid"}</div>
                </td>

                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{"View"}</div>
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
      <div className="pageTitle">Transactions</div>
      {customerTable()}
    </div>
  );
};

export default Transactions;
