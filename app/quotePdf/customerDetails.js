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

const CustomerDetails = () => {
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
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Reference:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Contract person:</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Total quotations :</strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job title: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Country: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Priority: </strong>
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
                    <strong> Date: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job type : </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Duration: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> VAT: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> TRN: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Firm: </strong>
                  </TableCell>
                  <TableCell> 45d46 </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Priority: </strong>
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

export default CustomerDetails;
