"use client";

import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Skeleton,
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
      const rows = jobList?.reschedule_dates || [];
      setReschedule(rows); // Set the reschedule state with the fetched rows
    }
  }, [jobList]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options); // You can change 'en-US' to your preferred locale
  };

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <div className={styles.treatHead}>Schedules Dates</div>
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
                {reschedule.length > 0
                  ? reschedule.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{`${new Date(item.job_date).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}`}</TableCell>
                        <TableCell>
                          {`${new Date(item.job_date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`}
                        </TableCell>
                        <TableCell>{item.reason}</TableCell>
                      </TableRow>
                    ))
                  : // Show skeletons if there are no reschedule entries
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <div className={styles.mainText}>Job instructions</div>

      <div>
        <MultiInput value={jobList?.job_instructions} readonly />
      </div>
    </div>
  );
};

export default Instruction;
