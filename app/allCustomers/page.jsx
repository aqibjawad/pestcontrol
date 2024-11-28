"use client";

import React from "react";
import AllCustomers from "./allCustomers"
import withAuth from "@/utils/withAuth";
const Page =()=>{
  return(
    <div>
      <AllCustomers />
    </div>
  )
}
export default withAuth(Page);