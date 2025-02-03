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

  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fetchingData, setFetchingData] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Get the current URL
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

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${clients}/jobs/get/${id}?start_date=${startDate}&end_date=${endDate}`
      );
      const data = response?.data?.client_jobs || [];
      setRowData(data);
    } catch (error) {
      setError(error.message);
      setRowData([]); // Ensure rowData is an empty array on error
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
        jobsList={rowData}
      />
    </div>
  );
};

export default withAuth(Page);
