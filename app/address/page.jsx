"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";

import FirsSection from "./add/firstSection"
import SecondSection from "./add/secondSection"


const Page = () => {

    // Example state to handle input value
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleZipCodeChange = (event) => {
        setZipCode(event.target.value);
    };


    return (
        <div className="centerContainer">
            <div className="grid grid-cols-12 gap-4" style={{ width: '100%', maxWidth: '1200px' }}>
                <div className="col-span-6">
                    <FirsSection />
                </div>

                <div className="col-span-6">
                    <SecondSection />
                </div>

            </div>
        </div>
    )
}

export default Page;