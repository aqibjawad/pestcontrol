"use client";

import React from "react";
import Pending from "./pending";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <Pending />
    </div>
  );
};

export default withAuth(Page);
