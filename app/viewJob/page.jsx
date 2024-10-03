"use client";

import React, { useState, useEffect } from "react";

import JobDetails from "./jobDetails";
import SchedulePlan from "./schedulePlan";
import Members from "./members";
import Instruction from "./instruction";
import ResheduleTreatment from "./rescheduleTreat";

import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);
  const [jobList, setQuoteList] = useState(null); // Change initial state to null
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllJobs(urlId);
    }
  }, []);

  const getAllJobs = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/${id}`);
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false); // Set loadingDetails to false after fetching
    }
  };

  return (
    <div>
      <JobDetails jobList={jobList} />
      <Members jobList={jobList} />
      <Instruction jobList={jobList} />
      <ResheduleTreatment jobId={id} />
      {/* <SchedulePlan /> */}
    </div>
  );
};

export default Page;
