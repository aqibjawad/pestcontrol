import React from "react";

import styles from "../../../../styles/loginStyles.module.css";

const SecondSection = () => {
    return (
        <div>
            <div className={styles.userFormContainer} style={{ width: "100%" }}>
                <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                    Product Type
                </div>
                <div style={{ position: "relative", width: "570px" }}>
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

            <div className={styles.userFormContainer} style={{ fontSize: "16px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem"
                }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Total Quantity </label>
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
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Per Item quantity  </label>
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

            <div className={styles.userFormContainer} style={{ fontSize: "16px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem"
                }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Unit </label>

                        <div style={{ position: "relative", width: "250px" }}>
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
                    
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Price Per Unit  </label>
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

            <div className={styles.userFormContainer} style={{ width: "100%" }}>
                <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                    Other ingredient
                </div>
                <div style={{ position: "relative", width: "570px" }}>
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
                    MOCCAE approval
                </div>
                <div style={{ position: "relative", width: "570px" }}>
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

            <div className={styles.userFormContainer} style={{ fontSize: "16px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem"
                }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054",  width: "250px" }}> MOCCAE Start date </label>
                        <input
                            type="date"
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
                        <label style={{ marginBottom: "0.5rem", color: "#344054",  width: "250px" }}> MOCCAE expiry date  </label>
                        <input
                            type="date"
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

            <div className={styles.userFormContainer} style={{ fontSize: "16px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem"
                }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> VAT </label>
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
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Supplier name  </label>
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

            <div className={styles.userFormContainer} style={{ width: "100%" }}>
                <div style={{ color: "#344054", fontSize: '16px', marginBottom: "0.5rem" }}>
                    Price
                </div>
                <div style={{ position: "relative", width: "570px" }}>
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
                    Description
                </div>
                <div style={{ position: "relative", width: "570px" }}>
                    <input
                        type="textarea"
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

        </div>
    )
}

export default SecondSection