"use client";

import React from "react";

import CustomerDetails from "./customerDetails";
import ClientRecords from './cleintRecords';
import VisitRecords from "./visitRecords";
import Terms from "./terms";
import withAuth from "@/utils/withAuth";

const Page =()=>{
    return(
        <div>

            <CustomerDetails />
            <ClientRecords />
            <VisitRecords />
            <Terms />

        </div>
    )
}

export default withAuth(Page);