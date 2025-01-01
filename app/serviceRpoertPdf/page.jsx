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
      setLoadingDetails(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Layout>
        <ClientDetails serviceReportList={serviceReportList} />
        <ClientRecords serviceReportList={serviceReportList} />

        <Grid container spacing={2}>
          <Grid item xs={10} sm={4} md={3}></Grid>
          <Grid item xs={2} sm={4} md={3}>
            <img style={{height:"100px", width:"100px"}} src={serviceReportList?.signature_img} />
          </Grid>
        </Grid>
      </Layout>

      <button
        onClick={handlePrint}
        className="print-button fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md print:hidden"
      >
        Print
      </button>

      <style jsx global>{`
        @media print {
          .print-button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
