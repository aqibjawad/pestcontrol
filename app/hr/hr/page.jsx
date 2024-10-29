"use client";

import React, { useState } from "react";

import AllEmployees from "@/app/operations/viewEmployees/allEmployees";
import SalarCal from "../salaryCal/page";
import CommissionCal from "../comCal/page";

import MonthPicker from "../monthpicker";

const Page = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  return (
    <div>
      <div className="max-w-3xl mx-auto mb-6">
        <MonthPicker onMonthChanged={(date) => setSelectedMonth(date)} />
      </div>
      <div>
        <AllEmployees selectedMonth={selectedMonth} />
      </div>
      <div className="mt-10 mb-10">
        <SalarCal selectedMonth={selectedMonth} />
      </div>
      <div className="mt-10 mb-10">
        <CommissionCal selectedMonth={selectedMonth} />
      </div>
    </div>
  );
};

export default Page;
