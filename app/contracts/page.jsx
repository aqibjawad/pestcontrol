"use client";

import React from "react";

import Contracts from "../../components/Contracts"
const Page =({quoteList})=>{


  return(
    <div>
        <Contracts quoteList={quoteList} />
    </div>
  )
} 

export default Page;