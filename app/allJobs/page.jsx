// Page.js
"use client";

import React, { useState, useEffect } from "react";
import UpcomingJobs from "../../components/UpcomingJobs";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import { format } from "date-fns";

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    let filtered;
    
    switch(type) {
      case 'assigned':
        filtered = jobsList.filter(job => job.captain?.name);
        break;
      case 'not-assigned':
        filtered = jobsList.filter(job => !job.captain?.name);
        break;
      default:
        filtered = jobsList;
    }
    
    setFilteredList(filtered);
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  useEffect(() => {
    handleFilter(filterType);
  }, [jobsList]);

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
      const response = await api.getDataWithToken(
        `${job}/all?${queryParams.join("&")}`
      );

      // Sort jobsList by date in descending order
      const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setJobsList(sortedData);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <div> 
      <UpcomingJobs 
        jobsList={filteredList.length > 0 ? filteredList : jobsList} 
        handleDateChange={handleDateChange}
        handleFilter={handleFilter}  // Changed from handleAssignmentFilter to handleFilter
        currentFilter={filterType}
        isLoading={fetchingData} 
      />
    </div>
  );
};

export default Page;
