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
import { quotation } from "@/networkUtil/Constants";

const Scheduler = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const contactsResponse = await api.getDataWithToken(
        `${quotation}/contracted`
      );
      setQuoteList(contactsResponse.data); // Assuming the data includes `updated_at` field
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Function to parse and compare job date with selected calendar date
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter jobs by `updated_at` field
  const filteredJobs = quoteList.filter((job) => {
    const jobUpdateDate = new Date(job.updated_at); // Convert 'updated_at' string to Date object
    return isSameDay(jobUpdateDate, selectedDate); // Compare selected date with job's updated_at
  });

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {/* Calendar Section */}
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

        {/* Table Section */}
        <Grid lg={8} item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Job Schedule
          </Typography>

          {fetchingData ? (
            // MUI Skeleton while loading
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
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.quote_title}</TableCell>
                        <TableCell>{job.billing_method}</TableCell>
                        <TableCell>
                          {job.contract_start_date}
                        </TableCell>
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
      </Grid>
    </div>
  );
};

export default Scheduler;
