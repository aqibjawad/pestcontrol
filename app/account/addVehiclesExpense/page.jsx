"use client";

import React from "react";

import { Grid, Radio, FormControlLabel } from "@mui/material";

import InputWithTitle from "../../../components/generic/InputWithTitle";

import styles from "../../../styles/stock.module.css";

import GreenButton from "@/components/generic/GreenButton";

const Page = () => {
  return (
    <div>
      <div className={styles.stockHead}>vehicles</div>

      <div className={styles.stockDescrp}>
        Thank you for choosing us to meet your needs. We look forward to serving
        you with excellenc
      </div>

      {/* Form section */}
      <Grid className={styles.fromGrid} container spacing={3}>
        <Grid item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Sr"} />
        </Grid>
        <Grid item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Vehicle number  "} />
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Fuel"} />
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Oil expense"} />
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Maintenance"} />
        </Grid>

        <Grid item lg={12} xs={12} sm={12} md={12}>
          <InputWithTitle title={" Total charges"} />
        </Grid>
      </Grid>

      <div className={styles.btnSubmitt}>
        <GreenButton title={"Submit"} />
      </div>
    </div>
  );
};

export default Page;
