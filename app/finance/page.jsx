import React from "react";
import CommissionCal from "@/app/hr/comCal/page";
import Invoices from "@/app/invoice/invoices";

import All from "../accountant/all/page";

const Finance = () => {
  const accountStatement = () => {
    return (
      <div>
        <div className="pageTitle"></div>
        <div className="flex">
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-10">
        <All />
      </div>
      <CommissionCal />
      <div className="mt-10 mb-10">{accountStatement()}</div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 ">
          <Invoices />
        </div>
      </div>
    </div>
  );
};

export default Finance;
