"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import { serviceInvoice } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

// Renamed to PascalCase and made into a proper React component
const ListServiceTable = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  return (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Invoice Issue Date
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Client
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Paid Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Total Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceList?.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{index + 1}</td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.issued_date}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row?.user?.name}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>{row.paid_amt}</div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>{row.total_amt}</div>
              </td>

              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>{row.status}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Page = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Invoices
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ListServiceTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
