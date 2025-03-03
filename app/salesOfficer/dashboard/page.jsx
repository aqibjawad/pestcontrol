import React from "react";

import Sales from "../salesMan/sales";
import FollowUps from "../followUp/page";

const Page = () => {
  return (
    <div>
      <div>
        <Sales />
      </div>
      <div className="mt-5">
        <FollowUps />
      </div>
    </div>
  );
};

export default Page;
