import React from 'react';

import FirstSection from './add/firstSection';
import ServiceAgreement from "./add/serviceagreement"
import SecondSection from './add/secondSection';
import TreatmentMethod from "./add/treatmentMethod";
import FourthSection from './add/fourthSection';
import Invoice from "./add/invoice";
import ContractSummery from "./add/contract";
import Scope from "./add/scope";
import TermConditions from "./add/terms"


import "./index.css"

const Page =()=>{
    return(
        <div>
            <div className='quote-main-head'>
                Quotes
            </div>

            <div className='quote-main-decrp'>
                us to meet your needs. We look forward to serving you with excellenc
            </div>
            
            <FirstSection />
            <ServiceAgreement />
            <SecondSection />
            <TreatmentMethod />
            <FourthSection />
            <Invoice />
            <ContractSummery />
            <Scope />
            <TermConditions />

        </div>
    )
}

export default Page;