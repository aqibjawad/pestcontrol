"use client";

import React from "react";
import Transactions from "./transactions";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <Transactions />
    </div>
  );
};

export default withAuth(Page);
