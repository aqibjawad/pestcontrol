// AllJobs.js
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
  const [currentUserId, setCurrentUserId] = useState(null);
  // Changed from single filter to array of filters for consistency
  const [filterTypes, setFilterTypes] = useState([]);
  // Add state for sort direction
  const [sortDirection, setSortDirection] = useState("asc"); // Default to ascending

  useEffect(() => {
    // Get user ID from local storage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setCurrentUserId(Number(userData.roleId));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    // Trigger getAllQuotes immediately when dates change
    getAllQuotes(start, end);
  };

  // Updated to handle multiple filter types
  const handleFilter = (filterString) => {
    const newFilters = filterString ? filterString.split(",") : [];
    setFilterTypes(newFilters);

    // Basic date filtering without extra filter criteria
    if (newFilters.length === 0) {
      if (startDate && endDate) {
        const filtered = jobsList.filter((job) => {
          const jobDate = new Date(job.job_date || job.date);
          const startDateTime = new Date(startDate);
          const endDateTime = new Date(endDate);

          // Adjust end date to include the entire day
          endDateTime.setHours(23, 59, 59, 999);

          return jobDate >= startDateTime && jobDate <= endDateTime;
        });
        setFilteredList(sortJobsByDate(filtered, sortDirection));
      } else {
        setFilteredList(sortJobsByDate(jobsList, sortDirection));
      }
      return;
    }

    // Filtering with both date and other criteria
    let filtered = jobsList;

    // First apply date filtering
    if (startDate && endDate) {
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.job_date || job.date);
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        // Adjust end date to include the entire day
        endDateTime.setHours(23, 59, 59, 999);

        return jobDate >= startDateTime && jobDate <= endDateTime;
      });
    }

    // Sort the filtered results
    filtered = sortJobsByDate(filtered, sortDirection);

    // Don't apply additional filters at parent level
    // Let child component (UpcomingJobs) handle status/assignment filters
    setFilteredList(filtered);
  };

  // Helper function to sort jobs by date
  const sortJobsByDate = (jobs, direction) => {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.job_date || a.date);
      const dateB = new Date(b.job_date || b.date);
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Function to toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    
    // Re-apply sorting to current filtered list
    if (filteredList.length > 0) {
      setFilteredList(sortJobsByDate(filteredList, newDirection));
    } else {
      setFilteredList(sortJobsByDate(jobsList, newDirection));
    }
  };

  useEffect(() => {
    getAllQuotes(startDate, endDate);
  }, []); // Only run on mount

  useEffect(() => {
    if (jobsList.length > 0) {
      // Log jobs to see what's coming from API
      console.log("Jobs from API:", jobsList);

      // Re-apply filters when jobsList changes
      handleFilter(filterTypes.join(","));
    }
  }, [jobsList, sortDirection]); // Added sortDirection dependency

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

      // Log API response to debug
      console.log("API Response:", response);

      if (!response.data || !Array.isArray(response.data)) {
        console.error("Invalid data format received:", response);
        setJobsList([]);
        return;
      }

      // Store unsorted data - sorting will be applied in handleFilter
      setJobsList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setJobsList([]);
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <div>
      {/* Add sort direction control */}
      {/* <div className="flex justify-end mb-2">
        <button 
          onClick={toggleSortDirection}
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        >
          Sort: {sortDirection === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </div> */}
      
      <UpcomingJobs
        isVisible={isVisible}
        jobsList={filteredList.length > 0 ? filteredList : sortJobsByDate(jobsList, sortDirection)}
        handleDateChange={handleDateChange}
        handleFilter={handleFilter}
        currentFilter={filterTypes.join(",")}
        isLoading={fetchingData}
        startDate={startDate}
        endDate={endDate}
        currentUserId={currentUserId}
        sortDirection={sortDirection}
        toggleSortDirection={toggleSortDirection}
      />
    </div>
  );
};

export default AllJobs;