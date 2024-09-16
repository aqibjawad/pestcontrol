"use client";
import { useState, useEffect } from "react";

import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import SearchInput from "@/components/generic/SearchInput";

import styles from "../../../styles/loginStyles.module.css";

import Link from "next/link";

import APICall from "@/networkUtil/APICall";
import { purchaseOrder } from "@/networkUtil/Constants";

import { useSearchParams } from "next/navigation";

const PrchaseOrder = () => {
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
      const response = await api.getDataWithToken(`${purchaseOrder}/${id}`);
      console.log("API response data:", response.data);
      setOrderDetails(response.data);
      setTableDetails(response.data.order_details || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const listTable = () => {
    if (!Array.isArray(tableDetails)) {
      return <div>No data available</div>;
    }

    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Product Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Product Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Unit
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Manufacture Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Expiry Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Moccae Approval
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Moccae Start
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Moccae End
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Quantity
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {tableDetails.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row?.product?.product_name || "N/A"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.product?.product_type || "N/A"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.product.unit || "N/A"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.product.mfg_date || "N/A"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.product.exp_date || "N/A"}
                  </div>
                </td>
                <td className="py-2 px-4">{row.product.moccae_approval}</td>
                <td className="py-2 px-4">{row.product.moccae_strat_date}</td>
                <td className="py-2 px-4">{row.product.moccae_exp_date}</td>
                <td className="py-2 px-4">{row.quantity}</td>
                <td className="py-2 px-4">{row.total}</td>
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
          {orderDetails?.supplier?.supplier_name}
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

export default PrchaseOrder;
