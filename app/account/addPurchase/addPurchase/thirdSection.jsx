import React from "react";

import "./index.css"

import styles from "../../../../styles/loginStyles.module.css";

const ThirdSection = () => {
    return (
        <div className="third-section">
            <div className={styles.userFormContainer} style={{ fontSize: "16px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem"
                }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Item </label>
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
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Quantity </label>
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

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Price </label>
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

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "0.5rem", color: "#344054" }}> Sub Total </label>
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

            <div className="add-newline">
                Add New Line
            </div>

            <div className="flex justify-between mt-4">
                <div className="flex flex-col">
                    <div className="sub-total">Subtotal</div>
                    <div className="discount">discount:</div>
                    <div className="vat">VAT</div>
                    <div className="total">Grand Total</div>
                </div>

                <div className="flex flex-col">
                    <div className="sub-total">Subtotal</div>
                    <div>
                        <div className="flex mt-4">
                            <div className="discount-button flex flex-col">
                                0
                            </div>

                            <div className="discount-perc flex flex-col">
                                %
                            </div>
                        </div>
                    </div>
                    <div className="vat">VAT</div>
                    <div className="total">Grand Total</div>
                </div>
            </div>
        </div>
    )
}

export default ThirdSection