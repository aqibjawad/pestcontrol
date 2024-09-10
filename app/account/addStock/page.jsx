"use client";

import React from "react";

import { Grid, Radio, FormControlLabel } from "@mui/material";

import InputWithTitle from "../../../components/generic/InputWithTitle";

import styles from "../../../styles/stock.module.css";

import GreenButton from "@/components/generic/GreenButton";

const Page = () => {
  return (
    <div>
        <div className={styles.stockHead}>
            Stock Items 
        </div>
        
        <div className={styles.stockDescrp}>
            Thank you for choosing us to meet your needs. We look forward to serving you with excellenc
        </div>


        {/* Form section */}
      <Grid className={styles.fromGrid} container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Product Name"} />
        </Grid>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Remaining Stock"} />
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Total Stock"} />
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Date"} type="date" />
        </Grid>

        <Grid item lg={12} xs={12} sm={12} md={12}>
          <div className={styles.statusHead}>Status</div>
          <div className={styles.status}>
            <Grid container spacing={2} alignItems="center">
              {/* Checkbox 1 */}
              <Grid item>
                <FormControlLabel control={<Radio />} label="Stock" />
              </Grid>

              {/* Radio 2 */}
              <Grid item>
                <FormControlLabel control={<Radio />} label="Out of Stock" />
              </Grid>

            </Grid>
          </div>
        </Grid>
      </Grid>

      <div className={styles.btnSubmitt}>
            <GreenButton title={"Submit"} />
      </div>
    </div>
  );
};

export default Page;
