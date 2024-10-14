"use client";

import React, { useState, useEffect } from "react";

import ClientDetails from "./clientDetails";
import ClientRecords from "./clientRecords";
import VisitRecords from "./records";
import Terms from "./terms";

import { Grid } from "@mui/material";

import styles from "../../styles/viewQuote.module.css";

import APICall from "@/networkUtil/APICall";

import { job } from "@/networkUtil/Constants";

import Layout from "../../components/layout";

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

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState("");

  const [fetchingData, setFetchingData] = useState(false);
  const [serviceReportList, setQuoteList] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllJobs(id);
    }
  }, [id]);

  const getAllJobs = async () => {
    setFetchingData(true);

    try {
      const response = await api.getDataWithToken(
        `${job}/service_report/${id}`
      );
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false); // Set loadingDetails to false after fetching
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* <img
        style={{ width: "100%" }}
        src="/service_pdf1.png"
        alt="Service PDF"
      /> */}

      <Layout>
        <ClientDetails serviceReportList={serviceReportList} />
        <ClientRecords serviceReportList={serviceReportList} />
        {/* <VisitRecords serviceReportList={serviceReportList} /> */}
        {/* <Terms serviceReportList={serviceReportList} /> */}
      </Layout>

      <div onClick={handlePrint}>print</div>
    </div>
  );
};

export default Page;
