"use client";

import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import styles from "../../styles/job.module.css";
import MultiInput from "../../components/generic/MultilineInput";

const Instruction = ({ jobList, loading }) => {

  const [reschedule, setReschedule] = useState([]);
  

  useEffect(() => {
    if (jobList !== undefined) {
      if (jobList?.team_members !== undefined) {
        setReschedule(jobList?.reschedule_dates);
      }
    }
  }, [jobList]);

  return (
    <div>
      <div className={styles.mainText}>Job instructions</div>

      <div>
        <MultiInput value={jobList?.job_instructions} readonly />
      </div>

      <div style={{ marginTop: "20px" }}>
         <div className={styles.treatHead}>Reschedule treatment</div>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Current Date</TableCell>
                  <TableCell>Reschedule Date</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{new Date(jobList?.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{reschedule[0]?.job_date}</TableCell>
                  <TableCell>{reschedule[0]?.reason}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Instruction;
