import React from 'react';

import ContractDetails from './contractDetails';
import ContractSummery from './contractSummery';
import ContractJob from './job';
import ContractInvoices from "./contractInvoices";

const Page =()=>{
    return(
        <div>

            <ContractDetails />
            <ContractSummery />
            <ContractJob />
            <ContractInvoices />

        </div>
    )
}

export default Page;