"use client";

import React from "react";

import { Grid } from "@mui/material";

import InputWithTitle from "../../../components/generic/InputWithTitle";

import styles from "../../../styles/expenses.module.css";

const Page = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={6} xs={12} sm={6} md={4}>
        <div className={styles.expenseText}>Expense</div>
        <div className={styles.picDiv}>
          <div className={styles.imageDiv}>
            <img SRC="/addImage.svg" />
          </div>
          <div className={styles.imageText}>
            Browse and chose the files you want to upload from your computer
          </div>
        </div>
      </Grid>

      <Grid item lg={6} xs={12} sm={6} md={4}></Grid>
    </Grid>
  );
};

export default Page;
