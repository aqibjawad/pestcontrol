import React from 'react';

import QuoteDetails from "./quoteDetails";
import ServiceProduct from "./serviceProduct";
import Contract from "./contract"

const Page =()=>{
    return(
        <div>

            <QuoteDetails />
            <ServiceProduct />
            <Contract />

        </div>
    )
}

export default Page;