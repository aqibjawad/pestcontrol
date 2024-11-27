import React from "react";
import PrchaseOrder from "./purchaseOrder"
import withAuth from "@/utils/withAuth";

const Page =()=>{
    return(
        <div>            
            <PrchaseOrder />
        </div>
    )
}

export default withAuth(Page);