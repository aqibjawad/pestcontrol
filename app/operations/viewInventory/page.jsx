"use client";

import React, { useEffect, useState } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";

import { format } from "date-fns";

import DateFilters from "../../../components/generic/DateFilters";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const apiCall = new APICall();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [suppliersList, setSuppliersList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    getSuppliers();
  }, [startDate, endDate]);

  const getSuppliers = async () => {
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
        `${product}?${queryParams.join("&")}`
      );
      setSuppliersList(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      // Optionally set an error state here
    } finally {
      setFetchingData(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const ListTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Product Picture
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Product Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Batch Number
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Remaining
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                View Attachments
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Actions
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliersList?.map((row, index) => {
              const stock = row.stocks[0] || {}; // Get the first stock object
              const attachments = row.attachments || [];
              const remainingQty =
                (stock.remaining_qty || 0) * (stock.per_item_qty || 1);

              return (
                <tr className="border-b border-gray-200" key={index}>
                  <td className="py-5 px-4">
                    <img
                      src={row.product_picture}
                      alt={row.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-5 px-4">{row.product_name}</td>
                  <td className="py-2 px-4">{row.product_type}</td>
                  <td className="py-2 px-4">{row.batch_number}</td>
                  <td className="py-2 px-4">{stock.total_qty || 0}</td>
                  <td className="py-2 px-4">
                    {remainingQty} {stock.unit || ""}
                  </td>
                  <td className="py-2 px-4">
                    {attachments.length > 0 ? (
                      attachments.map((attachment, i) => (
                        <div key={i} className="mb-2">
                          <a
                            href={attachment.file_path}
                            download={attachment.file_name}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Attachments
                          </a>
                        </div>
                      ))
                    ) : (
                      <span>No Attachments</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/operations/products/?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        View Details
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/operations/assignStock/?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        Assign Stock
                      </span>
                    </Link>
                  </td>
                </tr>
              );
            })}
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
          Inventory
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
                marginLeft: "auto",
                marginRight: "auto",
                height: "48px",
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </div>
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
