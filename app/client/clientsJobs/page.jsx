"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import "jspdf-autotable";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import UpcomingJobs from "../../../components/UpcomingJobs";
import { format } from "date-fns";

const getParamsFromUrl = (url) => {
  const parts = url.split("?");
  const params = {};
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    }
  }
  return params;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(null); // Changed initial state to null
  const [endDate, setEndDate] = useState(null); // Changed initial state to null
  const [fetchingData, setFetchingData] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = getParamsFromUrl(currentUrl);

    setId(urlParams.id);
    setSupplierName(urlParams.name || "");
    setPhoneNumber(urlParams.phone_number || "");
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchData(id);
    }
  }, [id, startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    let filtered;

    // First filter by assignment type
    switch (type) {
      case "assigned":
        filtered = rowData.filter((job) => {
          const isAssigned = job.captain?.name;
          if (startDate && endDate) {
            const jobDate = new Date(job.date);
            return (
              isAssigned &&
              jobDate >= new Date(startDate) &&
              jobDate <= new Date(endDate)
            );
          }
          return isAssigned;
        });
        break;

      case "not-assigned":
        filtered = rowData.filter((job) => {
          const isNotAssigned = !job.captain?.name;
          if (startDate && endDate) {
            const jobDate = new Date(job.date);
            return (
              isNotAssigned &&
              jobDate >= new Date(startDate) &&
              jobDate <= new Date(endDate)
            );
          }
          return isNotAssigned;
        });
        break;

      default:
        if (startDate && endDate) {
          filtered = rowData.filter((job) => {
            const jobDate = new Date(job.date);
            return (
              jobDate >= new Date(startDate) && jobDate <= new Date(endDate)
            );
          });
        } else {
          filtered = rowData; // Show all jobs when no date filter is applied
        }
    }

    setFilteredList(filtered);
  };

  const fetchData = async (id) => {
    setLoading(true);
    try {
      let url = `${clients}/jobs/get/${id}`;

      // Only add date parameters if both dates are selected
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }

      const response = await api.getDataWithToken(url);
      const data = response?.data?.client_jobs || [];
      setRowData(data);
    } catch (error) {
      setError(error.message);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UpcomingJobs
        handleDateChange={handleDateChange}
        handleFilter={handleFilter}
        currentFilter={filterType}
        isLoading={fetchingData}
        startDate={startDate}
        endDate={endDate}
        jobsList={filteredList.length > 0 ? filteredList : rowData}
      />
    </div>
  );
};

export default withAuth(Page);
