"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/job.module.css";
import { Grid } from "@mui/material";
import InputWithTitle from "../../components/generic/InputWithTitle";
import InputWithTitle3 from "../../components/generic/InputWithTitle3";
import { job } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const RescheduleTreatment = ({ jobId, jobList }) => {
  const api = new APICall();
  const router = useRouter();

  const [job_date, setJobDate] = useState("");
  const [job_time, setJobTime] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState(jobList?.is_completed || 0);

  useEffect(() => {
    setJobStatus(jobList?.is_completed || 0);
  }, [jobList]);

  const handleFormSubmit = async () => {
    setLoading(true);

    // Combine date and time into the desired format: "YYYY-MM-DD HH:mm:ss"
    const combinedDateTime = `${job_date} ${job_time}:00`;

    const formData = {
      job_id: jobId,
      job_date: combinedDateTime, // Send combined date and time in "YYYY-MM-DD HH:mm:ss" format
      reason: reason,
    };

    try {
      const response = await api.postDataWithTokn(
        `${job}/reschedule`,
        formData
      );
      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
          text: `${response.message}`,
          icon: "success",
          confirmButtonText: "Ok",
        });
        router.push("/allJobs");
      } else {
        Swal.fire({
          title: "Error!",
          text: `${response.error.message}`,
          icon: "error",
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
      let response;
      if (jobStatus === 2) {
        response = await api.getDataWithToken(`${job}/move/complete/${jobId}`);
        const title = response.status === "success" ? "Success!" : "Error!";
        const text =
          response.status === "success"
            ? response.message
            : response.message || "Failed to complete job. Please try again.";

        Swal.fire({
          title,
          text,
          icon: response.status === "success" ? "success" : "error",
          confirmButtonText: "Ok",
        }).then(() => {
          if (response.status === "success") {
            window.location.reload();
          }
        });
      } else if (jobStatus === 0) {
        response = await api.getDataWithToken(`${job}/start/${jobId}`);
        const title = response.status === "success" ? "Success!" : "Error!";
        const text =
          response.status === "success"
            ? response.message
            : response.message || "Failed to start job. Please try again.";

        Swal.fire({
          title,
          text,
          icon: response.status === "success" ? "success" : "error",
          confirmButtonText: "Ok",
        }).then(() => {
          if (response.status === "success") {
            window.location.reload();
          }
        });
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

  const handleDateChange = (name, value) => {
    setJobDate(value);
  };

  const handleTimeChange = (name, value) => {
    setJobTime(value);
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
            <Grid container spacing={2}>
              <Grid item lg={4} sm={12} xs={12} md={4}>
                <InputWithTitle3
                  onChange={handleDateChange}
                  value={job_date}
                  title={"Date"}
                  type={"date"}
                />
              </Grid>

              <Grid item lg={4} sm={12} xs={12} md={4}>
                <InputWithTitle3
                  onChange={handleTimeChange}
                  value={job_time}
                  title={"Time"}
                  type={"time"}
                />
              </Grid>

              <Grid item lg={4} sm={12} xs={12} md={4}>
                <div className="">
                  <InputWithTitle
                    onChange={(value) => setReason(value)}
                    value={reason}
                    title={"Reason"}
                  />
                </div>
              </Grid>
            </Grid>
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
