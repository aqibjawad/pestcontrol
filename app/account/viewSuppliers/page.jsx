"use client";

import React from "react";

import ViewSuppliers from "./suppliers";
import withAuth from "@/utils/withAuth";

const Page =()=>{
    return(
        <div>
            <ViewSuppliers />
        </div>
    )
};

export default withAuth(Page);