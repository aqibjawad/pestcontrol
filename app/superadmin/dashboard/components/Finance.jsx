import React from "react";
import styles from "../../../../styles/superAdmin/finanaceStyles.module.css";
import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";
import DateFilters from "@/components/generic/DateFilters";

import CommissionCal from "@/app/hr/comCal/page";
import Invoices from "@/app/invoice/invoices";

import All from "../../../accountant/all/page";

const Finance = ({ isVisible }) => {

  const accountStatement = () => {
    return (
      <div>
        <div className="pageTitle"></div>
        <div className="flex">
          {/* <div className="flex-grow">
            <div className="mt-5">
              <SearchInput />
            </div>
          </div> */}
          {/* <div className="flex">
            <GreenButton title={"Client"} />
            <GreenButton title={"Vendor"} />
          </div> */}

          {/* <AllClients /> */}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-10">
        <All />
      </div>
      {/* <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">{totalExpenses()}</div>
        <div className="col-span-6 ">{cashCollection()}</div>
      </div> */}
      {/* <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-6">{posCollection()}</div>
        <div className="col-span-6 ">{bankCollection()}</div>
      </div> */}

      <CommissionCal isVisible={isVisible} />
      <div className="mt-10 mb-10">{accountStatement()}</div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 ">
          <Invoices isVisible={isVisible} />
        </div>
        {/* <div className="col-span-6 ">{paymentReceipt()}</div>
        <div className="col-span-6 ">{paymentVouchers()}</div> */}
      </div>
    </div>
  );
};

export default Finance;
