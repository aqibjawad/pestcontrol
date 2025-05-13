"use client";

import React from "react";

import ServiceReport from "./serviceReport";

import withAuth from "@/utils/withAuth";

// import ServiceProductReport from "./products";

const Page = () => {
  return (
    <div>
      <ServiceReport />
      {/* <ServiceProductReport /> */}
    </div>
  );
};

export default withAuth(Page);
