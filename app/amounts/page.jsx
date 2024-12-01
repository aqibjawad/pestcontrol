"use client";

import React from "react";
import AllPayments from "./allAmounts";
import withAuth from "@/utils/withAuth";
import Invoices from "../invoice/invoices";

const Page = () => {
  return (
    <div>
      <Invoices />
    </div>
  );
};

export default withAuth(Page);
