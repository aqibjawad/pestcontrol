"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/job.module.css";
import { Grid, Tabs, Tab, Box } from "@mui/material";
import InputWithTitle from "../../components/generic/InputWithTitle";
import InputWithTitle3 from "../../components/generic/InputWithTitle3";
import { job, contract } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const RescheduleTreatment = ({ jobId, jobList }) => {
  console.log(jobList, "job list");

  const api = new APICall();
  const router = useRouter();

  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState(jobList?.is_completed || 0);
  const [activeTab, setActiveTab] = useState(0);
  const [completeRescheduleData, setCompleteRescheduleData] = useState({
    job_date: "",
    job_time: "",
    reason: "",
  });

  // Check if there's only one service or multiple services
  const hasSingleService = jobList?.job_services?.length === 1;

  useEffect(() => {
    setJobStatus(jobList?.is_completed || 0);

    // Initialize service data from jobList.job_services
    if (jobList && jobList.job_services && jobList.job_services.length > 0) {
      const initialServiceData = jobList.job_services.map((service) => ({
        job_service_id: service.id,
        job_date: "",
        job_time: "",
        reason: "",
      }));
      setServiceData(initialServiceData);
    }
  }, [jobList]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleServiceFormSubmit = async (serviceIndex) => {
    setLoading(true);

    const service = serviceData[serviceIndex];

    // Combine date and time into the desired format: "YYYY-MM-DD HH:mm:ss"
    const combinedDateTime = `${service.job_date} ${service.job_time}:00`;

    // Create the new API request format
    const formData = {
      quote_id: jobList?.quote_id || 0,
      job_id: jobId,
      services: [
        {
          job_service_id: service.job_service_id,
          reason: service.reason,
          job_date: combinedDateTime,
        },
      ],
    };

    try {
      const response = await api.postDataWithTokn(
        `${contract}/service/reschedule`,
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
          text: `${response.error?.message || "An error occurred"}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error rescheduling service:", error);
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

  // Function to reschedule multiple services at once
  const handleMultipleServicesReschedule = async () => {
    setLoading(true);

    // Filter out services that have date and time filled
    const servicesToReschedule = serviceData.filter(
      (service) => service.job_date && service.job_time
    );

    if (servicesToReschedule.length === 0) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in date and time for at least one service to reschedule.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      setLoading(false);
      return;
    }

    // Format services for API request
    const formattedServices = servicesToReschedule.map((service) => ({
      job_service_id: service.job_service_id,
      reason: service.reason || "Reschedule requested",
      job_date: `${service.job_date} ${service.job_time}:00`,
    }));

    const formData = {
      quote_id: jobList?.quote_id || 0,
      job_id: jobId,
      services: formattedServices,
    };

    try {
      const response = await api.postDataWithTokn(
        `${contract}/service/reschedule`,
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
          text: `${response.error?.message || "An error occurred"}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error rescheduling services:", error);
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

  const handleCompleteRescheduleSubmit = async () => {
    setLoading(true);

    // Combine date and time into the desired format: "YYYY-MM-DD HH:mm:ss"
    const combinedDateTime = `${completeRescheduleData.job_date} ${completeRescheduleData.job_time}:00`;

    const formData = {
      job_id: jobId,
      job_date: combinedDateTime,
      reason: completeRescheduleData.reason,
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
          text: `${response.error?.message || "An error occurred"}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error rescheduling job:", error);
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

  const handleCompleteInputChange = (field, value) => {
    setCompleteRescheduleData({
      ...completeRescheduleData,
      [field]: value,
    });
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

  const handleServiceInputChange = (serviceIndex, field, value) => {
    const updatedServiceData = [...serviceData];
    updatedServiceData[serviceIndex] = {
      ...updatedServiceData[serviceIndex],
      [field]: value,
    };
    setServiceData(updatedServiceData);
  };

  const renderActionButton = () => {
    const buttonStyle = {
      cursor: isLoading ? "not-allowed" : "pointer",
      opacity: isLoading ? 0.5 : 1,
    };

    // Check if captain and captain_id are both null
    const isCaptainAssigned =
      jobList && (jobList.captain !== null || jobList.captain_id !== null);

    if (jobStatus === 0) {
      // Only show Start Job button if captain is assigned
      return isCaptainAssigned ? (
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
      ) : null;
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

  // Render the whole job form (used for both single service and tab view whole job option)
  const renderWholeJobForm = () => (
    <div
      className={styles.formReschedule}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #eaeaea",
        borderRadius: "5px",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>
        {hasSingleService ? "Reschedule Service" : "Reschedule Complete Job"}
      </h3>
      <Grid container spacing={2}>
        <Grid item lg={4} sm={12} xs={12} md={4}>
          <InputWithTitle3
            onChange={(name, value) =>
              handleCompleteInputChange("job_date", value)
            }
            value={completeRescheduleData.job_date}
            title={"Date"}
            type={"date"}
          />
        </Grid>
        <Grid item lg={4} sm={12} xs={12} md={4}>
          <InputWithTitle3
            onChange={(name, value) =>
              handleCompleteInputChange("job_time", value)
            }
            value={completeRescheduleData.job_time}
            title={"Time"}
            type={"time"}
          />
        </Grid>
        <Grid item lg={4} sm={12} xs={12} md={4}>
          <div className="">
            <InputWithTitle
              onChange={(value) => handleCompleteInputChange("reason", value)}
              value={completeRescheduleData.reason}
              title={"Reason"}
            />
          </div>
        </Grid>
      </Grid>

      <div style={{ marginTop: "15px", textAlign: "right" }}>
        <button
          onClick={handleCompleteRescheduleSubmit}
          disabled={isLoading}
          className={styles.addText}
          style={{
            padding: "8px 15px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
            display: "inline-block",
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );

  // Render services form for multiple services
  const renderServicesForms = () => (
    <div>
      {jobList &&
        jobList.job_services &&
        jobList.job_services.map((service, index) => (
          <div
            key={service.id}
            className={styles.formReschedule}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #eaeaea",
              borderRadius: "5px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>
              {service?.service?.service_title}
            </h3>
            <Grid container spacing={2}>
              <Grid item lg={4} sm={12} xs={12} md={4}>
                <InputWithTitle3
                  onChange={(name, value) =>
                    handleServiceInputChange(index, "job_date", value)
                  }
                  value={serviceData[index]?.job_date || ""}
                  title={"Date"}
                  type={"date"}
                />
              </Grid>

              <Grid item lg={4} sm={12} xs={12} md={4}>
                <InputWithTitle3
                  onChange={(name, value) =>
                    handleServiceInputChange(index, "job_time", value)
                  }
                  value={serviceData[index]?.job_time || ""}
                  title={"Time"}
                  type={"time"}
                />
              </Grid>

              <Grid item lg={4} sm={12} xs={12} md={4}>
                <div className="">
                  <InputWithTitle
                    onChange={(value) =>
                      handleServiceInputChange(index, "reason", value)
                    }
                    value={serviceData[index]?.reason || ""}
                    title={"Reason"}
                  />
                </div>
              </Grid>
            </Grid>

            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button
                onClick={() => handleServiceFormSubmit(index)}
                disabled={isLoading}
                className={styles.addText}
                style={{
                  padding: "8px 15px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1,
                  display: "inline-block",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Reschedule Service"
                )}
              </button>
            </div>
          </div>
        ))}

      {/* Add a button to reschedule multiple services at once */}
      {jobList?.job_services?.length > 1 && (
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button
            onClick={handleMultipleServicesReschedule}
            disabled={isLoading}
            className={styles.addText}
            style={{
              padding: "10px 20px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.5 : 1,
              display: "inline-block",
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Reschedule All Selected Services"
            )}
          </button>
        </div>
      )}
    </div>
  );

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

          {/* Hide tabs if there's only one service */}
          {!hasSingleService && (
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="reschedule tabs"
              >
                <Tab label="Whole Job" />
                <Tab label="By Services" />
              </Tabs>
            </Box>
          )}

          {/* Display logic based on single service or tabs */}
          {hasSingleService ? (
            // For single service, always show the whole job form
            renderWholeJobForm()
          ) : (
            // For multiple services, show based on active tab
            <>
              {activeTab === 0 && renderWholeJobForm()}
              {activeTab === 1 && renderServicesForms()}
            </>
          )}
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
