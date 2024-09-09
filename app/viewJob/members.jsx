import React from "react";
import styles from "../../styles/job.module.css";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import SearchInput from "../../components/generic/SearchInput";

const Members = () => {
  const sampleData = [
    {
      id: 1,
      name: "John Doe",
      role: "Developer",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Designer",
      email: "jane.smith@example.com",
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "Project Manager",
      email: "bob.johnson@example.com",
    },
  ];

  return (
    <div className={styles.mainDiv}>
      <Grid container spacing={2}>
        <Grid item lg={8} sm={12} xs={12} md={4}>
          <div className={styles.leftSection}> Core Members </div>
        </Grid>

        <Grid item lg={4} sm={12} xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item lg={8} sm={12} xs={12} md={4}>
              <div className={styles.leftSection}>
                <SearchInput />
              </div>
            </Grid>

            <Grid item lg={4} sm={12} xs={12} md={8}>
              <div className={styles.addBtn}>
                <div className={styles.addText}>+ Add</div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div className={styles.tableSec}>
        <TableContainer component={Paper} style={{ marginTop: "20px", marginBottom:"20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Members;
