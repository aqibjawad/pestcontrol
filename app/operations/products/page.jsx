"use client";

import React from "react";
import Inventory from "./inventroy"

import withAuth from "@/utils/withAuth";

const Index =()=>{
    return(
        <div>
            <Inventory />
        </div>
    )
}

export default withAuth(Index)