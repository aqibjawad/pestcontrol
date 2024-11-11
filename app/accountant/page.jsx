import React from "react";

// import AllCustomers from "../allCustomers/allCustomers";
import All from "./all/all";
import Transactions from "./viewTransactions/transactions";
import Invoices from "../invoice/invoices";
import Vehciles from "../account/viewVehicles/vehciles"; 
import Pending from "./payments/pending";

const Page =()=>{
    return(
        <div>
            <All />
            <Pending />
            {/* <AllCustomers /> */}
            <Transactions />
            <Invoices />
            <Vehciles />
        </div>
    )
}

export default Page;