"use client";

import React from "react";

import ServiceReport from "./serviceReport";

import withAuth from "@/utils/withAuth";

const Page=()=>{
  return(
    <ServiceReport />
  )
}

export default withAuth(Page);