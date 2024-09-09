import React from "react";

import ContractDetails from "./contractDetails";
import ContractSummery from "./contractSummery";
import ContractJob from "./job";
import ContractInvoices from "./contractInvoices";
import Contracts from "@/components/Contracts";

const Page = () => {
  return (
    <div>
      {/* <ContractDetails />
      <ContractSummery />
      <ContractJob />
      <ContractInvoices /> */}

      <Contracts />
    </div>
  );
};

export default Page;
