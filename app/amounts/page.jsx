"use client";

import React from "react";
import AllPayments from "./allAmounts";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <AllPayments />
    </div>
  );
};

export default withAuth(Page);
