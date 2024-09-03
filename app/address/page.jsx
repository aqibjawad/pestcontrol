"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";

import FirsSection from "./add/firstSection"
import SecondSection from "./add/secondSection"
import Head from 'next/head';



const Page = () => {

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
            <FirsSection />
        </div>
    )
}

export default Page;