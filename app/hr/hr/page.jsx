"use client";

import React, { useState } from "react";

import AllEmployees from "@/app/operations/viewEmployees/allEmployees";
import SalarCal from "../salaryCal/page";
import CommissionCal from "../comCal/page";

import MonthPicker from "../monthPicker";
import withAuth from "@/utils/withAuth";

const Page = () => {
  

  return (
    <div>
      <div>
        <AllEmployees  />
      </div>
      <div className="max-w-3xl mx-auto mb-6 mt-10">
        
      </div>
      <div className="mt-10 mb-10">
        <SalarCal  />
      </div>
      <div className="mt-10 mb-10">
        <CommissionCal  />
      </div>
    </div>
  );
};

export default withAuth(Page);
