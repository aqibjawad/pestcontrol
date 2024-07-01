"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import "./index.css";

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
        <div>
            <div className="client-head">Client</div>
            <div className="client-descrp">
                Thank you for choosing us to meet your needs. We look forward to serving you with excellence.
            </div>

            <div className="centerContainer">
                <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>

                        <div style={{ display: "flex", flexDirection: "column", width:"500px" }}>
                            <InputWithTitle
                                title={"Full Name"}
                                type={"text"}
                                placeholder={"Full Name"}
                                style={{ width: "500px" }} // Set custom width here
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <InputWithTitle
                                title={"Firm Name"}
                                type={"text"}
                                placeholder={"Firm Name"}
                                style={{ width: "500px" }} // Set custom width here
                            />
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-10">
                <InputWithTitle                
                    title={"Email"}
                    type={"text"}
                    placeholder={"Email"}
                    style={{ width: "100px", marginTop:"5rem" }} 
                />
            </div>

            <div className="mt-10">
                <InputWithTitle                
                    title={"Phone Number"}
                    type={"text"}
                    placeholder={"Phone Number"}
                    style={{ width: "100px", marginTop:"5rem" }} 
                />
            </div>

            <div className="mt-10">
                <InputWithTitle                
                    title={"Mobile Number"}
                    type={"text"}
                    placeholder={"Mobile Number"}
                    style={{ width: "100px", marginTop:"5rem" }} 
                />
            </div>
            
        </div>
    );
};

export default Page;
