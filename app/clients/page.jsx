import React from "react";

import AllClients from "./all";

import withAuth from "@/utils/withAuth";

const Page =()=>{
  return(
    <div>
      <AllClients />
    </div>
  )
}

export default withAuth(Page);