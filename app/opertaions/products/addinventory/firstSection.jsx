import React from "react";

import styles from "../../../../styles/loginStyles.module.css";

const FirstSection = () => {
    return (
        <div>
            <div className={styles.userFormContainer} style={{ fontSize: "16px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem"
                }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Inventory Name </label>
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Batch Number </label>
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
                            placeholder=" Umair Khan "
                        />
                    </div>
                </div>
            </div>

            {/* Last 5 Input Fields */}

            <div>

                <div className={styles.userFormContainer} style={{ width: "100%" }}>

                    <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                        Brand
                    </div>

                    <div style={{ position: "relative", width: "489px" }}>
                        <select
                            style={{
                                border: "1px solid #38A73B",
                                borderRadius: "8px",
                                padding: "12px",
                                width: "100%",
                                height: "49px",
                                boxSizing: "border-box",
                            }}
                        >
                            <option value="" disabled selected>
                                Select an option
                            </option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                </div>

                <div className={styles.userFormContainer} style={{ width: "100%" }}>
                    <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                        Manufacture Date
                    </div>
                    <div style={{ position: "relative", width: "489px" }}>
                        <input
                            type="Date"
                            style={{
                                border: "1px solid #38A73B",
                                borderRadius: "8px",
                                padding: "12px 16px 12px 40px",
                                width: "100%",
                                height: "49px",
                                boxSizing: "border-box"
                            }}
                            placeholder="Please enter Email"
                        />
                    </div>
                </div>

                <div className={styles.userFormContainer} style={{ width: "100%" }}>
                    <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                        Expiry Date
                    </div>
                    <div style={{ position: "relative", width: "489px" }}>
                        <input
                            type="Date"
                            style={{
                                border: "1px solid #38A73B",
                                borderRadius: "8px",
                                padding: "12px 16px 12px 40px",
                                width: "100%",
                                height: "49px",
                                boxSizing: "border-box"
                            }}
                            placeholder="Please enter Email"
                        />
                    </div>
                </div>

                <div className={styles.userFormContainer} style={{ width: "100%" }}>
                    <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                        Active ingredients
                    </div>
                    <div style={{ position: "relative", width: "489px" }}>
                        <input
                            type="text"
                            style={{
                                border: "1px solid #38A73B",
                                borderRadius: "8px",
                                padding: "12px 16px 12px 40px",
                                width: "100%",
                                height: "49px",
                                boxSizing: "border-box"
                            }}
                            placeholder="Please enter Email"
                        />
                    </div>
                </div>

                <div className={styles.userFormContainer} style={{ width: "100%" }}>

                    <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                        Product For
                    </div>

                    <div style={{ position: "relative", width: "489px" }}>
                        <select
                            style={{
                                border: "1px solid #38A73B",
                                borderRadius: "8px",
                                padding: "12px",
                                width: "100%",
                                height: "49px",
                                boxSizing: "border-box",
                            }}
                        >
                            <option value="" disabled selected>
                                Select an option
                            </option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>

                </div>

                <div className={styles.userFormContainer}>
                    <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Product Picture </label>

                    <div style={{ marginTop:"1rem", width: "500px", height: "200px", border: '1px dotted #D0D5DD ', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="/upload.png" />

                        <div style={{ fontWeight: "300", fontSize: "14px", textAlign: "center", marginTop:"1rem" }}>
                            Browse and choose the files you want to upload from your computer
                        </div>

                        <img src="/add.png" style={{marginTop:"1rem"}} />

                    </div>
                </div>

                <div className={styles.userFormContainer}>
                    <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Attachments </label>

                    <div style={{ marginTop:"1rem", width: "500px", height: "200px", border: '1px dotted #D0D5DD ', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="/upload.png" />

                        <div style={{ fontWeight: "300", fontSize: "14px", textAlign: "center", marginTop:"1rem" }}>
                            Browse and choose the files you want to upload from your computer
                        </div>

                        <img src="/add.png" style={{marginTop:"1rem"}} />

                    </div>
                </div>

            </div>

        </div>
    )
}

export default FirstSection