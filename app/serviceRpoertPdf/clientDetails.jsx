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
    <div className={styles.quoteMain}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Customer Name:</strong>
                  </TableCell>
                  <TableCell> {serviceReportList?.job?.user?.name} </TableCell>
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
                    <strong> Customer Email:</strong>
                  </TableCell>
                  <TableCell> {serviceReportList?.job?.user?.email} </TableCell>
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
