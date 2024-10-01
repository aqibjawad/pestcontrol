import React from "react";
import { Grid } from "@mui/material"; // Import Grid from MUI
import styles from "../../styles/viewQuote.module.css";

const JobDetails = ({ jobList }) => {
  return (
    <div>
      <div className="pageTitle"> {jobList?.user?.name} </div>
      <div className="mb-10 mt-10">
        <div className={styles.quoteMain}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemTitle}>Job Title</div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemName}> {jobList?.job_title} </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className={styles.itemTitle}>Description</div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemName}> {jobList?.description} </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className={styles.itemTitle}>Reference</div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemName}> {jobList?.user?.client?.referencable?.name} </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
