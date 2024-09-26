"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import CustomerDetails from "./customerDetails";
import ServiceProduct from "./services";
import Invoice from "./invoices";
import ContractSummary from "./contract";
import { Grid } from "@mui/material";
import styles from "../../styles/viewQuote.module.css";
import { useSearchParams } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";

const Page = () => {
  const api = new APICall();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter(); // Initialize useRouter

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState(null); // Change initial state to null
  const [isApproved, setIsApproved] = useState(false); // Track approval status

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
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
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.getDataWithToken(
        `${quotation}/move/contract/${id}`
      );
      console.log("Response:", response);
      setIsApproved(true); // Update approval status after submission
      // Optionally: you could also check the response to see if it is contracted
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

  if (fetchingData) return <div>Loading...</div>; // Optional: Loading state
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

      <CustomerDetails quote={quoteList} />
      <ServiceProduct quote={quoteList} />
      <Invoice quote={quoteList} />
      <ContractSummary quote={quoteList} />

      <img
        style={{ width: "100%", marginTop: "1rem" }}
        src="/service_pdf2.png"
        alt="Service PDF"
      />

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          {!isApproved && (
            <div onClick={handleEditQuote} className={styles.approveDiv}>
              Edit Quote
            </div>
          )}
          {isApproved && (
            <div onClick={handlePrint} className={styles.approveDiv}>
              Print
            </div>
          )}
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <div className="flex">
            <div className="flex-grow"></div>
            <div>
              {!isApproved && (
                <div onClick={handleSubmit} className={styles.approveDiv}>
                  Approve
                </div>
              )}

              {isApproved && <div className={styles.approveDiv}>Approved</div>}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
