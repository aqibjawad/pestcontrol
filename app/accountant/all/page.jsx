import React from "react";

import All from "./all";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <All />
    </div>
  );
};

export default withAuth(Page);
