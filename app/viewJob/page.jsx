"use client";

import React, { useState, useEffect } from "react";

import JobDetails from "./jobDetails";
import SchedulePlan from "./schedulePlan";
import Members from "./members";
import Instruction from "./instruction";
import ResheduleTreatment from "./rescheduleTreat";

import { useSearchParams } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";

const Page = () => {
  const api = new APICall();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [fetchingData, setFetchingData] = useState(false);
  const [jobList, setQuoteList] = useState(null); // Change initial state to null
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    getAllJobs();
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
      <Members />
      <Instruction />
      <ResheduleTreatment />
      {/* <SchedulePlan /> */}
    </div>
  );
};

export default Page;
