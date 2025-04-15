"use client";

import React, { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";

const Page = () => {
  const api = new APICall();

  const [quoteList, setQuoteList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${quotation}/contracted`);
      const mergedData = response?.data || [];
      setQuoteList(mergedData);
    } catch (error) {
      console.error("Error fetching quotes and contracts:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllQuotes();
  }, []);

  // Calculate counts for different statuses
  const activeCount = quoteList.filter(
    (quote) => quote.is_contracted === 1
  ).length;
  const pendingCount = quoteList.filter(
    (quote) => quote.is_contracted === 0
  ).length;
  const inProcessCount = quoteList.filter(
    (quote) => quote.is_contracted === 2
  ).length;
  const expiredCount = quoteList.filter(
    (quote) =>
      quote.contract_cancel_reason === "expired" && quote.contract_cancelled_at
  ).length;

  const totalCount = quoteList.length;

  // Status card component
  const StatusCard = ({ title, count, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col`}>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
      <p className="text-sm text-gray-600 mt-1">Total: {totalCount}</p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contract Summary</h1>

      {fetchingData ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading quote data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatusCard
              title="Active Quotes"
              count={activeCount}
              bgColor="bg-green-100"
            />
            <StatusCard
              title="Pending Quotes"
              count={pendingCount}
              bgColor="bg-yellow-100"
            />
            <StatusCard
              title="In Process Quotes"
              count={inProcessCount}
              bgColor="bg-blue-100"
            />
            <StatusCard
              title="Expired Quotes"
              count={expiredCount}
              bgColor="bg-red-100"
            />
          </div>

          {/* <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Quote Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-lg font-bold">{activeCount}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-lg font-bold">{pendingCount}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">In Process</p>
                <p className="text-lg font-bold">{inProcessCount}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-lg font-bold">{expiredCount}</p>
              </div>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default withAuth(Page);
