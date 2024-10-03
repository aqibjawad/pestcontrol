"use client";

import React, { useState } from "react";
import styles from "../../styles/job.module.css";
import { Grid } from "@mui/material";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { job } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const RescheduleTreatment = ({ jobId }) => {
  const api = new APICall();

  const [job_date, setJobDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleFormSubmit = async () => {
    if (!job_date || !reason) {
      alert("Please fill in both date and reason fields");
      return;
    }

    setLoading(true);

    const formData = {
      job_id: jobId,
      job_date: job_date, // Using the state value
      reason: reason, // Using the state value
    };

    try {
      const response = await api.postDataWithTokn(
        `${job}/reschedule`,
        formData
      );

      if (response.error) {
        alert(response.error.error);
        console.log(response.error.error);
      } else {
        alert("Treatment rescheduled successfully!");
        // Optionally reset form
        setJobDate("");
        setReason("");
      }
    } catch (error) {
      console.error("Error rescheduling treatment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }} className={styles.mainDivTreat}>
      <Grid container spacing={2}>
        <Grid item lg={10} sm={12} xs={12} md={4}>
          <div className={styles.leftSection}>
            <div className={styles.treatHead}>Reschedule treatment</div>
          </div>
        </Grid>
      </Grid>

      <div className={styles.formReschedule}>
        <InputWithTitle
          onChange={(value) => setJobDate(value)}
          value={job_date}
          type={"date"}
          title={"Date"}
        />

        <div className="mt-5">
          <InputWithTitle
            onChange={(value) => setReason(value)}
            value={reason}
            title={"Reason"}
          />
        </div>

        <Grid container spacing={2}>
          <Grid item lg={6} sm={12} xs={12} md={4}>
            <div className={styles.reschBtn}>
              <div
                onClick={handleFormSubmit}
                className={styles.addText}
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                {isLoading ? "Rescheduling..." : "Reschedule"}
              </div>
            </div>
          </Grid>

          <Grid item lg={6} sm={12} xs={12} md={8}>
            <div className={styles.reschBtn}>
              <div className={styles.addText}> Start Job </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default RescheduleTreatment;
