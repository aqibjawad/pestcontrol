"use client";

import React, { useEffect, useState } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { purchaeOrder } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import { format } from "date-fns";
import DateFilters from "../../components/generic/DateFilters";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const apiCall = new APICall();
  const [id, setID] = useState();
  console.log(id);

  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");

    if (urlId) {
      setID(urlId);
      getPurchase(urlId); 
    }
  }, []);

  useEffect(() => {
    if (id) {
      getPurchase(id); // Always pass the ID
    }
  }, [startDate, endDate, id]);

  const getParamFromUrl = (url, param) => {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    return searchParams.get(param);
  };

  const getPurchase = async (currentId) => {
    if (!currentId) return; // Guard clause to prevent API call without ID

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
      const response = await apiCall.getDataWithToken(
        `${purchaeOrder}/get/${currentId}` // Corrected typo and use passed ID
      );
      setPurchaseOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching purchase order:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const ListTable = () => {
    if (!purchaseOrderDetails || !purchaseOrderDetails.details) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr No
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Supplier
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Product Name
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Quantity
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Price
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sub Total
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                VAT %
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                VAT Amount
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Grand Total
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrderDetails.details.map((detail, index) => (
              <tr key={detail.id} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-5 px-4">{detail.supplier.supplier_name}</td>
                <td className="py-5 px-4">{detail.product.product_name}</td>
                <td className="py-5 px-4">
                  {detail.qty} {detail.product.unit}
                </td>
                <td className="py-5 px-4">{detail.price}</td>
                <td className="py-5 px-4">{detail.sub_total}</td>
                <td className="py-5 px-4">{detail.vat_per}%</td>
                <td className="py-5 px-4">{detail.vat_amt}</td>
                <td className="py-5 px-4">{detail.grand_total}</td>
                <td className="py-5 px-4">{detail.status}</td>
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
          Purchase Orders Details
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {fetchingData ? (
            <div className={tableStyles.tableContainer}>
              <Skeleton animation="wave" height={300} />
            </div>
          ) : (
            <ListTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
