"use client";

import React from "react";

import Invoices from "./invoices";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <Invoices />
    </div>
  );
};

export default withAuth(Page);
