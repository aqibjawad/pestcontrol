"use client";

import React from "react";

import AllEmployees from "@/app/operations/viewEmployees/allEmployees";
import SalarCal from "../salaryCal/page";
import CommissionCal from "../comCal/page"


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
    </div>
  );
};

export default Page;
