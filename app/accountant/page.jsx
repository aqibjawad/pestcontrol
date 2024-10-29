import React from "react";

import AllCustomers from "../allCustomers/allCustomers";
import Transactions from "./viewTransactions/transactions";
import Invoices from "../invoice/invoices";
import Vehciles from "../account/viewVehicles/vehciles";

const Page =()=>{
    return(
        <div>
            <AllCustomers />
            <Transactions />
            <Invoices />
            <Vehciles />
        </div>
    )
}

export default Page;