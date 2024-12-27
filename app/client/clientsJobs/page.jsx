"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import "jspdf-autotable";


import { format, startOfMonth, endOfMonth } from "date-fns";

import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

import UpcomingJobs from "../../../components/UpcomingJobs";

const getParamsFromUrl = (url) => {
  const parts = url.split("?");
  const params = {};
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    }
  }
  return params;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [number, setNumber] = useState("");

  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const router = useRouter();
  const tableRef = useRef(null);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    const urlParams = getParamsFromUrl(currentUrl);

    setId(urlParams.id);
    setSupplierName(urlParams.name || "");
    setPhoneNumber(urlParams.phone_number || "");
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      // Calculate the start and end dates of the current month
      const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
      const endDate = format(endOfMonth(new Date()), "yyyy-MM-dd");

      // Make the API call with the calculated dates
      const response = await api.getDataWithToken(
        `${clients}/jobs/get/${id}?start_date=${startDate}&end_date=${endDate}`
      );
      const data = response?.data?.client_jobs;
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UpcomingJobs jobsList={rowData} />
    </div>
  );
};

export default withAuth(Page);
