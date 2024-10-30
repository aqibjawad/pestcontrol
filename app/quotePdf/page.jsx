"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Grid, Skeleton, CircularProgress } from "@mui/material"; // Import CircularProgress
import styles from "../../styles/viewQuote.module.css";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";

import CustomerDetails from "./customerDetails";
import ServiceProduct from "./services";
import Invoice from "./invoices";
import ContractSummary from "./contract";
import Terms from "./terms";
import Treatment from "./methods";
import QuoteServiceDates from "./QuoteServiceDates";

import Layout from "../../components/layout"

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
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllQuotes(id);
    }
  }, [id]);

const getAllQuotes = async () => {
  setFetchingData(true);
  try {
    const response = await api.getDataWithToken(`${quotation}/${id}`);
    setQuoteList(response.data);

    // Check if the quote is contracted or if it's already approved
    if (response.data.type === "contracted" || response.data.is_contracted === 1) {
      setIsApproved(true);
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
  } finally {
    setFetchingData(false);
    setLoadingDetails(false);
  }
};

  // const handleSubmit = async () => {
  //   setIsApproving(true);
  //   try {
  //     await api.getDataWithToken(`${quotation}/move/contract/${id}`);
  //     router.push("/contracts");
  //     setIsApproved(true);
  //   } catch (error) {
  //     console.error("Error sending data:", error);
  //   } finally {
  //     setIsApproving(false);
  //   }
  // };

  const handleEditQuote = () => {
    router.push(`/quotation?id=${id}`);
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
    );
  }

  if (!quoteList) return <div>No data available</div>;

  return (
    <Layout>

      {/* <div>
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
      </div> */}

      <div className="">
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
            {/* <Terms quote={quoteList} /> */}
          </>
        )}
      </div>


      {/* <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
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
                  {isApproving ? (
                    <CircularProgress size={24} /> // Show CircularProgress when approving
                  ) : (
                    "Approve"
                  )}
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
      </Grid> */}
    </Layout>
  );
};

export default Page;
