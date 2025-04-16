"use client";

import React, { useState, useEffect } from "react";
import ClientDetails from "./clientDetails";
import ClientRecords from "./clientRecords";
import { Grid } from "@mui/material";
import styles from "../../styles/viewQuote.module.css";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import Layout from "../../components/layoutPfd";

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

  const imgSTring =
    "data:image/png;base64,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";

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
      <Layout branchId={serviceReportList?.job?.quote?.branch?.id}>
        <ClientDetails serviceReportList={serviceReportList} />
        <ClientRecords serviceReportList={serviceReportList} />

        <div className="flex">
          <div className="flex-grow"></div>

          <div>
            <div className="mt-5 contractTable">Clients Signature</div>
            <img
              src={imgSTring}
              alt="Company Logo"
              style={{ height: "100px", width: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
      </Layout>

      <button
        onClick={handlePrint}
        className="print-button fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md print:hidden"
      >
        Print
      </button>

      <style jsx global>{`
        @media print {
          /* Remove print button */
          .print-button {
            display: none !important;
          }

          /* Force background colors to print */
          .contractTable,
          table th,
          .table-header {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-color-adjust: exact !important;
          }

          /* Remove all margins and padding for the entire document */
          @page {
            margin: 0;
            padding: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          /* Remove any extra spacing */
          * {
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
