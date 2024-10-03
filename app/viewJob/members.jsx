import React, { useEffect, useState } from "react";
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
  Skeleton, // Import Skeleton from MUI
} from "@mui/material";
import SearchInput from "../../components/generic/SearchInput";

const Members = ({ jobList, loading }) => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    if (jobList !== undefined && jobList?.team_members !== undefined) {
      setTeam(jobList?.team_members);
    }
  }, [jobList]);

  return (
    <div className={styles.mainDiv}>
      <Grid container spacing={2}>
        <Grid item lg={8} sm={12} xs={12} md={4}>
          <div className={styles.leftSection}>
            <div className={styles.treatHead}>Crew Members</div>
          </div>
        </Grid>

        <Grid item lg={4} sm={12} xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item lg={8} sm={12} xs={12} md={4}>
              <div className={styles.leftSection}>
                <SearchInput />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div className={styles.tableSec}>
        <TableContainer
          component={Paper}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell> {/* Assuming role is still relevant */}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Display Skeletons while loading
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rect" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              ) : (
                team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member?.id}</TableCell>
                    <TableCell>{member?.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role_id}</TableCell> {/* Or another property, if you have roles mapped */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Members;
