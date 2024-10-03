"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/job.module.css";
import { Grid } from "@mui/material";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { job } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const RescheduleTreatment = ({ jobId, jobList }) => {

  console.log(jobList?.is_completed);
  
  const api = new APICall();

  const [job_date, setJobDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [jobStatus, setJobStatus] = useState(jobList?.is_completed || "0");

  const handleFormSubmit = async () => {
    if (!job_date || !reason) {
      alert("Please fill in both date and reason fields");
      return;
    }

    setLoading(true);

    const formData = {
      job_id: jobId,
      job_date: job_date,
      reason: reason,
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

  useEffect(() => {
    setJobStatus(jobList?.is_completed || "0");
  }, [jobList]);

  const handleJobAction = async () => {
    setLoading(true);
    try {
      if (jobStatus === "2") {
        const response = await api.getDataWithToken(`${job}/move/complete/${jobId}`);
        if (response.success) {
          alert("Job completed successfully!");
          setJobStatus("3"); // Assuming "3" means completed
        } else {
          alert(response.message || "Failed to complete job. Please try again.");
        }
      } else {
        const response = await api.getDataWithToken(`${job}/start/${jobId}`);
        if (response.success) {
          alert("Job started successfully!");
          setJobStatus("2"); // "2" means started
        } else {
          alert(response.message || "Failed to start job. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error with job action:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getJobActionText = () => {
    if (isLoading) return jobStatus === "2" ? "Completing..." : "Starting...";
    if (jobStatus === "0") return "Start Job";
    if (jobStatus === "2") return "Complete Job";
    return "Job Completed";
  };

  const isJobActionDisabled = jobStatus === "3" || isLoading;

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
              <div
                onClick={isJobActionDisabled ? undefined : handleJobAction}
                className={styles.addText}
                style={{ 
                  cursor: isJobActionDisabled ? "not-allowed" : "pointer",
                  opacity: isJobActionDisabled ? 0.5 : 1
                }}
              >
                {getJobActionText()}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default RescheduleTreatment;
