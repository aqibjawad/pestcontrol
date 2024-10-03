"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Grid, Skeleton } from "@mui/material"; // Import Skeleton
import styles from "../../styles/viewQuote.module.css";
import { useSearchParams } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";

import CustomerDetails from "./customerDetails";
import ServiceProduct from "./services";
import Invoice from "./invoices";
import ContractSummary from "./contract";
import Terms from "./terms";
import Treatment from "./methods";
import QuoteServiceDates from "./QuoteServiceDates"

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
  
  const [id, setId] = useState(null);
  

  const router = useRouter();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(()=>{

    if (id !== undefined && id !== null){
        getAllQuotes(id);
      
    }
  },[id]);
  
  const getAllQuotes = async () => {
    setFetchingData(true);

    console.log(`${quotation}/${id}`);
    try {
      const response = await api.getDataWithToken(`${quotation}/${id}`);
      setQuoteList(response.data);
      // Check if the quote is contracted on data fetch
      if (response.data.type === "contracted") {
        setIsApproved(true);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false); // Set loadingDetails to false after fetching
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.getDataWithToken(
        `${quotation}/move/contract/${id}`
      );
      router.push("/viewQuote");
      setIsApproved(true); // Update approval status after submission
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleEditQuote = () => {
    router.push(`/quotation?id=${id}`); // Navigate to the edit route with id
  };

  const handlePrint = () => {
    window.print();
  };

  if (fetchingData) {
    return (
      <div>
        <Skeleton variant="rect" width="100%" height={200} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" />
      </div>
    ); // Show Skeletons while loading
  }

  if (!quoteList) return <div>No data available</div>; // Handle no data case

  return (
    <div>
      <img
        style={{ width: "100%" }}
        src="/service_pdf1.png"
        alt="Service PDF"
      />

      <div>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <img src="/logo-black.png" alt="Logo" />
          </Grid>

          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className="flex">
              <div className="flex-grow"></div>
              <div>
                <div className={styles.heading}>
                  {isApproved ? "Contracted" : "Quotes"}
                </div> 
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="my-4">
        {loadingDetails ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        ) : (
          <>
            <CustomerDetails quote={quoteList} />
            <ServiceProduct quote={quoteList} />
            <QuoteServiceDates quote={quoteList} />
            <Treatment quote={quoteList} />
            <Invoice quote={quoteList} />
            <ContractSummary quote={quoteList} />
            <Terms quote={quoteList} />
          </>
        )}
      </div>

      <img
        style={{ width: "100%", marginTop: "1rem" }}
        src="/service_pdf2.png"
        alt="Service PDF"
      />

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          {!isApproved && (
            <div
              style={{ cursor: "pointer" }}
              onClick={handleEditQuote}
              className={styles.approveDiv}
            >
              Edit Quote
            </div>
          )}
          {isApproved && (
            <div
              style={{ cursor: "pointer" }}
              onClick={handlePrint}
              className={styles.approveDiv}
            >
              Print
            </div>
          )}
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <div className="flex">
            <div className="flex-grow"></div>
            <div>
              {!isApproved && (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={handleSubmit}
                  className={styles.approveDiv}
                >
                  Approve
                </div>
              )}

              {isApproved && (
                <div
                  style={{ cursor: "pointer" }}
                  className={styles.approveDiv}
                >
                  Approved
                </div>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
