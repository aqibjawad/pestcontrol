"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/vendorStyles.module.css";
import SearchInput from "./generic/SearchInput";
import GreenButton from "./generic/GreenButton";
import { vendors } from "../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Loading from "./generic/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Vendors = () => {
  const api = new APICall();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState();
  const [vendorsData, setVendorsData] = useState([]);

  const jobTable = () => {
    return (
      <div className={styles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">Name</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Firm Name
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Percentage
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {vendorsData?.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className={styles.clientName}>{row.name}</div>
                  <div className={styles.clientEmail}>{row.email}</div>
                  <div className={styles.clientPhone}>{row.contact}</div>
                </td>
                <td className="py-2 px-4">{row.firm_name}</td>
                <td className="py-2 px-4">
                  <div className={styles.statusContainer}>{row.percentage}</div>
                </td>
                <td className="py-2 px-4">
                  <Link href={"/"}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  useEffect(() => {
    fetchVendors();
  }, []);
  const fetchVendors = async () => {
    setFetchingData(true);
    const response = await api.getDataWithToken(vendors);
    setVendorsData(response.data);
    setFetchingData(false);
  };

  return (
    <div className={styles.parentContainer}>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">{"Vendors"}</div>
        </div>
        <div className="flex">
          <GreenButton
            onClick={() => {
              router.push("/addVendor");
            }}
            title={"Add "}
          />
        </div>
      </div>
      {fetchingData ? <Loading /> : jobTable()}
    </div>
  );
};

export default Vendors;
