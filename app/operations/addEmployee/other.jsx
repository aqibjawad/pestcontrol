import React from "react";

import styles from "../../../styles/employess.module.css";

import { Grid } from "@mui/material";

import InputWithTitle from "@/components/generic/InputWithTitle";

const OtherInfo = () => {
  return (
    <div>
      <div style={{marginTop:"3rem"}} className={styles.mainHead}>Emergency Contact</div>

      <Grid container spacing={3} className="mt-5">
        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Name"}
            type={"text"}
            placeholder={"Please Employee name"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Relation"}
            type={"text"}
            placeholder={"Relation"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <InputWithTitle
            title={"Emergency Contact"}
            type={"text"}
            placeholder={"Emergency Contact"}
          />
        </Grid>
      </Grid>

      <div style={{marginTop:"5rem"}} className={styles.mainHead}>Financial Condition</div>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={12} sm={6} lg={6}>
          <InputWithTitle
            title={"Basic Salary"}
            type={"text"}
            placeholder={"Please Basic Salary"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <InputWithTitle
            title={"Allowance"}
            type={"text"}
            placeholder={"Allowance"}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <InputWithTitle title={"Other"} type={"text"} placeholder={"Other"} />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <InputWithTitle title={"Total Salary"} type={"text"} placeholder={"Total Salary"} />
        </Grid>
      </Grid>
    </div>
  );
};

export default OtherInfo;
