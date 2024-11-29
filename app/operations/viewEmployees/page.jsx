"use client";

import React from "react";

import AllEmployees from "./allEmployees";
import withAuth from "@/utils/withAuth";

const Page =()=>{
  return(
    <AllEmployees />
  )
}

export default withAuth(Page);