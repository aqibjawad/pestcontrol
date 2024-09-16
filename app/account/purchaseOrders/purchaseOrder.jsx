"use client";
import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import styles from "../../../styles/loginStyles.module.css";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { purchaseOrder } from "@/networkUtil/Constants";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const PrchaseOrder = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    getAllExpenses();
  }, []);

  const getAllExpenses = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${purchaseOrder}`);
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
            <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
              <SearchInput />
            </div>
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "100px",
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
              Filters
            </div>
          </div>
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
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                height: "44px",
                width: "202px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                padding: "12px, 16px, 12px, 16px",
                borderRadius: "10px",
              }}
            >
              Download all
            </div>

            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "black",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                marginLeft: "auto",
                marginRight: "auto",
                height: "44px",
                width: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
                borderRadius: "10px",
              }}
            >
              <Link href="/">Add</Link>
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
