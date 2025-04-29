import React from "react";
import styles from "../../styles/viewQuote.module.css";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ContractSummary = ({ quote }) => {
  return (
    <div className={styles.clientRecord}>
      <div className={styles.clientHead}> Contract Summary </div>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell align="center"> Discount </TableCell>
              <TableCell align="center"> Vat </TableCell>
              <TableCell align="center"> Sub Total </TableCell>
              <TableCell align="center"> Grand Total </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">{quote?.dis_per}</TableCell>
              <TableCell align="center">{quote?.vat_per || 0}</TableCell>
              <TableCell align="center">{quote?.sub_total}</TableCell>
              <TableCell align="center">{quote?.grand_total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContractSummary;
