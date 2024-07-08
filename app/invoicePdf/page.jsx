import React from 'react';

import InvoiceDetails from "./invoiceDetails";
import ServiceProduct from "./serviceProduct";
import Term from "./terms"

const Page =()=>{
    return(
        <div>
            
            <InvoiceDetails />
            <ServiceProduct />
            <Term />

        </div>
    )
}

export default Page;