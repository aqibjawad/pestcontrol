"use client";

import React, { useState } from "react";

import AllEmployees from "@/app/operations/viewEmployees/allEmployees";
import SalarCal from "../salaryCal/page";
import CommissionCal from "../comCal/page";
import SalaryTotal from "../salaryTotal/page";

import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <div>
        <AllEmployees />
      </div>
      <div className="mt-10 mb-10">
        <SalarCal />
      </div>
      <div className="mt-10 mb-10">
        <CommissionCal />
      </div>
      <div className="mt-10 mb-10">
        <SalaryTotal />
      </div>
    </div>
  );
};

export default withAuth(Page);
