"use client";
import UpcomingJobs from "@/components/UpcomingJobs";
import React, { useState } from "react";
import AssignedJobs from "@/components/AssignedJobs";
import { Grid, Box } from "@mui/material";

const Index = () => {
  return (
    <div className=" w-full">
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <UpcomingJobs />
          <AssignedJobs />
        </Grid>

        {/* 3-column section */}
        <Grid item xs={12} md={3}>
          alerts here
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;
