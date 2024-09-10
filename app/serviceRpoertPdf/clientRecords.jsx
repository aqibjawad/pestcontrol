import React from "react";
import styles from "../../styles/viewQuote.module.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";

const ClientRecords = () => {
  return (
    <div className={styles.clientRecord}>
      <div className={styles.clientHead}>Client records</div>

      <TableContainer sx={{ mt: 7 }}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell>
                <strong> Type </strong>
              </TableCell>
              <TableCell>
                <strong> Description </strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> category:</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Address :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Contact :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Contract Starting Date :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Contract Ending Date :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Area Size :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Type Of Pests: :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClientRecords;
