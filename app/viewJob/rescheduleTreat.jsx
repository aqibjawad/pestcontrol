"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/job.module.css";
import { Grid } from "@mui/material";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { job } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const RescheduleTreatment = ({ jobId, jobList }) => {
  const api = new APICall();
  const router = useRouter();

  const [job_date, setJobDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState(jobList?.is_completed || 0);

  useEffect(() => {
    setJobStatus(jobList?.is_completed || 0);
  }, [jobList]);
  
  const handleFormSubmit = async () => {
    if (!job_date || !reason) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in both date and reason fields",
        icon: "error",
        confirmButtonText: "Ok",
      });
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
      if (response.error.message) {
        Swal.fire({
          title: "Error!",
          text: response.error.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: response.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error rescheduling treatment:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async () => {
    setLoading(true);
    try {
      if (jobStatus === 2) {
        const response = await api.getDataWithToken(
          `${job}/move/complete/${jobId}`
        );
        if (response.status === "success") {
          Swal.fire({
            title: "Success!",
            text: response.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text:
              response.message || "Failed to complete job. Please try again.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else if (jobStatus === 0) {
        const response = await api.getDataWithToken(`${job}/start/${jobId}`);
        if (response.status === "success") {
          Swal.fire({
            title: "Success!",
            text:
              response.message || "Failed to complete job. Please try again.",
            icon: "success",
            confirmButtonText: "Ok",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "Failed to start job. Please try again.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    } catch (error) {
      console.error("Error with job action:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceReport = () => {
    router.push(`/serviceReport?id=${jobId}`);
  };

  const renderActionButton = () => {
    const buttonStyle = {
      cursor: isLoading ? "not-allowed" : "pointer",
      opacity: isLoading ? 0.5 : 1,
    };

    if (jobStatus === 0) {
      return (
        <>
          <Grid item lg={6} sm={12} xs={12} md={4}>
            <div className={styles.reschBtn}>
              <div
                onClick={handleFormSubmit}
                className={styles.addText}
                style={buttonStyle}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Reschedule"
                )}
              </div>
            </div>
          </Grid>
          <Grid item lg={6} sm={12} xs={12} md={4}>
            <div className={styles.reschBtn}>
              <div
                onClick={handleJobAction}
                className={styles.addText}
                style={buttonStyle}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Start Job"
                )}
              </div>
            </div>
          </Grid>
        </>
      );
    } else if (jobStatus === 2) {
      return (
        <Grid item lg={12} sm={12} xs={12} md={8}>
          <div className={styles.reschBtn}>
            <div
              onClick={handleJobAction}
              className={styles.addText}
              style={buttonStyle}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Complete Job"
              )}
            </div>
          </div>
        </Grid>
      );
    } else if (jobStatus === 1) {
      return (
        <Grid item lg={12} sm={12} xs={12} md={8}>
          <div className={styles.reschBtn}>
            <div
              onClick={handleServiceReport}
              className={styles.addText}
              style={buttonStyle}
            >
              Create Report
            </div>
          </div>
        </Grid>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: "2rem" }} className={styles.mainDivTreat}>
      {jobStatus === 0 && (
        <div>
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
          </div>
        </div>
      )}

      {jobStatus === 2 && (
        <div>
          <div className={styles.leftSection}>
            <div className={styles.treatHead}> Complete Your Job </div>
          </div>
        </div>
      )}

      {jobStatus === 1 && (
        <div>
          <div className={styles.leftSection}>
            <div className={styles.treatHead}> Create Report </div>
          </div>
        </div>
      )}

      <Grid container spacing={2}>
        {renderActionButton()}
      </Grid>
    </div>
  );
};

export default RescheduleTreatment;
