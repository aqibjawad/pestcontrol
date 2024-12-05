"use client";

import React from "react";
import withAuth from "@/utils/withAuth";

import FiredEmployees from "./FiredEmployees";

const Page = () => {
  return (
    <div>
      <FiredEmployees />
    </div>
  );
};

export default withAuth(Page);
