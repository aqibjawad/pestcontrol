"use client";
import { useState, useEffect } from "react";

import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import SearchInput from "@/components/generic/SearchInput";

import styles from "../../../styles/loginStyles.module.css";

import Link from "next/link";

import APICall from "@/networkUtil/APICall";
import { expense } from "@/networkUtil/Constants";

import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const api = new APICall();

  const [orderDetails, setOrderDetails] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(`${expense}/${id}`);
      console.log("API response data:", response.data);

      // Set orderDetails to the entire response data
      setOrderDetails(response.data);

      // Assuming `response.data` is an object, and the array you want is in `response.data.expenses`
      setTableDetails(response.data.expenses || []); // Adjust according to your actual data structure
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const listTable = () => {
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
                Payment Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {tableDetails.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">{row.expense_name}</td>
                <td className="py-2 px-4">{row.total_amount}</td>
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
          {orderDetails?.expense_category?.expense_category}
        </div>
      </div>

      <div
        style={{
          fontSize: "16px",
          fontFamily: "semibold",
          padding: "30px",
        }}
      >
        {orderDetails?.po_id}
      </div>

      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-12">{listTable()}</div>
      </div>
    </div>
  );
};

export default Page;