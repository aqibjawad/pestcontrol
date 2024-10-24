"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { serviceInvoice } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Skeleton from "@mui/material/Skeleton";

// Properly import AppHelpers
import { AppHelpers } from "@/Helper/AppHelpers";

import Link from "next/link";

const ListServiceTable = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const formatDate = (dateString) => {
    try {
      return AppHelpers.convertDate(dateString);
    } catch (error) {
      console.error("Error converting date:", error);
      return dateString; // Return original string if conversion fails
    }
  };

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);
      const paidInvoices = response.data.filter(
        (invoice) => invoice.status === "paid"
      );
      setQuoteList(paidInvoices);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuoteList([]); // Set empty array on error
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
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingDetails
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton variant="text" animation="wave" />
                  </td>
                </tr>
              ))
            : invoiceList?.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {formatDate(row.issued_date)}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row?.user?.name || "N/A"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.paid_amt || 0}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.total_amt || 0}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.status}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      <Link href={`/invoiceDetails?id=${row.id}`}>
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
