import React from "react";
import { Grid, Typography, Box } from "@mui/material";

const ClientDetails = ({ serviceReportList }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Business Name:</strong>{" "}
            {serviceReportList?.job?.user?.client?.firm_name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="right">
            <strong>Email:</strong> {serviceReportList?.job?.user?.email}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Location:</strong>{" "}
            {serviceReportList?.job?.client_address?.address}
          </Typography>
          <Typography variant="body2">
            <strong>Visit Type:</strong> {serviceReportList?.type_of_visit}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body2"
            align="right"
            style={{ marginLeft: "4rem" }}
          >
            <strong>Job:</strong>{" "}
            {new Date(serviceReportList?.job?.job_start_time).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
            &nbsp; / &nbsp;{" "}
            {new Date(serviceReportList?.job?.job_end_time).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </Typography>

          <Typography
            variant="body2"
            align="center"
            style={{ marginLeft: "5rem" }}
          >
            <strong>Job Id:</strong> {serviceReportList?.job?.id}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDetails;
