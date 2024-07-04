import React from 'react';

import CustomerDetails from "./customerDetails";
import PriorityJob from "./priorityJob"
import ServiceProduct from "./serviceProduct";
import TermsConditions from "./terms";

const Page =()=>{
    return(
        <div>
            <div className="pageTitle"> Create Job </div>

            <CustomerDetails />
            <PriorityJob />
            <ServiceProduct />
            <TermsConditions />
            
        </div>
    )
}

export default Page;