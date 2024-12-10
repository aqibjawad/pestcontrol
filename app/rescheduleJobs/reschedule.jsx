"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const RescheduleJobs = () => {
  // Sample data for jobs, replace this with actual API data fetching
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showLoading, setShowLoading] = useState(true); // Set to false when data is loaded

  useEffect(() => {
    // Mock fetching jobs data
    setTimeout(() => {
      setFilteredJobs([
        {
          id: 1,
          user: { name: "John Doe", client: { phone_number: "1234567890" } },
          job_date: "2024-12-10T10:00:00Z",
          job_title: "Service Call",
          reschedule_dates: [],
          captain_id: null,
          is_completed: 0,
          report: null,
        },
        // Add more jobs here...
      ]);
      setShowLoading(false); // Set to false after data is fetched
    }, 2000);
  }, []);

  const renderSkeletonRows = () =>
    [...Array(5)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(7)].map((_, colIdx) => (
          <TableCell key={colIdx}>
            <Skeleton variant="text" width={100 + colIdx * 10} height={25} />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderJobRows = () =>
    filteredJobs?.map((row, index) => (
      <TableRow key={index}>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row?.user?.name}</TableCell>
        <TableCell>View Details</TableCell>
      </TableRow>
    ));

  return (
    <div>
      <div className="pageTitle">Upcoming Jobs</div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showLoading ? renderSkeletonRows() : renderJobRows()}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RescheduleJobs;
