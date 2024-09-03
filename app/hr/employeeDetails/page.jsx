import React from "react";
import PersonalDetails from "./personlDetails";
import Identification from "./identification";
import Insurance from "./insurrance";
import Contact from "./contact";

const Page =()=>{
    return(
        <div>
            <PersonalDetails />
            <Identification />
            <Insurance />
            <Contact />
        </div>
    )
}

export default Page;