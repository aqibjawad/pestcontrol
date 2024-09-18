"use client";

import React, { useEffect, useState } from "react";

import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import SearchInput from "@/components/generic/SearchInput";

import styles from "../../../styles/loginStyles.module.css";

import { product } from "@/networkUtil/Constants";
import Loading from "../../../components/generic/Loading";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const apiCall = new APICall();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [suppliersList, setSuppliersList] = useState([]);

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    setFetchingData(true);
    try {
      const response = await apiCall.getDataWithToken(product);
      setSuppliersList(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      // Optionally set an error state here
    } finally {
      setFetchingData(false);
    }
  };

  const listTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                product Picture{" "}
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                Name{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Product Type{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Batch Number{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliersList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <img
                    src={row.product_picture}
                    alt={row.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-5 px-4">{row.product_name}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.product_type}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.batch_number}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {" "}
                    <Link href={`/operations/products/?id=${row.id}`}>
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
              Date
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
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
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listTable()}</div>
      </div>
    </div>
  );
};

export default Page;
