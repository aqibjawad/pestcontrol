"use client";
import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { purchaseOrder } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material";
import withAuth from "@/utils/withAuth";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const PurchaseOrder = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Extract id from URL
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      fetchOrderDetails(urlId);
    }
  }, []);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${purchaseOrder}/${orderId}`
      );
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
                  {row?.product?.product_name || "N/A"}
                </td>
                <td className="py-2 px-4">
                  {row.product?.product_type || "N/A"}
                </td>
                <td className="py-2 px-4">{row.product.unit || "N/A"}</td>
                <td className="py-2 px-4">{row.product.mfg_date || "N/A"}</td>
                <td className="py-2 px-4">{row.product.exp_date || "N/A"}</td>
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
          {loading ? (
            <Skeleton width="50%" />
          ) : (
            orderDetails?.supplier?.supplier_name
          )}
        </div>
      </div>
      <div
        style={{ fontSize: "16px", fontFamily: "semibold", padding: "30px" }}
      >
        {loading ? <Skeleton width="30%" /> : orderDetails?.po_id}
      </div>
      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-12">
          {loading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            listTable()
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(PurchaseOrder);
