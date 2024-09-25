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

const CustomerDetails = ({ quote }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle no date case
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options); // Formats to "Month Day, Year"
  };

  return (
    <div className={styles.quoteMain}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer sx={{ mt: 6 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Customer:</strong>
                  </TableCell>
                  <TableCell> {quote?.user?.name} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Reference:</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {quote?.user?.client?.referencable?.name}{" "}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job title: </strong>
                  </TableCell>
                  <TableCell> {quote?.quote_title} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Country: </strong>
                  </TableCell>
                  <TableCell> UAE </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Priority: </strong>
                  </TableCell>
                  <TableCell> High </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Date: </strong>
                  </TableCell>
                  <TableCell> {formatDate(quote?.updated_at)} </TableCell>
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
                    <strong> Job type : </strong>
                  </TableCell>
                  <TableCell> Reoccuring </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Duration: </strong>
                  </TableCell>
                  <TableCell> {quote?.duration_in_months} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> VAT: </strong>
                  </TableCell>
                  <TableCell> {quote?.vat} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> TRN: </strong>
                  </TableCell>
                  <TableCell> {quote?.trn} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Firm: </strong>
                  </TableCell>
                  <TableCell> {quote?.user?.client?.firm_name} </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerDetails;
