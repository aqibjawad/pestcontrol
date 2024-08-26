import React from "react";

import styles from "../../../styles/employess.module.css";

import { Grid } from "@mui/material";

import InputWithTitle from "@/components/generic/InputWithTitle";

const Insurance = () => {
  return (
    <div>
      <div style={{ marginTop: "3rem" }} className={styles.mainHead}>
        Health Insurance
      </div>

      <Grid container spacing={3} className="mt-5">
        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Health Insurance Status"}
            type={"text"}
            placeholder={"Health Insurance Status"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Insurance Start"}
            type={"Date"}
            placeholder={"Insurance Start"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Insurance end"}
            type={"Date"}
            placeholder={"Insurance end"}
          />
        </Grid>
      </Grid>

      <div style={{ marginTop: "5rem" }} className={styles.mainHead}>
        Unemployment insurance
      </div>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Unemployment insurance Status"}
            type={"text"}
            placeholder={"Please Unemployment insurance Status"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Insurance Start"}
            type={"Date"}
            placeholder={"Insurance Start"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Insurance end"}
            type={"Date"}
            placeholder={"Insurance end"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"DM Card"}
            type={"text"}
            placeholder={"DM Card"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Card Status"}
            type={"text"}
            placeholder={"Card Status"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Card Expiry"}
            type={"text"}
            placeholder={"Card Expiry"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-3">
        <Grid item xs={12} sm={6} lg={6}>
          <div className={styles.previous}>
            Previous
          </div>
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
            <div className={styles.next}>
                Next
            </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Insurance;
