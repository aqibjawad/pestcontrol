"use client";

import React from "react";

import CustomerDetails from "./customerDetails";
import ServiceProduct from "./services";
import Invoice from "./invoices"
import ContractSummary from "./contract";

import { Grid } from "@mui/material";

import styles from "../../styles/viewQuote.module.css";

const Page = () => {
  const handlePrint = () => {
    window.print();
  };

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
            <img src="/logo-black.png" />
          </Grid>

          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className="flex">
              <div className="flex-grow"></div>
              <div>
                <div className={styles.heading}> Quotes </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <CustomerDetails />
      <ServiceProduct />
      <Invoice />
      <ContractSummary />

      <img
        style={{ width: "100%", marginTop: "1rem" }}
        src="/service_pdf2.png"
        alt="Service PDF"
      />

      <div className="flex">
        <div className="flex-grow"></div>

        <div className={styles.approveDiv}>Approve</div>
      </div>

      <div onClick={handlePrint}>print</div>
    </div>
  );
};

export default Page;
