"use client";

import React from "react";
import SalaryDetails from "./salaryDetails";
import Terms from "./terms";
import InvoiceDetails from "./invoiceDetails";
import withAuth from "@/utils/withAuth";

const Page = () => {
  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/leftimage.png" style={{ width: "100%" }} />
        <img src="/rightimage.png" style={{ width: "100%" }} />
      </div>

      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/LOGO BLACK 2.png" style={{ width: "228px", height: "121px" }}/>
        <div>
            <div style={{ fontWeight: "500", fontSize: "24px" }}>
                Pest control Invoice
            </div>

            <div style={{ fontWeight: "600", fontSize: "20px",color:"#58A942", textAlign:'center' }}>
                Umair Khan
            </div>
        </div>
      </div>

      <InvoiceDetails />
      <SalaryDetails />
      <Terms />

      <div className="flex justify-between" style={{ padding: "34px" }}>
        <img src="/leftDown.png" style={{ width: "100%" }} />
        <img src="/rightDown.png" style={{ width: "100%" }} />
      </div>
    </div>
  );
};

export default withAuth(Page);
