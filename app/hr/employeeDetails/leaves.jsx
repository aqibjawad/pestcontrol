"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";
import { leave } from "@/networkUtil/Constants";

import APICall from "@/networkUtil/APICall";

const Leaves = () => {
  const api = new APICall();

  const searchParams = useSearchParams();
  const employee_id = searchParams.get("id"); // Extracting employee ID from URL

  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [total_days, setTotalDays] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleStartDate = (name, value) => {
    setStartDate(value);
  };

  const handleEndDate = (name, value) => {
    setEndDate(value);
  };

  const handleReason = (name, value) => {
    console.log("Reason updated:", value);
    setReason(value);
  };

  useEffect(() => {
    if (start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);
      const diffTime = end - start;
      const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
      setTotalDays(diffDays > 0 ? diffDays : "Invalid Range");
    }
  }, [start_date, end_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      employee_id, // Pass extracted employee ID
      start_date,
      end_date,
      total_days,
      reason: reason || "",
    };

    const response = await api.postFormDataWithToken(`${leave}/create`, obj);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Data has been added successfully!",
    });
    setLoadingSubmit(false);

    // if (response.message === "message") {
    // } else {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: response.error?.message || "Something went wrong",
    //   });
    // }
  };

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={4}>
        <InputWithTitle3
          onChange={handleStartDate}
          value={start_date}
          type="date"
          title="Start Date"
        />
      </Grid>
      <Grid item xs={4}>
        <InputWithTitle3
          onChange={handleEndDate}
          value={end_date}
          type="date"
          title="End Date"
        />
      </Grid>
      <Grid item xs={4}>
        <InputWithTitle
          type="text"
          title="Total Days"
          value={total_days}
          readOnly
        />
      </Grid>
      <Grid item xs={4}>
        <InputWithTitle
          onChange={setReason}
          value={reason}
          type="text"
          title="Reason"
        />
      </Grid>

      <div className="mt-10 ml-10">
        <GreenButton
          onClick={handleSubmit}
          title={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )
          }
          disabled={loadingSubmit}
        />
      </div>
    </Grid>
  );
};

export default Leaves;
