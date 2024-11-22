import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Skeleton,
} from "@mui/material";

import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";

import AllJobs from "../../../allJobs/jobs";

const Scheduler = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getAllQuotes();
  }, [selectedDate]); // Trigger API call when selectedDate changes

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const startDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const endDate = selectedDate.toISOString().split("T")[0]; // Same as start date for a single day

      const response = await api.getDataWithToken(
        `${job}/all?start_date=${startDate}&end_date=${endDate}`
      );
      setQuoteList(response.data); // Assuming the response data is the job list
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const filteredJobs = quoteList?.filter((job) => {
    const jobUpdateDate = new Date(job?.updated_at); // Convert 'updated_at' string to Date object
    return isSameDay(jobUpdateDate, selectedDate); // Compare selected date with job's updated_at
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* <Grid container spacing={3}>
        <Grid item lg={4} xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Select a Date
          </Typography>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            showNavigation={true}
          />
        </Grid>

        <Grid lg={8} item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Job Schedule
          </Typography>

          {fetchingData ? (
            <Skeleton variant="rectangular" width="100%" height={300} />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Name</TableCell>
                    <TableCell>Billing Method</TableCell>
                    <TableCell> Contract Start </TableCell>
                    <TableCell>Contract End</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobs?.length > 0 ? (
                    filteredJobs?.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.quote_title}</TableCell>
                        <TableCell>{job.billing_method}</TableCell>
                        <TableCell>{job.contract_start_date}</TableCell>
                        <TableCell>{job.contract_end_date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No jobs updated on this date.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid> */}
      <AllJobs />
    </div>
  );
};

export default Scheduler;
