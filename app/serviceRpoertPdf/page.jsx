import React from "react";

import ClientDetails from "./clientDetails";
import Visit from "./visit";
import Area from "./areas";
import Cemicals from "./chemical";
import PestType from "./pestType";

import Terms from "./term"

const Page = () => {
  return (
    <div>
      <ClientDetails />
      <Visit />
      <Area />

      <div className="flex justify-between">
        <div className="flex flex-col" style={{ marginTop: "10rem" }}>
          <PestType />
        </div>

        <div className="flex flex-col">
          <Cemicals />
        </div>
      </div>

      <Terms />

    </div>
  );
};

export default Page;
