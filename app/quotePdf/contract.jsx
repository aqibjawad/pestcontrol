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

const ContractSummary = () => {
  const rows = [
    { name: "Frozen yogurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  ];

  return (
    <div className={styles.clientRecord}>
      <div className={styles.clientHead}> Contract Summary </div>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell align="center"> Service product </TableCell>
              <TableCell align="center"> No. of months </TableCell>
              <TableCell align="center"> Job type </TableCell>
              <TableCell align="center"> Rate </TableCell>
              <TableCell align="center"> Sub Total </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.calories}</TableCell>
                <TableCell align="center">{row.fat}</TableCell>
                <TableCell align="center">{row.carbs}</TableCell>
                <TableCell align="center">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContractSummary;
