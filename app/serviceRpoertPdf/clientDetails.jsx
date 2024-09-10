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

const ClientDetails = () => {
  return (
    <div className={styles.quoteMain}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <div className={styles.customerDetails}>Customer details</div>
          <TableContainer sx={{ mt: 2 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Customer id:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Contract #:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Total # of Visits Up To Date:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer sx={{ mt: 7 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Customer id:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Contract #:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Total # of Visits Up To Date:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
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
