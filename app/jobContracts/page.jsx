import React from "react";

import Contracts from "../../components/Contracts"
import withAuth from "@/utils/withAuth";

const Page =()=>{
    return(
        <div>
            <Contracts />
        </div>
    )
}

export default withAuth(Page);