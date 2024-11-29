"use client";

import Vendors from "@/components/Vendors";
import React from "react";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <Vendors />
    </div>
  );
};

export default withAuth(Page);
