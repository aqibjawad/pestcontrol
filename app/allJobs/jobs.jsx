"use client";

import React, { useState, useEffect } from "react";
import UpcomingJobs from "../../components/UpcomingJobs";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import { format } from "date-fns";

const AllJobs = ({ isVisible }) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filteredList, setFilteredList] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    // Trigger getAllQuotes immediately when dates change
    getAllQuotes(start, end);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    let filtered;

    // First filter by assignment type
    switch (type) {
      case "assigned":
        filtered = jobsList.filter((job) => {
          const isAssigned = job.captain?.name;
          const jobDate = new Date(job.date);
          const startDateTime = startDate ? new Date(startDate) : null;
          const endDateTime = endDate ? new Date(endDate) : null;

          if (startDateTime && endDateTime) {
            return (
              isAssigned && jobDate >= startDateTime && jobDate <= endDateTime
            );
          }
          return isAssigned;
        });
        break;

      case "not-assigned":
        filtered = jobsList.filter((job) => {
          const isNotAssigned = !job.captain?.name;
          const jobDate = new Date(job.date);
          const startDateTime = startDate ? new Date(startDate) : null;
          const endDateTime = endDate ? new Date(endDate) : null;

          if (startDateTime && endDateTime) {
            return (
              isNotAssigned &&
              jobDate >= startDateTime &&
              jobDate <= endDateTime
            );
          }
          return isNotAssigned;
        });
        break;

      default:
        if (startDate && endDate) {
          filtered = jobsList.filter((job) => {
            const jobDate = new Date(job.date);
            return (
              jobDate >= new Date(startDate) && jobDate <= new Date(endDate)
            );
          });
        } else {
          filtered = jobsList;
        }
    }

    setFilteredList(filtered);
  };

  useEffect(() => {
    getAllQuotes(startDate, endDate);
  }, []); // Only run on mount

  useEffect(() => {
    handleFilter(filterType);
  }, [jobsList, startDate, endDate, filterType]); // Added dependencies

  const getAllQuotes = async (start = startDate, end = endDate) => {
    setFetchingData(true);
    const queryParams = [];

    if (start && end) {
      queryParams.push(`start_date=${start}`);
      queryParams.push(`end_date=${end}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${job}/all?${queryParams.join("&")}`
      );

      // Sort jobsList by date in descending order
      const sortedData = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

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
        isVisible={isVisible}
        jobsList={filteredList.length > 0 ? filteredList : jobsList}
        handleDateChange={handleDateChange}
        handleFilter={handleFilter}
        currentFilter={filterType}
        isLoading={fetchingData}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default AllJobs;
