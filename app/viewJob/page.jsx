"use client";

import React, { useState, useEffect } from "react";

import JobDetails from "./jobDetails";
import Members from "./members";
import Instruction from "./instruction";
import ResheduleTreatment from "./rescheduleTreat";

import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";

import GreenButton from "@/components/generic/GreenButton";

import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const [id, setId] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);
  const [jobList, setQuoteList] = useState(null); // Change initial state to null
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllJobs(id);
    }
  }, [id]);

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

  const handleAssignJob = () => {
    router.push(`/operations/assignJob?id=${jobList.id}`);
  };

  return (
    <div>
      <JobDetails jobList={jobList} />

      {/* Conditionally render Members and Instruction if caption_id is not null */}
      {/* {jobList?.captain_id !== null && (
        <>
     
        </>
      )} */}
      <Members jobList={jobList} />
      <Instruction jobList={jobList} />
      <ResheduleTreatment jobList={jobList} jobId={id} />

      {/* {jobList?.captain_id === null && (
        <>
          <GreenButton onClick={handleAssignJob} title={"Assign job"} />
        </>
      )} */}
    </div>
  );
};

export default Page;
