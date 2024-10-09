"use client";
import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { purchaseOrder } from "@/networkUtil/Constants";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { format } from "date-fns";

import DateFilters from "../../../components/generic/DateFilters"

const PrchaseOrder = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    getAllExpenses();
  }, [startDate, endDate]);

  const getAllExpenses = async () => {
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
        `${purchaseOrder}?${queryParams.join("&")}`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const listTable = () => {
    if (fetchingData) {
      return (
        <Stack spacing={1}>
          <Skeleton variant="rectangular" width="100%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Stack>
      );
    }

    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                Sr.{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Supplier Name{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                City{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Delivery Date{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Order Date{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Total Amount{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                View Details{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4"> {index + 1} </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row?.supplier?.supplier_name}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>{row.city}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.delivery_date}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.order_date}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.grand_total}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <Link href={`/account/purchaseOrderDetails?id=${row.id}`}>
                    <span className="text-blue-600 hover:text-blue-800">
                      View Details
                    </span>
                  </Link>
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
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          {" "}
          Purchase Order{" "}
        </div>
        <div className="flex">
          <div className="flex-grow"></div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "150px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              <DateFilters onDateChange={handleDateChange} />
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listTable()}</div>
      </div>
    </div>
  );
};

export default PrchaseOrder;
