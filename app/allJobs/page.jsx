"use client";

import React, {useState, useEffect} from "react";

import UpcomingJobs from "../../components/UpcomingJobs"

import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";

const Page =()=>{

  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [jobsList, setJobsList] = useState([]);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/all`);
      setJobsList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return(
    <div>
        <UpcomingJobs jobsList={jobsList} />
    </div>
  )
}

export default Page;