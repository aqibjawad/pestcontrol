"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/vendorStyles.module.css";
import SearchInput from "./generic/SearchInput";
import GreenButton from "./generic/GreenButton";
import Link from "next/link";
import Loading from "../components/generic/Loading";
import APICall from "@/networkUtil/APICall";
import { getVendorsUrl } from "@/networkUtil/Constants";
import UIHelper from "./../app/utils/UIHelper";
const Vendors = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState();
  const [vendors, setVendors] = useState();

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
              <th class="py-2 px-4 border-b border-gray-200 text-left">Date</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors?.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className={styles.clientName}>
                    {row.user?.name ?? "User Name"}
                  </div>
                  <div className={styles.clientEmail}>
                    {row.user?.email ?? ""}
                  </div>
                </td>
                <td className="py-2 px-4">{row.firm_name}</td>
                <td className="py-2 px-4">
                  {UIHelper.formatDateString(row.created_at)}
                </td>
                <td className="py-2 px-4">{"AED 20,000"}</td>
                <td className="py-2 px-4">
                  <div className={styles.statusContainer}>
                    {row.percentage + "%"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    getAllVendors();
  }, []);

  const getAllVendors = async () => {
    setFetchingData(true);
    const response = await api.getDataWithToken(getVendorsUrl);
    setVendors(response.data.data);
    setFetchingData(false);
  };
  return (
    <div className={styles.parentContainer}>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">{"Vendors"}</div>
        </div>
        <div className="flex">
          <SearchInput />
          <div className="ml-10">
            <Link href="/addVendor">
              <GreenButton title={" Add Vendor "} />
            </Link>
          </div>
        </div>
      </div>

      {fetchingData ? <Loading /> : jobTable()}
    </div>
  );
};

export default Vendors;
