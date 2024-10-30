"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";
import { getAllSuppliers } from "../../../../networkUtil/Constants";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { Skeleton } from "@mui/material";

import DateFilters from "../../../../components/generic/DateFilters";
import { format } from "date-fns";

const listTable = (data) => {
  return (
    <div className={tableStyles.tableContainer} id="supplierTable">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Bank Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              IBAN
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Account Number
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.bank_infos?.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{index + 1}</td>
              <td className="py-2 px-4">{row.bank_name}</td>
              <td className="py-2 px-4">{row.iban}</td>
              <td className="py-2 px-4">{row.account_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ViewBanks = ({ supplierID }) => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [supplierList, setSupplierList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (supplierID !== undefined) {
      getAllSuppliere();
    }
  }, [supplierID]);

  const getAllSuppliere = async () => {
    setFetchingData(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${getAllSuppliers}/${supplierID}`
      );
      setSupplierList(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        {fetchingData ? (
          <div>
            {/* Display Skeletons for loading state */}
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="rectangular" width="100%" height={50} />
          </div>
        ) : (
          listTable(supplierList)
        )}
      </div>
    </div>
  );
};

export default ViewBanks;
