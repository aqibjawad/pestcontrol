"use client";

import React, { useState } from "react";
import All from "./all/all";
import Transactions from "./viewTransactions/transactions";
import Invoices from "../invoice/invoices";
import Vehicles from "../account/viewVehicles/vehciles";
import Pending from "./payments/pending";
import CommissionCal from "../hr/comCal/page";

import AdvanceCheques from "../cheques/advanceCheques";;

const Page = () => {
  const [activeTab, setActiveTab] = useState("advance");

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Left Grid Section */}
      <div className="col-span-2 space-y-4">
        <All />
        <Pending />
        <Transactions />
        <Invoices />
        <CommissionCal />
        <Vehicles />
      </div>

      {/* Right Grid Section (Tabs) */}
      <div className="col-span-1 border p-4 rounded-lg bg-gray-100">
        <div className="flex justify-between border-b pb-2">
          <button
            className={`px-4 py-2 ${
              activeTab === "advance"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("advance")}
          >
            Advance Cheques
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "recieved"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("recieved")}
          >
            Recieved Cheques
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "advance" && <AdvanceCheques />}
          {activeTab === "recieved" && "test 2"}
        </div>
      </div>
    </div>
  );
};

export default Page;
