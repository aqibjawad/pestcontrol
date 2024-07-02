"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import APICall from "@/networkUtil/APICall";
import { addClient } from "../../networkUtil/Constants";
import "./index.css";

const Page = () => {
    const api = new APICall(); 

    const [name, setFullName] = useState("");
    const [firm_name, setFirmName] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [mobile_number, setMobileNumber] = useState("");
    const [industry_name, setIndustryName] = useState("");
    const [reference, setReference] = useState("");

    const [isLoading, setLoading] = useState(false);

    const handleFormSubmit = async () => {
        setLoading(true); // Start loading

        const formData = {
            role: "5",
            name: name,
            email: email,
            phone_number: phone_number,
            mobile_number: mobile_number,
            firm_name: firm_name,
            industry_name: industry_name,
            reference: reference,
            address: "Lhr",
            city: "Lhr",
            latitude: "12.45555",
            longitude: "32.45555",
            tags: "Javascript,test,test"
        };

        try {
            const response = await api.postDataWithTokn(addClient, formData);

            if (response.error) {
                alert(response.error.error);
                console.log(response.error.error);
            } else {
                alert("Client added successfully!");
                // Optionally, clear form fields or reset state
            }
        } catch (error) {
            console.error("Error adding client:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
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
                        <div className="mt-10" style={{ width: "500px" }}>
                            <InputWithTitle
                                title={"Full Name"}
                                type={"text"}
                                name="name"
                                placeholder={"Full Name"}
                                value={name}
                                onChange={setFullName}
                            />
                        </div>
                        <div className="mt-10" style={{ width: "500px" }}>
                            <InputWithTitle
                                title={"Firm Name"}
                                type={"text"}
                                name="firmName"
                                placeholder={"Firm Name"}
                                value={firm_name}
                                onChange={setFirmName}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="centerContainer">
                <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                    <div className="mt-10" style={{ width: "1000px" }}>
                        <InputWithTitle
                            title={"Email"}
                            type={"text"}
                            name="email"
                            placeholder={"Email"}
                            value={email}
                            onChange={setEmail}
                        />
                    </div>
                    <div className="mt-10" style={{ width: "1000px" }}>
                        <InputWithTitle
                            title={"Phone Number"}
                            type={"text"}
                            name="phoneNumber"
                            placeholder={"Phone Number"}
                            value={phone_number}
                            onChange={setPhoneNumber}
                        />
                    </div>
                    <div className="mt-10" style={{ width: "1000px" }}>
                        <InputWithTitle
                            title={"Mobile Number"}
                            type={"text"}
                            name="mobileNumber"
                            placeholder={"Mobile Number"}
                            value={mobile_number}
                            onChange={setMobileNumber}
                        />
                    </div>
                </div>
            </div>

            <div className="centerContainer">
                <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <div className="mt-10" style={{ width: "500px" }}>
                            <InputWithTitle
                                title={"Industry Name"}
                                type={"text"}
                                name="industryName"
                                placeholder={"Industry Name"}
                                value={industry_name}
                                onChange={setIndustryName}
                            />
                        </div>
                        <div className="mt-10" style={{ width: "500px" }}>
                            <InputWithTitle
                                title={"Reference"}
                                type={"text"}
                                name="reference"
                                placeholder={"Reference"}
                                value={reference}
                                onChange={setReference}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="centerContainer">
                {isLoading ? (
                    <div className="client-save-button loading">Loading...</div>
                ) : (
                    <div className="client-save-button" onClick={handleFormSubmit}>
                        Save
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
