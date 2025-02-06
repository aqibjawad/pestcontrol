import React from "react";

import styles from "../../styles/viewQuote.module.css";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const ClientDetails = ({ serviceReportList }) => {
  return (
    <div className={styles.serviceQuoteMain}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Name:</strong>
                  </TableCell>
                  <TableCell> {serviceReportList?.job?.user?.name} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job Start:</strong>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      serviceReportList?.job?.job_start_time
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(
                      serviceReportList?.job?.job_start_time
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Visit Type:</strong>
                  </TableCell>
                  <TableCell> {serviceReportList?.type_of_visit} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Invoice Id:</strong>
                  </TableCell>
                  <TableCell> {serviceReportList?.service_invoice || "No invoice"} </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Email:</strong>
                  </TableCell>
                  <TableCell> {serviceReportList?.job?.user?.email} </TableCell>
                </TableRow>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job End:</strong>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      serviceReportList?.job?.job_end_time
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(
                      serviceReportList?.job?.job_end_time
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default ClientDetails;
