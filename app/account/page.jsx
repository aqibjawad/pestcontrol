import React from "react";
import Customers from "../../components/Customer";
import Transactions from "../../components/Transactions";
const Page = () => {
  return (
    <div>
      <div className="pageTitle">Sales</div>

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-9">
          <Customers />
          <div className="mt-10">
            <Transactions />
          </div>
        </div>
        <div className="col-span-3">Alert here</div>
      </div>
    </div>
  );
};

export default Page;
