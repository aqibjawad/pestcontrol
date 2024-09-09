import React from "react";

import JobDetails from "./jobDetails";
import SchedulePlan from "./schedulePlan";
import Members from "./members";
import Instruction from "./instruction";
import ResheduleTreatment from "./rescheduleTreat"

const Page = () => {
  return (
    <div>
      <JobDetails />
      <Members />
      <Instruction />
      <ResheduleTreatment />
      {/* <SchedulePlan /> */}
    </div>
  );
};

export default Page;
