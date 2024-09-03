import React from "react";

import InvoiceDetails from "./invoiceDetails";
import ServiceProduct from "./serviceProduct";
import ContractSummery from "./contractSummery";
import Term from "./terms";

const Page = () => {
  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/leftimage.png" style={{width:"100%"}} />
        <img src="/rightimage.png" style={{width:"100%"}} />
      </div>
      
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/LOGO BLACK 2.png" style={{width:"228px", height:"121px"}} />
        <div style={{
fontWeight:"500",
            fontSize:"24px",
        }}>
            Pest control Invoice
        </div>
      </div>

      <InvoiceDetails />
      <ServiceProduct />
      <ContractSummery />
      <Term />

      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/leftDown.png" style={{width:"100%"}} />
        <img src="/rightDown.png" style={{width:"100%"}} />
      </div>
    </div>
  );
};

export default Page;
