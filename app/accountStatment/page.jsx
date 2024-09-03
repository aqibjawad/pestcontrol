import React from "react";

import AccountDetails from "./accountDetails";
import StatmentAccount from "./statment";
import AmountRegards from "./amountRegard";

const Page = () => {
  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/leftimage.png" style={{ width: "100%" }} />
        <img src="/rightimage.png" style={{ width: "100%" }} />
      </div>
        
        <AccountDetails />
        <StatmentAccount />
        <AmountRegards />

      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/leftDown.png" style={{width:"100%"}} />
        <img src="/rightDown.png" style={{width:"100%"}} />
      </div>
    </div>
  );
};

export default Page;
