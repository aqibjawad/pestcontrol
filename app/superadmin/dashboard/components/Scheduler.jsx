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

const Scheduler = ({ isVisible }) => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getAllQuotes();
  }, [selectedDate, isVisible]); // Trigger API call when selectedDate changes

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
      <AllJobs isVisible={isVisible} />
    </div>
  );
};

export default Scheduler;
