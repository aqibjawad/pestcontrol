import React from 'react';

import ClientDetails from './clientDetails';
import TypeVisit from "./visit"
import Area from './area';
import UseChemicals from "./useeChemical";
import Extra from "./extra";
import Remarks from "./remarks";

const Page =()=>{
    return(
        <div> 

            <ClientDetails />
            <TypeVisit />
            <Area />
            <UseChemicals />
            <Extra />
            <Remarks />

        </div>
    )
}

export default Page;