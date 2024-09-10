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

const VisitRecords = () => {
  return (
    <div className={styles.clientRecord}>
      <div className={styles.clientHead}> Visit Records </div>

      <TableContainer sx={{ mt: 7 }}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell>
                <strong> Sr </strong>
              </TableCell>

              <TableCell>
                <strong> Date </strong>
              </TableCell>

              <TableCell>
                <strong> Type of visits </strong>
              </TableCell>

              <TableCell>
                <strong> Service report # </strong>
              </TableCell>

              <TableCell>
                <strong> Rodent Lvl of Infestation </strong>
              </TableCell>

              <TableCell>
                <strong> Flying Insects Lvl of Infestation </strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> category:</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Address :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
            </TableRow>

            <TableRow sx={{ border: "none" }}>
              <TableCell>
                <strong> Contact :</strong>
              </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
              <TableCell> 45d46 </TableCell>
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

export default VisitRecords;
