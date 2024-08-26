"use client";
import React from "react";
import { Grid } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";

import styles from "../../../styles/employess.module.css"

const Personal = () => {
  return (
    <div>
      <div className="pageTitle">Add Employee</div>
      <div className="mt-10"></div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Employee Name"}
            type={"text"}
            placeholder={"Please enter Employee name"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Phone Number"}
            type={"text"}
            placeholder={"Phone Number"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle title={"Email"} type={"text"} placeholder={"Email"} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Eid No"}
            type={"text"}
            placeholder={"Eid No"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Eid Start"}
            type={"text"}
            placeholder={"Eid Start"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Eid Expiry"}
            type={"text"}
            placeholder={"Eid Expiry"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Profession"}
            type={"text"}
            placeholder={"Profession"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Passport Number"}
            type={"text"}
            placeholder={"Passport Number"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Passport Start"}
            type={"text"}
            placeholder={"Passport Start"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Passport Expiry"}
            type={"text"}
            placeholder={"Passport Expiry"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Hi Status"}
            type={"text"}
            placeholder={"Hi Status"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Hi Start"}
            type={"text"}
            placeholder={"Hi Start"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputWithTitle
            title={"Hi Expiry"}
            type={"text"}
            placeholder={"Hi Expiry"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-3">
        <Grid item xs={12} sm={6} lg={6}>
          {/* <div className={styles.previous}>Previous</div> */}
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <div className={styles.next}>Next</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Personal;
