import React from "react";

import FirstSection from "./addPurchase/firstSection"
import SecondSection from "./addPurchase/secondSection"

import ThirdSection from "./addPurchase/thirdSection"

import styles from "../../../styles/loginStyles.module.css";

const AddPurchase = () => {
    return (

        <div>
            <div className={styles.userFormContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                <div style={{ marginTop: "1rem", width: "272px", height: "202px", border: '1px dotted #D0D5DD ', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="/upload.png" alt="Upload" />
                    <div style={{ fontWeight: "300", fontSize: "14px", textAlign: "center", marginTop: "1rem" }}>
                        Browse and choose the files you want to upload from your computer
                    </div>
                    <img src="/add.png" style={{ marginTop: "1rem" }} alt="Add" />
                </div>

            </div>
            <div className="grid grid-cols-12 gap-4" style={{ width: '100%', maxWidth: '1200px' }}>
                <div className="col-span-6">
                    <FirstSection />
                </div>

                <div className="col-span-6">
                    <SecondSection />
                </div>

            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "0.5rem", marginTop: "2rem", color: "#344054" }}> Private notes </label>
                <input
                    type="text"
                    style={{
                        border: "1px solid #38A73B",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        width: "100%",
                        height: "49px",
                        boxSizing: "border-box"
                    }}
                    placeholder=" SAP "
                />
            </div>

            <div className="grid grid-cols-12 gap-4" style={{ width: '100%', maxWidth: '1200px' }}>
                <div className="col-span-12">
                    <ThirdSection />
                </div>


            </div>

        </div>
    )
}

export default AddPurchase