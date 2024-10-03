import React from "react";
import { Grid, Skeleton } from "@mui/material"; // Import Grid and Skeleton from MUI
import styles from "../../styles/viewQuote.module.css";

const JobDetails = ({ jobList }) => {
  return (
    <div>
      <div className="pageTitle">
        {jobList?.user?.name ? jobList?.user?.name : <Skeleton width={100} />}
      </div>
      <div className="mb-10 mt-10">
        <div className={styles.quoteMain}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemTitle}>Job Title</div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemName}>
                {jobList?.job_title ? jobList?.job_title : <Skeleton width={150} />}
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className={styles.itemTitle}>Description</div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemName}>
                {jobList?.description ? jobList?.description : <Skeleton width={200} />}
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className={styles.itemTitle}>Reference</div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={styles.itemName}>
                {jobList?.user?.client?.referencable?.name ? jobList?.user?.client?.referencable?.name : <Skeleton width={150} />}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
