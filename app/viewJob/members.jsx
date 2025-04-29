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
  Typography,
  Chip,
} from "@mui/material";
import SearchInput from "../../components/generic/SearchInput";

const Members = ({ jobList, loading }) => {
  const [crewMembers, setCrewMembers] = useState([]);

  useEffect(() => {
    if (jobList !== undefined) {
      const allMembers = [];

      // Add captain if available
      if (jobList?.captain) {
        allMembers.push({
          ...jobList.captain,
          role: "Captain",
        });
      }

      // Add team members if available
      if (jobList?.team_members && Array.isArray(jobList.team_members)) {
        jobList.team_members.forEach((member) => {
          allMembers.push({
            ...member,
            role: "Team Member",
          });
        });
      }

      setCrewMembers(allMembers);
    }
  }, [jobList]);

  return (
    <div className={styles.mainDiv} style={{marginTop:"2rem"}}>
      <Grid container spacing={2}>
        <Grid item lg={8} sm={12} xs={12} md={4}>
          <div className={styles.leftSection}>
            <div className={styles.treatHead}>Crew Members</div>
          </div>
        </Grid>
      </Grid>

      <div className={styles.tableSec}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Show skeleton loading state
                Array(3)
                  .fill()
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  ))
              ) : crewMembers.length > 0 ? (
                // Show crew members
                crewMembers.map((member) => (
                  <TableRow key={`${member.role}-${member.id}`}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.role}
                        color={
                          member.role === "Captain" ? "primary" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Show message when no crew members available
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No crew members assigned to this job
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Members;
