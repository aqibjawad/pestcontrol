"use client";

import React from "react";
import AllJobs from "./jobs";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <AllJobs />
    </div>
  );
};

export default withAuth(Page);
