"use client";

import React from "react";

import styles from "../../styles/job.module.css";

import { Grid } from "@mui/material";

import Dropdown from "../../components/generic/Dropdown";
import InputWithTitle from "../../components/generic/InputWithTitle";

const ResheduleTreatment = () => {
  const dateList = [
    { label: "Brand A", id: 1 },
    { label: "Brand B", id: 2 },
    { label: "Brand C", id: 3 },
    { label: "Brand D", id: 4 },
  ];

  const handleDropdownChange = (value) => {
    console.log("Selected value:", value);
  };

  return (
    <div style={{ marginTop: "2rem" }} className={styles.mainDivTreat}>
      <Grid container spacing={2}>
        <Grid item lg={10} sm={12} xs={12} md={4}>
          <div className={styles.leftSection}>
            <div className={styles.treatHead}>Reschedule treatment</div>
          </div>
        </Grid>

        <Grid item lg={2} sm={12} xs={12} md={8}>
          <div className={styles.addBtn}>
            <div className={styles.addText}> start job </div>
          </div>
        </Grid>
      </Grid>

      <div className={styles.formReschedule}>
        <Dropdown
          title={"Date"}
          options={dateList}
          onChange={handleDropdownChange}
        />

        <div className="mt-5">
          <InputWithTitle title={"Time"} />
        </div>

        <div className="mt-5">
          <Dropdown
            title={"Reason"}
            options={dateList}
            onChange={handleDropdownChange}
          />
        </div>

        <Grid container spacing={2}>
          <Grid item lg={6} sm={12} xs={12} md={4}>
            <div className={styles.reschBtn}>
              <div className={styles.addText}>Reschedule</div>
            </div>
          </Grid>

          <Grid item lg={6} sm={12} xs={12} md={8}>
            <div className={styles.reschBtn}>
              <div className={styles.addText}> Create report </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ResheduleTreatment;
