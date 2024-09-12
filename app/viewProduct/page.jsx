"use client";

import React, {useState, useEffect} from "react";

import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { product } from "@/networkUtil/Constants";

const Page = () => {
  const api = new APICall();

  const [brands, setBrandList] = useState([]);

  const [brandsLists, setAllBrandsList] = useState([]);

  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}`);
      setAllBrandsList(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch brands. Please try again.",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientContact: "10",
    quoteSend: "10",
    quoteApproved: "50",
    cashAdvance: "$50,000",
  }));

  const listTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                Serial Number{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Job Title{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Customer{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Uses{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Date{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{row.clientName}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
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
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <img
            src="/inventroy.png"
            style={{ width: "269px", height: "493px", left: "315px" }}
          />
        </div>
        <div className="col-span-6">
          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                Product Name
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                SKU
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Sale Price
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Total Stock
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Used
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Supplier Cost
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Low Cost
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Discount
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Search Key
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                HSN
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Category
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Warrenty
              </div>
            </div>

            <div className="col-span-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(
                (category, index) => (
                  <div
                    style={{
                      fontWeight: "500",
                      fontSize: "14px",
                      marginBottom: "1.5rem",
                      color: "#979797",
                      textAlign: "left",
                    }}
                  >
                    Mite control
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div style={{ fontSize: "20px", color: "#333333" }}>Product uses</div>

        {listTable()}
      </div>
    </div>
  );
};

export default Page;
