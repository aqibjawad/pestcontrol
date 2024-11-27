"use client";

import React from "react";
import Vehciles from "./vehciles";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <Vehciles />
    </div>
  );
};

export default withAuth(Page);
