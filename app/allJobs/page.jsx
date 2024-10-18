"use client";

import React, {useState, useEffect} from "react";

import UpcomingJobs from "../../components/UpcomingJobs"

import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";

import { format } from "date-fns";

const Page =()=>{

  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [jobsList, setJobsList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };


  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);
 
  const getAllQuotes = async () => {
    setFetchingData(true);
    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(`${job}/all?${queryParams.join("&")}`);
      setJobsList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return(
    <div>
        <UpcomingJobs jobsList={jobsList} handleDateChange={handleDateChange} />
    </div>
  )
} 

export default Page;